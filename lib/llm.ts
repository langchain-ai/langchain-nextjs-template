import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";

/**
 * Shared LLM factory for the starter app.
 *
 * When `ORCAROUTER_API_KEY` is set, every example routes through the
 * [OrcaRouter](https://www.orcarouter.ai) gateway (OpenAI-compatible) instead
 * of the OpenAI API directly:
 *
 * - Chat models use `orcarouter/auto` (adaptive routing) against
 *   `https://api.orcarouter.ai/v1` by default, overridable via
 *   `ORCAROUTER_MODEL` / `ORCAROUTER_BASE_URL`.
 * - Embeddings use `openai/text-embedding-3-small` via the same gateway,
 *   overridable via `ORCAROUTER_EMBEDDING_MODEL`.
 *
 * Without `ORCAROUTER_API_KEY` the factory behaves exactly as before
 * (`gpt-4o-mini` chat + default OpenAI embeddings).
 */
const ORCAROUTER_BASE_URL = "https://api.orcarouter.ai/v1";
const ORCAROUTER_CHAT_MODEL = "orcarouter/auto";
const ORCAROUTER_EMBEDDING_MODEL = "openai/text-embedding-3-small";

export function getChatModel(options?: {
  temperature?: number;
  model?: string;
}) {
  const temperature = options?.temperature ?? 0;

  if (process.env.ORCAROUTER_API_KEY) {
    return new ChatOpenAI({
      model:
        options?.model ?? process.env.ORCAROUTER_MODEL ?? ORCAROUTER_CHAT_MODEL,
      temperature,
      configuration: {
        baseURL: process.env.ORCAROUTER_BASE_URL ?? ORCAROUTER_BASE_URL,
        apiKey: process.env.ORCAROUTER_API_KEY,
      },
    });
  }

  return new ChatOpenAI({
    model: options?.model ?? process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    temperature,
  });
}

export function getEmbeddings() {
  if (process.env.ORCAROUTER_API_KEY) {
    return new OpenAIEmbeddings({
      model:
        process.env.ORCAROUTER_EMBEDDING_MODEL ?? ORCAROUTER_EMBEDDING_MODEL,
      configuration: {
        baseURL: process.env.ORCAROUTER_BASE_URL ?? ORCAROUTER_BASE_URL,
        apiKey: process.env.ORCAROUTER_API_KEY,
      },
    });
  }

  return new OpenAIEmbeddings();
}
