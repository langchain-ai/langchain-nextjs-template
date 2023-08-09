import { NextRequest } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";

import { createClient } from "@supabase/supabase-js";

import { ChatOpenAI } from "langchain/chat_models/openai";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { AIMessage, ChatMessage, HumanMessage } from "langchain/schema";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import {
  createRetrieverTool,
  OpenAIAgentTokenBufferMemory,
} from "langchain/agents/toolkits";
import { ChatMessageHistory } from "langchain/memory";
import { initializeAgentExecutorWithOptions } from "langchain/agents";

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

const TEMPLATE = `You are a stereotypical robot and must answer all questions like a stereotypical robot. Use lots of interjections like "BEEP" and "BOOP".

If you don't know how to answer a question, use the available tools to look up relevant information.`;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const messages = body.messages;
  const previousMessages = messages.slice(0, -1);
  const currentMessageContent = messages[messages.length - 1].content;

  const model = new ChatOpenAI({
    modelName: "gpt-4",
  });

  const client = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PRIVATE_KEY!,
  );
  const vectorstore = new SupabaseVectorStore(new OpenAIEmbeddings(), {
    client,
    tableName: "documents",
    queryName: "match_documents",
  });

  const chatHistory = new ChatMessageHistory(
    previousMessages.map(convertVercelMessageToLangChainMessage),
  );

  const memory = new OpenAIAgentTokenBufferMemory({
    llm: model,
    memoryKey: "chat_history",
    outputKey: "output",
    chatHistory,
  });

  const retriever = vectorstore.asRetriever();

  const tool = createRetrieverTool(retriever, {
    name: "search_latest_knowledge",
    description: "Searches and returns up-to-date general information.",
  });

  const executor = await initializeAgentExecutorWithOptions([tool], model, {
    agentType: "openai-functions",
    memory,
    returnIntermediateSteps: true,
    verbose: true,
    agentArgs: {
      prefix: TEMPLATE,
    },
  });

  const result = await executor.call({
    input: currentMessageContent,
  });

  // Agents don't support streaming responses (yet!), so stream back the complete response one
  // character at a time to simluate it.
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
