"use client";

import { ChatInput, ChatLayout } from "@/components/ChatWindow";
import { GuideInfoBox } from "@/components/guide/GuideInfoBox";
import { ReactNode, Suspense, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import { useStream } from "@langchain/langgraph-sdk/react";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Message } from "@langchain/langgraph-sdk";

const onError = (error: unknown) => {
  toast.error("Failed to handle input", {
    description: error instanceof Error ? error.message : String(error),
  });
};

function EditMessage({
  message,
  onEdit,
  onCancel,
}: {
  message: Message;
  onEdit: (message: Message) => void;
  onCancel: () => void;
}) {
  const [editValue, setEditValue] = useState(message.content as string);

  return (
    <ChatInput
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onSubmit={(e) => {
        e.preventDefault();
        onEdit({ type: "human", content: editValue });
      }}
      actions={
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
      }
    />
  );
}

function Message(props: {
  message: Message;
  onEdit: (message: Message) => void;
  onRegenerate: () => void;
  actions?: ReactNode;
}) {
  const [isEditing, setIsEditing] = useState(false);
  if (isEditing) {
    return (
      <EditMessage
        message={props.message}
        onEdit={props.onEdit}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div
      className={cn(
        "max-w-[80%]",
        props.message.type === "human" ? "ml-auto" : "mr-auto",
      )}
    >
      <div
        className={cn(
          `rounded-[24px] flex`,
          props.message.type === "human"
            ? "bg-secondary text-secondary-foreground px-4 py-2"
            : null,
        )}
      >
        <div className="whitespace-pre-wrap flex flex-col">
          {typeof props.message.content === "string"
            ? props.message.content
            : props.message.content.map((part) => {
                if (part.type === "text") return part.text;
                return null;
              })}
        </div>
      </div>

      {props.message.type === "human" && (
        <div className="ml-auto flex justify-end items-center gap-2 mt-2">
          <button
            className="text-muted-foreground text-right text-sm"
            type="button"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>

          {props.actions}
        </div>
      )}

      {props.message.type === "ai" && (
        <div className="mt-2 flex items-center justify-start gap-2">
          {props.actions}
          <div className="text-sm text-muted-foreground">
            <button type="button" onClick={props.onRegenerate}>
              Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function BranchPicker(props: {
  current: string;
  branches: string[];
  onSelect: (path: string) => void;
}) {
  const index = props.branches.indexOf(props.current);

  return (
    <div className="flex items-center gap-2 text-sm justify-end">
      <button
        type="button"
        className="flex-shrink-0"
        onClick={() => {
          const nextIndex = Math.max(0, index - 1);
          const next = props.branches[nextIndex];
          props.onSelect(next);
        }}
      >
        <ChevronLeft className="w-4 h-4 text-muted-foreground" />
      </button>

      <span className="text-muted-foreground">
        {index + 1} / {props.branches.length}
      </span>

      <button
        type="button"
        className="flex-shrink-0"
        onClick={() => {
          const nextIndex = Math.min(props.branches.length - 1, index + 1);
          const next = props.branches[nextIndex];
          props.onSelect(next);
        }}
      >
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
  );
}

function StatefulChatInput(props: {
  loading: boolean;
  onSubmit: (value: string) => void;
  onStop: () => void;
}) {
  const [input, setInput] = useState("");

  return (
    <ChatInput
      loading={props.loading}
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onStop={props.onStop}
      onSubmit={(e) => {
        e.preventDefault();
        setInput("");
        props.onSubmit(input);
      }}
    />
  );
}

function ClientLanggraphPage() {
  const [threadId, setThreadId] = useQueryState("threadId");

  const thread = useStream<{ messages?: Message[]; timestamp?: number }>({
    assistantId: "agent",
    apiUrl: "http://localhost:2024",
    threadId,

    onThreadId: setThreadId,
    onError,
  });

  return (
    <ChatLayout
      content={
        thread.messages.length ? (
          <div className="flex flex-col gap-4 max-w-[768px] mx-auto mb-16">
            <div className="flex justify-between gap-2 items-center">
              <span>Timestamp: {thread.values.timestamp}</span>
            </div>

            <div className="flex justify-between gap-2 items-center">
              <span>Thread ID: {threadId}</span>
              <Button
                variant="outline"
                type="button"
                onClick={() => setThreadId(null)}
              >
                New thread
              </Button>
            </div>

            {thread.messages.map((message, index) => {
              const meta = thread.getMessagesMetadata(message, index);
              const checkpoint = meta?.firstSeenState?.parent_checkpoint;

              return (
                <Message
                  key={message.id ?? index}
                  message={message}
                  onEdit={(message) =>
                    thread.submit({ messages: [message] }, { checkpoint })
                  }
                  onRegenerate={() => thread.submit(undefined, { checkpoint })}
                  actions={
                    meta?.branch != null &&
                    meta?.branchOptions != null && (
                      <BranchPicker
                        current={meta.branch}
                        branches={meta.branchOptions}
                        onSelect={thread.setBranch}
                      />
                    )
                  }
                />
              );
            })}

            {thread.error ? (
              <div className="text-red-500">{thread.error.toString()}</div>
            ) : null}
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
        <StatefulChatInput
          loading={thread.isLoading}
          onStop={thread.stop}
          onSubmit={(input) => {
            thread.submit(
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

export default function LanggraphPage() {
  return (
    <Suspense>
      <ClientLanggraphPage />
    </Suspense>
  );
}
