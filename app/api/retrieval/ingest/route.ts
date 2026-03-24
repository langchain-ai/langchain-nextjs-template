import { NextRequest, NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

import * as xlsx from "xlsx";
// @ts-ignore
import pdf from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";

export const runtime = "nodejs";

/**
 * Hàm trích xuất văn bản từ các định dạng file khác nhau
 */
async function extractTextFromFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "xlsx" || extension === "xls" || extension === "csv") {
    const workbook = xlsx.read(buffer, { type: "buffer" });
    let fullText = "";
    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      // Chuyển đổi sang CSV để AI dễ đọc cấu trúc hàng/cột
      const csv = xlsx.utils.sheet_to_csv(worksheet);
      fullText += `Bảng dữ liệu: ${sheetName}\n---\n${csv}\n---\n\n`;
    });
    return fullText;
  } else if (extension === "pdf") {
    const data = await pdf(buffer);
    return data.text;
  } else if (extension === "docx") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } else if (extension === "md" || extension === "txt") {
    return new TextDecoder().decode(arrayBuffer);
  } else {
    // Nếu là file không hỗ trợ, thử đọc dưới dạng text
    try {
      return new TextDecoder().decode(arrayBuffer);
    } catch (e) {
      throw new Error(`Định dạng file .${extension} không được hỗ trợ hoặc file bị lỗi.`);
    }
  }
}

export async function POST(req: NextRequest) {
  if (process.env.NEXT_PUBLIC_DEMO === "true") {
    return NextResponse.json(
      {
        error: [
          "Ingest is not supported in demo mode.",
        ].join("\n"),
      },
      { status: 403 },
    );
  }

  try {
    const contentType = req.headers.get("content-type") || "";
    let text = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File;
      if (file && file.size > 0) {
        text = await extractTextFromFile(file);
      } else {
        text = formData.get("text") as string;
      }
    } else {
      const body = await req.json();
      text = body.text;
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Không tìm thấy nội dung để nạp." }, { status: 400 });
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_PRIVATE_KEY) {
      return NextResponse.json({ error: "Thiếu cấu hình Supabase (URL hoặc Key)." }, { status: 500 });
    }

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json({ error: "Thiếu GOOGLE_API_KEY." }, { status: 500 });
    }

    const client = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_PRIVATE_KEY,
    );

    const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
      chunkSize: 500,
      chunkOverlap: 50,
    });

    const splitDocuments = await splitter.createDocuments([text]);

    console.log(`Đang chuẩn bị nạp ${splitDocuments.length} đoạn tài liệu vào Supabase theo từng đợt...`);

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-embedding-001",
    });

    const vectorstore = new SupabaseVectorStore(embeddings, {
      client,
      tableName: "documents",
      queryName: "match_documents",
    });

    // Chia nhỏ tài liệu thành từng đợt 50 đoạn để tránh timeout
    const batchSize = 50;
    for (let i = 0; i < splitDocuments.length; i += batchSize) {
      const batch = splitDocuments.slice(i, i + batchSize);
      console.log(`Đang nạp đợt ${Math.floor(i / batchSize) + 1}/${Math.ceil(splitDocuments.length / batchSize)} (${batch.length} đoạn)...`);
      await vectorstore.addDocuments(batch);
    }

    console.log("Đã hoàn tất nạp toàn bộ tài liệu.");

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    console.error("Ingest Error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
