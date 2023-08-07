import { NextApiResponse } from "next";
import { NextRequest } from "next/server";
import { StreamingTextResponse } from "ai";

import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatMessage } from "langchain/schema";
import { BytesOutputParser } from "langchain/schema/output_parser";
import { PromptTemplate } from "langchain/prompts";
import { RunnableSequence } from "langchain/schema/runnable";

export const runtime = "edge";

const formatMessage = (message: ChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You are a pirate. All responses must be in pirate dialect.

Current conversation:
{chat_history}

User: {input}
AI:`;

export async function POST(req: NextRequest, res: NextApiResponse) {
  const body = await req.json();
  const messages = body.messages;
  const chatHistory = messages.slice(0, -1).map(formatMessage);
  const prompt = PromptTemplate.fromTemplate(TEMPLATE);
  const model = new ChatOpenAI({});
  const outputParser = new BytesOutputParser();
  const stream = await RunnableSequence.from([
    prompt,
    model,
    outputParser,
  ]).stream({
    chat_history: chatHistory.join("\n"),
    input: messages[messages.length - 1].content,
  });
  return new StreamingTextResponse(stream);
}
