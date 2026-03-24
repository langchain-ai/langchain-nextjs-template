import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";

export const runtime = "nodejs";

const TEMPLATE = `Trích xuất các trường thông tin yêu cầu từ nội dung nhập vào.

Trường "entity" đề cập đến đối tượng/thực thể đầu tiên được nhắc đến trong nội dung.

Nội dung:

{input}`;

/**
 * This handler initializes and calls a Google Gemini powered
 * structured output chain. See the docs for more information:
 *
 * https://js.langchain.com/v0.2/docs/how_to/structured_output
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const currentMessageContent = messages[messages.length - 1].content;

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);
    
    const apiKey = process.env.GOOGLE_API_KEY;

    const model = new ChatGoogleGenerativeAI({
      apiKey: apiKey,
      model: "gemini-2.5-flash",
      apiVersion: "v1beta",
      temperature: 0.8,
    });

    /**
     * We use Zod (https://zod.dev) to define our schema for convenience,
     * but you can pass JSON schema if desired.
     */
    const schema = z
      .object({
        tone: z
          .enum(["positive", "negative", "neutral"])
          .describe("Tâm trạng tổng thể của nội dung (tích cực, tiêu cực, trung tính)"),
        entity: z.string().describe("Thực thể được nhắc đến trong nội dung"),
        word_count: z.number().describe("Số lượng từ trong nội dung"),
        chat_response: z.string().describe("Một câu phản hồi cho người dùng bằng tiếng Việt"),
        final_punctuation: z
          .optional(z.string())
          .describe("Dấu câu cuối cùng trong nội dung, nếu có."),
      })
      .describe("Luôn sử dụng trường này để định dạng đầu ra đúng cách");

    /**
     * Bind schema to the model.
     * Future invocations of the returned model will always match the schema.
     *
     * Under the hood, uses tool calling by default.
     */
    const functionCallingModel = model.withStructuredOutput(schema, {
      name: "output_formatter",
    });

    /**
     * Returns a chain with the function calling model.
     */
    const chain = prompt.pipe(functionCallingModel);

    const result = await chain.invoke({
      input: currentMessageContent,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
