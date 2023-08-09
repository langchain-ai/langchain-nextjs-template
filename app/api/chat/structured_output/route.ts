import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

import { createStructuredOutputChainFromZod } from "langchain/chains/openai_functions";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";

export const runtime = "edge";

const TEMPLATE = `Extract the desired fields from the input.

The field "entity" refers to the first mentioned entity in the input.

{input}`;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const messages = body.messages ?? [];
  const currentMessageContent = messages[messages.length - 1].content;

  const prompt = PromptTemplate.fromTemplate(TEMPLATE);
  /*
   * Function calling is currently only supported with ChatOpenAI models
   */
  const model = new ChatOpenAI({
    temperature: 0.8,
    modelName: "gpt-4"
  });

  const schema = z.object({
    tone: z.enum(["positive", "negative"]).describe("The overall tone of the input"),
    entity: z.string().describe("The entity mentioned in the input"),
    word_count: z.number().describe("The number of words in the input"),
    chat_response: z.string().describe("A response to the human's input"),
    final_punctuation: z.optional(z.string()).describe("The final punctuation mark in the input, if any."),
  });

  /*
   * Returns a specialized, preconfigured LLMChain.
   */
  const chain = createStructuredOutputChainFromZod(schema, {
    llm: model,
    prompt,
    outputKey: "output",
  })

  const result = await chain.call({
    input: currentMessageContent,
  });

  return NextResponse.json(result.output, { status: 200 });
}
