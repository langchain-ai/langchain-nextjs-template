import { NextApiResponse } from "next";
import { NextRequest } from "next/server";
import { StreamingTextResponse } from "ai";
import { createChatMessageChunkEncoderStream } from "langchain/chat_models/base";
import { ChatOpenAI } from "langchain/chat_models/openai";

export const runtime = "edge";

export async function POST(req: NextRequest, res: NextApiResponse) {
  const body = await req.json();
  const messages = body.messages;
  const messageContent = messages[messages.length - 1].content;
  const model = new ChatOpenAI({});
  const stream = await model.stream(messageContent);
  return new StreamingTextResponse(
    stream.pipeThrough(createChatMessageChunkEncoderStream()),
  );
}
