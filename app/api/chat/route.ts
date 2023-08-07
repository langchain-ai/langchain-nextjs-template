import { NextApiResponse } from "next";
import { NextRequest } from "next/server";
import { StreamingTextResponse } from "ai";

import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatMessage } from "langchain/schema";
import { BytesOutputParser } from "langchain/schema/output_parser";
import { PromptTemplate } from "langchain/prompts";

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
  /*
   * You can also try e.g.:
   *
   * import { ChatAnthropic } from "langchain/chat_models/anthropic";
   * const model = new ChatAnthropic({});
   *
   * See a full list of supported models at:
   * https://js.langchain.com/docs/modules/model_io/models/
   */
  const model = new ChatOpenAI({});
  /*
   * Chat models stream message chunks rather than bytes, so this
   * output parser handles serialization and byte-encoding.
   */
  const outputParser = new BytesOutputParser();

  /*
   * Can also initialize as:
   *
   * import { RunnableSequence } from "langchain/schema/runnable";
   * const chain = RunnableSequence.from([prompt, model, outputParser]);
   */
  const chain = prompt.pipe(model).pipe(outputParser);

  const stream = await chain.stream({
    chat_history: chatHistory.join("\n"),
    input: messages[messages.length - 1].content,
  });

  return new StreamingTextResponse(stream);
}
