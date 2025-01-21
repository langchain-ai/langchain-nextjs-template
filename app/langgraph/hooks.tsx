"use client";

import { Client } from "@langchain/langgraph-sdk";
import { useCallback, useMemo, useRef, useState } from "react";
import { MessageDict, toMessageDict } from "./messages";
import type { RunnableConfig } from "@langchain/core/runnables";
import {
  type BaseMessageChunk,
  coerceMessageLikeToMessage,
  convertToChunk,
} from "@langchain/core/messages";

const client = new Client({ apiUrl: "http://localhost:2024" });

class MessageTupleManager {
  chunks: Record<string, { chunk?: BaseMessageChunk; index?: number }> = {};

  constructor() {
    this.chunks = {};
  }

  add(serialized: MessageDict): string | null {
    const chunk = convertToChunk(coerceMessageLikeToMessage(serialized));

    const id = chunk.id;
    if (!id) return null;

    this.chunks[id] ??= {};
    this.chunks[id].chunk = this.chunks[id]?.chunk?.concat(chunk) ?? chunk;

    return id;
  }

  clear() {
    this.chunks = {};
  }

  get(id: string, defaultIndex: number) {
    if (this.chunks[id] == null) return null;
    this.chunks[id].index ??= defaultIndex;

    return this.chunks[id];
  }
}

// Implementation
export function useStream<
  StateType extends Record<string, unknown> = Record<string, unknown>,
  UpdateType extends Record<string, unknown> = Partial<StateType>,
>(options?: {
  threadId?: string;
  withMessages?: string;
  onError?: (error: unknown) => void;
}) {
  const [threadId, setThreadId] = useState<string | null>(
    options?.threadId ?? null,
  );
  const { withMessages, onError } = options ?? {};
  const [events, setEvents] = useState<{ event: string; data: any }[]>([]);

  // TODO: fetch the initial values from the server
  const [values, setValues] = useState<StateType>({} as StateType);
  const manager = useRef(new MessageTupleManager());

  const getMessages = useMemo(() => {
    if (withMessages == null) return undefined;
    return (value: StateType) =>
      Array.isArray(value[withMessages])
        ? (value[withMessages] as MessageDict[])
        : [];
  }, [withMessages]);

  const handleSubmit = useCallback(
    async (
      values: UpdateType,
      submitOptions?: {
        optimisticValues?:
          | Partial<StateType>
          | ((prev: StateType) => Partial<StateType>);
      },
    ) => {
      try {
        let usableThreadId = threadId;
        if (!usableThreadId) {
          const thread = await client.threads.create();
          setThreadId(thread.thread_id);
          usableThreadId = thread.thread_id;
        }

        // TODO: this needs to be present in the SDK
        type MessagesTuplePayload = {
          event: "messages";
          data: [message: MessageDict, config: RunnableConfig];
        };

        type ValuesTuplePayload<StateType> = {
          event: "values";
          data: StateType;
        };

        type MetadataPayload = {
          event: "metadata";
          data: { run_id: string; thread_id: string };
        };

        type Payload<StateType> =
          | MessagesTuplePayload
          | ValuesTuplePayload<StateType>
          | MetadataPayload;

        // TODO: why non-existent assistant ID does not throw an error here?
        const run = (await client.runs.stream(usableThreadId, "agent", {
          input: values as Record<string, unknown>,
          streamMode: ["messages-tuple", "values"],
        })) as AsyncGenerator<Payload<StateType>>;

        // Assumption: we're setting the initial value
        // Used for instant feedback
        // TODO: would be nice to have the same Annotation shared between server
        // and client (tRPC-style)
        if (submitOptions?.optimisticValues != null) {
          setValues((value) => ({
            ...value,
            ...(typeof submitOptions.optimisticValues === "function"
              ? submitOptions.optimisticValues(value)
              : submitOptions.optimisticValues),
          }));
        }

        for await (const { event, data } of run) {
          setEvents((events) => [...events, { event, data }]);
          if (event === "values") {
            setValues(data);
          } else if (event === "messages") {
            if (!getMessages) continue;

            const [serialized] = data;
            const messageId = manager.current.add(serialized);
            if (!messageId) {
              console.warn(
                "Failed to add message to manager, no message ID found",
              );
              continue;
            }

            setValues((value) => {
              // Assumption: we're concating the message
              const messages = getMessages(value).slice();

              const { chunk, index } =
                manager.current.get(messageId, messages.length) ?? {};

              if (!chunk || index == null) return value;
              messages[index] = toMessageDict(chunk);

              return { ...value, messages };
            });
          }
        }
      } catch (error) {
        // TODO: make sure that this hook is referentially stable
        onError?.(error);
      } finally {
        // Assumption: messages are already handled, we can clear the manager
        manager.current.clear();
      }
    },
    [threadId, getMessages, onError],
  );

  return {
    values,
    handleSubmit,
    get messages() {
      if (getMessages == null) {
        throw new Error(
          "No messages key provided. Make sure that `useStream` contains the `messagesKey` property.",
        );
      }

      return getMessages(values);
    },
    events,
  };
}
