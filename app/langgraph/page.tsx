"use client";

import { ChatInput, ChatLayout } from "@/components/ChatWindow";
import { GuideInfoBox } from "@/components/guide/GuideInfoBox";
import { useState } from "react";
import { MessageDict } from "./messages";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import { useStream } from "./hooks";

const onError = (error: unknown) => {
  toast.error("Failed to handle input", {
    description: error instanceof Error ? error.message : String(error),
  });
};

export default function LanggraphPage() {
  const [input, setInput] = useState("");

  const stream = useStream<{ messages?: MessageDict[]; timestamp?: number }>({
    withMessages: "messages",
    onError,
  });

  return (
    <ChatLayout
      content={
        stream.messages.length ? (
          <div className="flex flex-col gap-4 max-w-[768px] mx-auto">
            <div>Timestamp: {stream.values.timestamp}</div>

            {stream.messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  `rounded-[24px] max-w-[80%] mb-8 flex`,
                  message.type === "human"
                    ? "bg-secondary text-secondary-foreground px-4 py-2"
                    : null,
                  message.type === "human" ? "ml-auto" : "mr-auto",
                )}
              >
                <div className="whitespace-pre-wrap flex flex-col">
                  {typeof message.content === "string"
                    ? message.content
                    : JSON.stringify(message.content, null, 2)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <GuideInfoBox>
            <p>
              This example showcases connecting a LangGraph agent in a Next.js
              project, demonstrating a web search agent.
            </p>
          </GuideInfoBox>
        )
      }
      footer={
        <ChatInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onSubmit={(e) => {
            e.preventDefault();
            setInput("");

            stream.handleSubmit(
              { messages: [{ type: "human", content: input }] },
              {
                optimisticValues: (prev) => ({
                  messages: [
                    ...(prev?.messages ?? []),
                    { type: "human", content: input },
                  ],
                }),
              },
            );
          }}
        />
      }
    />
  );
}
