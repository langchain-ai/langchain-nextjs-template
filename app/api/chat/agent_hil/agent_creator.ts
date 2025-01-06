import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { pool } from "@/app/lib/db";

import { z } from "zod";

import {
  Annotation,
  Command,
  MessagesAnnotation,
  StateGraph,
  interrupt,
} from "@langchain/langgraph";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { AIMessage, HumanMessage } from "@langchain/core/messages";

const GraphAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  // isResuming is very useful if you want to ignore some workflow in some node
  // that you want to ignore when the graph is resuming the run for the first time
  // after interrupt happened
  isResuming: Annotation<boolean>({
    reducer: (currentState, updateValue) => updateValue,
    default: () => false,
  }),
  gotoNext: Annotation<string>({
    reducer: (currentState, updateValue) => updateValue,
    default: () => "",
  }),
});

const MainAgentChatPrompt = ChatPromptTemplate.fromMessages([
  ["system", `You're a helpful assistant.`],
  ["placeholder", "{chat_history}"],
]);

const mainAgent = async (state: typeof GraphAnnotation.State) => {
  const { messages } = state;

  const structuredOutput = z.object({
    goto: z
      .enum(["weatherAgent", "calculatorAgent", "mainAgent"])
      .describe(
        "The next agent to run after user confirmation" +
          "weatherAgent helps with weather queries" +
          "calculatorAgent helps with calculations" +
          "mainAgent is the main agent that handles the user's message",
      ),
    response: z.string().describe("Human readable response to user's message"),
  });

  const input = await MainAgentChatPrompt.invoke({ chat_history: messages });

  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
  });

  const response = await model
    .withStructuredOutput(structuredOutput)
    .invoke(input);

  return new Command({
    goto: "humanNode",
    update: {
      messages: [new AIMessage(response.response)],
      gotoNext: response.goto,
    },
  });
};

const humanNode = async (state: typeof GraphAnnotation.State) => {
  const { gotoNext } = state;

  // we're not using the object here. we ask for string feedback.
  const input = await interrupt<{}, string>({});

  if (input === "yes" || input === "y") {
    return new Command({
      goto: gotoNext,
      update: {
        messages: [new HumanMessage(input)],
        gotoNext: "", // reset the gotoNext
        isResuming: false,
      },
    });
  }

  return new Command({
    goto: "mainAgent",
    update: {
      messages: [new HumanMessage(input)],
      gotoNext: "", // reset the gotoNext
    },
  });
};

const weatherAgent = async (state: typeof GraphAnnotation.State) => {
  // sleep for 2 seconds to simulate weather agent
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const weather = "It's sunny and 70 degrees";

  return new Command({
    goto: "mainAgent",
    update: {
      messages: [new AIMessage(weather)],
    },
  });
};

const calculatorAgent = async (state: typeof GraphAnnotation.State) => {
  const calculator = "The answer is 42";

  return new Command({
    goto: "mainAgent",
    update: {
      messages: [new AIMessage(calculator)],
    },
  });
};

export const setupCheckpointer = async (): Promise<void> => {
  const checkpointer = new PostgresSaver(pool);

  // NOTE: you need to call .setup() the first time you're using your checkpointer
  await checkpointer.setup();
};

export const createAgent = () => {
  // Initialize the checkpointer with the database pool
  const checkpointer = new PostgresSaver(pool);

  // Build graph.
  const graph = new StateGraph(GraphAnnotation)
    .addNode("mainAgent", mainAgent, {
      ends: ["humanNode", "weatherAgent", "calculatorAgent"],
    })
    .addNode("humanNode", humanNode, {
      ends: ["mainAgent", "weatherAgent", "calculatorAgent"],
    })
    .addNode("weatherAgent", weatherAgent, {
      ends: ["mainAgent"],
    })
    .addNode("calculatorAgent", calculatorAgent, {
      ends: ["mainAgent"],
    })
    .addEdge("__start__", "mainAgent");

  return graph.compile({
    checkpointer,
  });
};
