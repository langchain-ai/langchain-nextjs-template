import { Document, type DocumentInterface } from "@langchain/core/documents";
import type { EmbeddingsInterface } from "@langchain/core/embeddings";
import { VectorStore } from "@langchain/core/vectorstores";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Minimal adapter for this template's documents table and match_documents RPC. */
export class SupabaseVectorStore extends VectorStore {
  declare FilterType: Record<string, unknown>;
  private client: SupabaseClient;

  constructor(
    embeddings: EmbeddingsInterface,
    fields: { client: SupabaseClient },
  ) {
    super(embeddings, fields);
    this.client = fields.client;
  }

  _vectorstoreType(): string {
    return "supabase";
  }

  async addDocuments(documents: DocumentInterface[]): Promise<string[]> {
    if (documents.length === 0) return [];
    const vectors = await this.embeddings.embedDocuments(
      documents.map((document) => document.pageContent),
    );
    return this.addVectors(vectors, documents);
  }

  async addVectors(
    vectors: number[][],
    documents: DocumentInterface[],
  ): Promise<string[]> {
    if (vectors.length !== documents.length) {
      throw new Error("Each document must have one embedding");
    }
    if (documents.length === 0) return [];
    const ids: string[] = [];
    // Keep request sizes bounded, matching the previous adapter's batch size.
    for (let offset = 0; offset < documents.length; offset += 500) {
      const rows = documents
        .slice(offset, offset + 500)
        .map((document, index) => ({
          content: document.pageContent,
          metadata: document.metadata,
          embedding: vectors[offset + index],
        }));
      const { data, error } = await this.client
        .from("documents")
        .upsert(rows)
        .select("id");
      if (error) throw new Error("Failed to store documents in Supabase");
      if (!data || data.length !== rows.length) {
        throw new Error("Supabase did not return all inserted document IDs");
      }
      ids.push(...data.map((row) => String(row.id)));
    }
    return ids;
  }

  async similaritySearchVectorWithScore(
    query: number[],
    k: number,
    filter: this["FilterType"] = {},
  ): Promise<[Document, number][]> {
    const { data, error } = await this.client.rpc("match_documents", {
      query_embedding: query,
      match_count: k,
      filter,
    });
    if (error) throw new Error("Failed to search documents in Supabase");
    return (data ?? []).map(
      (row: {
        id: string | number;
        content: string;
        metadata: Record<string, unknown> | null;
        similarity: number;
      }) => [
        new Document({
          id: String(row.id),
          pageContent: row.content,
          metadata: row.metadata ?? {},
        }),
        row.similarity,
      ],
    );
  }
}
