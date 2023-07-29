import { NextApiResponse } from "next";
import { NextRequest } from "next/server";
import { StreamingTextResponse, Message } from "ai";
import { createChatMessageChunkEncoderStream } from "langchain/chat_models/base";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { AIMessage, HumanMessage } from "langchain/schema";

export const runtime = "edge";

export async function POST(req: NextRequest, res: NextApiResponse) {
  const body = await req.json();
  const messages = body.messages;
  const model = new ChatOpenAI({});
  const stream = await model.stream(
    (messages as Message[]).map((m) =>
      m.role == "user" ? new HumanMessage(m.content) : new AIMessage(m.content),
    ),
  );
  return new StreamingTextResponse(
    stream.pipeThrough(createChatMessageChunkEncoderStream()),
  );
}
