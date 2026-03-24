import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";

import { createClient } from "@supabase/supabase-js";

import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import {
  AIMessage,
  BaseMessage,
  ChatMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { createRetrieverTool } from "@langchain/classic/tools/retriever";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

export const runtime = "nodejs";

/**
 * Chuyển đổi tin nhắn từ Vercel sang định dạng LangChain
 */
const convertVercelMessageToLangChainMessage = (message: VercelChatMessage) => {
  if (message.role === "user") {
    return new HumanMessage(message.content);
  } else if (message.role === "assistant") {
    return new AIMessage(message.content);
  } else {
    return new ChatMessage(message.content, message.role);
  }
};

/**
 * Chuyển đổi ngược lại từ LangChain sang Vercel để hiển thị lên UI
 */
const convertLangChainMessageToVercelMessage = (message: BaseMessage) => {
  if (message._getType() === "human") {
    return { content: message.content, role: "user" };
  } else if (message._getType() === "ai") {
    return {
      content: message.content,
      role: "assistant",
      tool_calls: (message as AIMessage).tool_calls,
    };
  } else {
    return { content: message.content, role: message._getType() };
  }
};

/**
 * Hướng dẫn cho Agent (System Prompt)
 */
const AGENT_SYSTEM_TEMPLATE = `Bạn là một Trợ lý Bán hàng Thông minh của website. 

Nhiệm vụ:
1. Bạn có một công cụ tra cứu dữ liệu sản phẩm. Hãy sử dụng nó MỖI KHI khách hàng hỏi về giá cả, thông số kỹ thuật hoặc chính sách bảo hành.
2. Nếu sau khi tra cứu mà không thấy thông tin, hãy báo cho khách hàng biết và đề xuất họ để lại thông tin liên lạc.
3. Nếu khách hàng chỉ chào hỏi hoặc nói chuyện phiếm, bạn có thể trả lời trực tiếp một cách thân thiện mà không cần dùng công cụ.
4. Luôn trả lời bằng tiếng Việt lịch sự.

Lưu ý: Bạn KHÔNG ĐƯỢC tự bịa ra giá sản phẩm. Chỉ cung cấp giá nếu tìm thấy trong công cụ tra cứu.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const returnIntermediateSteps = body.show_intermediate_steps;
    const messages = (body.messages ?? [])
      .filter(
        (message: VercelChatMessage) =>
          message.role === "user" || message.role === "assistant",
      )
      .map(convertVercelMessageToLangChainMessage);

    if (messages.length === 0) {
      return NextResponse.json({ error: "Không có tin nhắn nào để xử lý." }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Thiếu GOOGLE_API_KEY." }, { status: 500 });
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_PRIVATE_KEY) {
      return NextResponse.json({ error: "Thiếu cấu hình Supabase." }, { status: 500 });
    }

    // Bộ não của Agent
    const model = new ChatGoogleGenerativeAI({
      apiKey: apiKey,
      model: "gemini-2.5-flash",
      apiVersion: "v1beta",
      temperature: 0, // Độ chính xác tuyệt đối cho Agent
    });

    const client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PRIVATE_KEY!,
    );

    // Công cụ tra cứu (Retriever Tool)
    const vectorstore = new SupabaseVectorStore(new GoogleGenerativeAIEmbeddings({
      apiKey: apiKey,
      model: "gemini-embedding-001",
    }), {
      client,
      tableName: "documents",
      queryName: "match_documents",
    });

    const productSearchTool = createRetrieverTool(vectorstore.asRetriever(), {
      name: "tra_cuu_san_pham",
      description: "Sử dụng công cụ này để tìm kiếm thông tin chi tiết về giá cả và kỹ thuật của sản phẩm trên website.",
    });

    /**
     * Khởi tạo Agent sử dụng LangGraph
     */
    const agent = await createReactAgent({
      llm: model,
      tools: [productSearchTool],
      messageModifier: new SystemMessage(AGENT_SYSTEM_TEMPLATE),
    });

    if (!returnIntermediateSteps) {
      // Chế độ Streaming (Dành cho Chat thông thường)
      const eventStream = await agent.streamEvents(
        { messages },
        { version: "v2" },
      );

      const textEncoder = new TextEncoder();
      const transformStream = new ReadableStream({
        async start(controller) {
          for await (const { event, data } of eventStream) {
            if (event === "on_chat_model_stream") {
              if (!!data.chunk.content) {
                controller.enqueue(textEncoder.encode(data.chunk.content));
              }
            }
          }
          controller.close();
        },
      });

      return new StreamingTextResponse(transformStream);
    } else {
      // Chế độ hiển thị các bước suy luận (Intermediate Steps)
      const result = await agent.invoke({ messages });

      return NextResponse.json(
        {
          messages: result.messages.map(convertLangChainMessageToVercelMessage),
        },
        { status: 200 },
      );
    }
  } catch (e: any) {
    console.error("Agent Error:", e);
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
