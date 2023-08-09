import type { Message } from "ai/react";

export function ChatMessageBubble(props: { message: Message }) {
  const colorClassName =
    props.message.role === "user" ? "bg-sky-600" : "bg-slate-50 text-black";
  const alignmentClassName =
    props.message.role === "user" ? "mr-auto" : "ml-auto";
  return (
    <div
      className={`${alignmentClassName} ${colorClassName} rounded px-4 py-2 max-w-[80%] mb-8 whitespace-pre-wrap`}
    >
      {props.message.content}
    </div>
  );
}