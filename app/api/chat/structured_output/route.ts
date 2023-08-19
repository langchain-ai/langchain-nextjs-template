import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

import { createStructuredOutputChainFromZod } from "langchain/chains/openai_functions";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";

export const runtime = "edge";

const TEMPLATE = `Extract the requested fields from the input.

The field "entity" refers to the first mentioned entity in the input.

Input:

{input}`;

/**
 * This handler initializes and calls an OpenAI Functions powered
 * structured output chain. See the docs for more information:
 *
 * https://js.langchain.com/docs/modules/chains/popular/structured_output
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const currentMessageContent = messages[messages.length - 1].content;

    const prompt = PromptTemplate.fromTemplate<{ input: string }>(TEMPLATE);
    /**
     * Function calling is currently only supported with ChatOpenAI models
     */
    const model = new ChatOpenAI({
      temperature: 0.8,
      modelName: "gpt-4",
    });

    /**
     * We use Zod (https://zod.dev) to define our schema for convenience,
     * but you can pass JSON Schema directly using the alternative `createStructuredOutputChain()`
     * method if desired.
     */
    const schema = z.object({
      tone: z
        .enum(["positive", "negative", "neutral"])
        .describe("The overall tone of the input"),
      entity: z.string().describe("The entity mentioned in the input"),
      word_count: z.number().describe("The number of words in the input"),
      chat_response: z.string().describe("A response to the human's input"),
      final_punctuation: z
        .optional(z.string())
        .describe("The final punctuation mark in the input, if any."),
    });

    /**
     * Returns a specialized, preconfigured LLMChain.
     */
    const chain = createStructuredOutputChainFromZod(schema, {
      llm: model,
      prompt,
      outputKey: "output",
    });

    const result = await chain.call({
      input: currentMessageContent,
    });

    return NextResponse.json(result.output, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
