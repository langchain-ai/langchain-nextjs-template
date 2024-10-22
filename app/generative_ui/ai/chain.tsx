import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { Place } from "@/app/generative_ui/components/place";
import { createRunnableUI } from "../utils/server";
import { search, images } from "./tools";
import { Images } from "../components/image";
import { tool } from "@langchain/core/tools";

const searchTool = tool(
  async (input, config) => {
    const stream = await createRunnableUI(config);
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
  {
    name: "SerpAPI",
    description:
      "A search engine. useful for when you need to answer questions about current events. input should be a search query.",
    schema: z.object({ query: z.string() }),
  },
);

const imagesTool = tool(
  async (input, config) => {
    const stream = await createRunnableUI(config);
    stream.update(<div>Searching...</div>);

    const result = await images(input);
    stream.done(
      <Images
        images={result.images_results
          .map((image) => image.thumbnail)
          .slice(0, input.limit)}
      />,
    );

    return `[Returned ${result.images_results.length} images]`;
  },
  {
    name: "Images",
    description: "A tool to search for images. input should be a search query.",
    schema: z.object({
      query: z.string().describe("The search query used to search for cats"),
      limit: z.number().describe("The number of pictures shown to the user"),
    }),
  },
);

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
  model: "gpt-4o-mini",
  temperature: 0,
  streaming: true,
});

const tools = [searchTool, imagesTool];

export const agentExecutor = new AgentExecutor({
  agent: createToolCallingAgent({ llm, tools, prompt }),
  tools,
});
