import assert from "node:assert/strict";
import test from "node:test";
import { calculator } from "./calculator.ts";
import { SupabaseVectorStore } from "./supabase-vector-store.ts";

const embeddings = {
  embedDocuments: async (texts) => texts.map(() => [0.1, 0.2]),
  embedQuery: async () => [0.3, 0.4],
};

test("calculator supports bounded arithmetic without evaluating code", async () => {
  for (const [operation, expected] of [
    ["add", "10"],
    ["subtract", "6"],
    ["multiply", "16"],
    ["divide", "4"],
  ]) {
    assert.equal(
      await calculator.invoke({ operation, left: 8, right: 2 }),
      expected,
    );
  }
  assert.equal(
    await calculator.invoke({ operation: "divide", left: 1, right: 0 }),
    "Cannot divide by zero.",
  );
  assert.equal(
    await calculator.invoke({
      operation: "multiply",
      left: Number.MAX_VALUE,
      right: 2,
    }),
    "Result is outside the finite number range.",
  );
  for (const input of [
    { operation: "eval", left: 1, right: 2 },
    { operation: "add", left: "process.exit()", right: 2 },
    { operation: "add", left: Infinity, right: 2 },
    { operation: "add", left: NaN, right: 2 },
  ])
    await assert.rejects(calculator.invoke(input));
});

test("ingestion embeds content, preserves metadata, and batches writes", async () => {
  const batches = [];
  const client = {
    from: (table) => {
      assert.equal(table, "documents");
      return {
        upsert: (rows) => {
          batches.push(rows);
          return {
            select: async (columns) => {
              assert.equal(columns, "id");
              return { data: rows.map((_, i) => ({ id: i + 1 })), error: null };
            },
          };
        },
      };
    },
  };
  const store = new SupabaseVectorStore(embeddings, { client });
  const docs = Array.from({ length: 501 }, () => ({
    pageContent: "sample",
    metadata: { source: "test" },
  }));
  assert.equal((await store.addDocuments(docs)).length, 501);
  assert.deepEqual(
    batches.map((rows) => rows.length),
    [500, 1],
  );
  assert.deepEqual(batches[0][0], {
    content: "sample",
    metadata: { source: "test" },
    embedding: [0.1, 0.2],
  });
  assert.deepEqual(await store.addDocuments([]), []);
  await assert.rejects(store.addVectors([], docs), /one embedding/);
});

test("retrieval preserves RPC arguments, document IDs, metadata, scores and callbacks", async () => {
  const calls = [];
  const client = {
    rpc: async (name, args) => {
      calls.push({ name, args });
      return {
        data: [
          {
            id: 7,
            content: "found",
            metadata: { source: "test" },
            similarity: 0.9,
          },
        ],
        error: null,
      };
    },
  };
  const store = new SupabaseVectorStore(embeddings, { client });
  const results = await store.similaritySearchVectorWithScore([1, 2], 3, {
    source: "test",
  });
  assert.deepEqual(calls[0], {
    name: "match_documents",
    args: {
      query_embedding: [1, 2],
      match_count: 3,
      filter: { source: "test" },
    },
  });
  assert.equal(results[0][0].id, "7");
  assert.equal(results[0][0].pageContent, "found");
  assert.deepEqual(results[0][0].metadata, { source: "test" });
  assert.equal(results[0][1], 0.9);
  let retrieved;
  const retriever = store.asRetriever({
    callbacks: [
      {
        handleRetrieverEnd: (docs) => {
          retrieved = docs;
        },
      },
    ],
  });
  const docs = await retriever.invoke("question");
  assert.deepEqual(retrieved, docs);
  assert.equal(calls[1].args.match_count, 4);
  assert.deepEqual(calls[1].args.query_embedding, [0.3, 0.4]);
});

test("database failures propagate without exposing upstream error details", async () => {
  const client = {
    rpc: async () => ({
      data: null,
      error: { message: "private upstream details" },
    }),
    from: () => ({
      upsert: () => ({
        select: async () => ({
          data: null,
          error: { message: "private upstream details" },
        }),
      }),
    }),
  };
  const store = new SupabaseVectorStore(embeddings, { client });
  await assert.rejects(store.similaritySearchVectorWithScore([1], 4), {
    message: "Failed to search documents in Supabase",
  });
  await assert.rejects(
    store.addDocuments([{ pageContent: "sample", metadata: {} }]),
    { message: "Failed to store documents in Supabase" },
  );
});
