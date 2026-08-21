"use server";

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { TavilySearch } from "@langchain/tavily";
import {
  AgentExecutor,
  createToolCallingAgent,
} from "@langchain/classic/agents";
import { pull } from "@langchain/classic/hub";
import { createStreamableValue } from "@ai-sdk/rsc";

import { getChatModel } from "@/lib/llm";

export async function runAgent(input: string) {
  "use server";

  const stream = createStreamableValue();
  (async () => {
    const tools = [new TavilySearch({ maxResults: 1 })];
    const prompt = await pull<ChatPromptTemplate>(
      "hwchase17/openai-tools-agent",
    );

    const llm = getChatModel({ temperature: 0 });

    const agent = createToolCallingAgent({
      llm,
      tools,
      prompt,
    });

    const agentExecutor = new AgentExecutor({ agent, tools });

    const streamingEvents = agentExecutor.streamEvents(
      { input },
      { version: "v2" },
    );

    for await (const item of streamingEvents) {
      stream.update(JSON.parse(JSON.stringify(item, null, 2)));
    }

    stream.done();
  })();

  return { streamData: stream.value };
}
