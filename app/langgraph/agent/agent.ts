import {
  StateGraph,
  MessagesAnnotation,
  START,
  Annotation,
} from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({ 
  model: "gemini-2.5-flash", 
  apiVersion: "v1beta",
  temperature: 0 
});

const builder = new StateGraph(
  Annotation.Root({
    messages: MessagesAnnotation.spec["messages"],
    timestamp: Annotation<number>,
  }),
)
  .addNode("agent", async (state, config) => {
    const message = await llm.invoke([
      {
        type: "system",
        content:
          "Bạn là một Trợ lý TAE Chatbot chuyên nghiệp. " +
          "Hãy trả lời người dùng một cách lịch sự, hữu ích và ngắn gọn bằng tiếng Việt.",
      },
      ...state.messages,
    ]);

    return { messages: message, timestamp: Date.now() };
  })
  .addEdge(START, "agent");

export const graph = builder.compile();

