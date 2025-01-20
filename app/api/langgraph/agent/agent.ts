import {
  StateGraph,
  MessagesAnnotation,
  START,
  END,
  Annotation,
} from "@langchain/langgraph";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { SystemMessage } from "@langchain/core/messages";

const builder = new StateGraph(
  Annotation.Root({
    messages: MessagesAnnotation.spec["messages"],
    timestamp: Annotation<number>,
  }),
)
  .addNode("agent", async (state) => {
    const message = await new ChatOpenAI({ modelName: "gpt-4o-mini" })
      .bindTools([new TavilySearchResults({ maxResults: 4 })])
      .invoke([
        new SystemMessage({
          content:
            "You are a web search agent that uses tools to search the web for information",
        }),
        ...state.messages,
      ]);

    return { messages: message, timestamp: Date.now() };
  })
  .addEdge(START, "agent");

export const graph = builder.compile();
