import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";

import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";

import { AIMessage, ChatMessage, HumanMessage } from "langchain/schema";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";

export const runtime = "edge";

const convertVercelMessageToLangChainMessage = (message: VercelChatMessage) => {
  if (message.role === "user") {
    return new HumanMessage(message.content);
  } else if (message.role === "assistant") {
    return new AIMessage(message.content);
  } else {
    return new ChatMessage(message.content, message.role);
  }
};

const PREFIX_TEMPLATE = `You are a talking parrot named Polly. All final responses must be how a talking parrot would respond.`;

/**
 * This handler initializes and calls an OpenAI Functions agent.
 * See the docs for more information:
 *
 * https://js.langchain.com/docs/modules/agents/agent_types/openai_functions_agent
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    /**
     * We represent intermediate steps as system messages for display purposes,
     * but don't want them in the chat history.
     */
    const messages = (body.messages ?? []).filter(
      (message: VercelChatMessage) =>
        message.role === "user" || message.role === "assistant",
    );
    const returnIntermediateSteps = body.show_intermediate_steps;
    const previousMessages = messages
      .slice(0, -1)
      .map(convertVercelMessageToLangChainMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    // Requires process.env.SERPAPI_API_KEY to be set: https://serpapi.com/
    const tools = [new Calculator(), new SerpAPI()];
    const chat = new ChatOpenAI({ modelName: "gpt-4", temperature: 0 });

    /**
     * The default prompt for the OpenAI functions agent has a placeholder
     * where chat messages get injected - that's why we set "memoryKey" to
     * "chat_history". This will be made clearer and more customizable in the future.
     */
    const executor = await initializeAgentExecutorWithOptions(tools, chat, {
      agentType: "openai-functions",
      verbose: true,
      returnIntermediateSteps,
      memory: new BufferMemory({
        memoryKey: "chat_history",
        chatHistory: new ChatMessageHistory(previousMessages),
        returnMessages: true,
        outputKey: "output",
      }),
      agentArgs: {
        prefix: PREFIX_TEMPLATE,
      },
    });

    const result = await executor.call({
      input: currentMessageContent,
    });

    // Intermediate steps are too complex to stream
    if (returnIntermediateSteps) {
      return NextResponse.json(
        { output: result.output, intermediate_steps: result.intermediateSteps },
        { status: 200 },
      );
    } else {
      /**
       * Agent executors don't support streaming responses (yet!), so stream back the
       * complete response one character at a time with a delay to simluate it.
       */
      const textEncoder = new TextEncoder();
      const fakeStream = new ReadableStream({
        async start(controller) {
          for (const character of result.output) {
            controller.enqueue(textEncoder.encode(character));
            await new Promise((resolve) => setTimeout(resolve, 20));
          }
          controller.close();
        },
      });

      return new StreamingTextResponse(fakeStream);
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
