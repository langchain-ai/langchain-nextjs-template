import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { ChatOpenAI } from "@langchain/openai";
import { DynamicStructuredTool } from "langchain/tools";

import { z } from "zod";

import { Place } from "@/app/generative_ui/components/place";
import { createRunnableUI } from "../utils/server";
import { calculator, search, images } from "./tools";
import { Image } from "../components/image";

const calculatorTool = new DynamicStructuredTool({
  name: "Calculator",
  description: "a calculator. input should be a mathematical expression.",
  schema: z.object({
    expression: z.string().describe("The mathematical expression"),
  }),
  func: async (input, config) => {
    const stream = createRunnableUI(config, <div>Calculating...</div>);
    const result = calculator(input);

    stream.done(
      <div>
        These are the results:{" "}
        <pre>{JSON.stringify(JSON.parse(result), null, 2)}</pre>
      </div>,
    );

    return result;
  },
});

const searchTool = new DynamicStructuredTool({
  name: "SerpAPI",
  description:
    "A search engine. useful for when you need to answer questions about current events. input should be a search query.",
  schema: z.object({ query: z.string() }),
  func: async (input, config) => {
    const stream = createRunnableUI(config);
    stream.update(<div>Searching the internet...</div>);

    const result = await search(input);

    stream.done(
      <div className="flex gap-2 flex-wrap justify-end">
        {JSON.parse(result).map((place: any, index: number) => (
          <Place place={place} key={index} />
        ))}
      </div>,
    );

    return result;
  },
});

const imagesTool = new DynamicStructuredTool({
  name: "Images",
  description: "A tool to search for images. input should be a search query.",
  schema: z.object({
    query: z.string().describe("The search query used to search for cats"),
    limit: z.number().describe("The number of pictures shown to the user"),
  }),
  func: async (input, config) => {
    const stream = createRunnableUI(config);
    stream.update(<div>Searching...</div>);

    const result = await images(input);
    stream.done(
      <div className="flex gap-2">
        {result.images_results
          .map((image, idx) => {
            // eslint-disable-next-line jsx-a11y/alt-text
            return <Image key={idx} src={image.thumbnail} />;
          })
          .slice(0, input.limit)}
      </div>,
    );

    return `[Returned ${result.images_results.length} images]`;
  },
});

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a talking parrot named Polly. All final responses must be how a talking parrot would respond. Squawk often!`,
  ],
  new MessagesPlaceholder("chat_history"),
  ["human", "{input}"],
  new MessagesPlaceholder("agent_scratchpad"),
]);

const llm = new ChatOpenAI({
  modelName: "gpt-3.5-turbo-1106",
  temperature: 0,
  streaming: true,
});

const tools = [calculatorTool, searchTool, imagesTool];

export const agentExecutor = new AgentExecutor({
  agent: createToolCallingAgent({ llm, tools, prompt }),
  tools,
});
