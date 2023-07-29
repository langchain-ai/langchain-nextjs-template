"use client";

import { useChat } from "ai/react";
import type { Message } from "ai/react";

function ChatMessage(props: { message: Message }) {
  const colorClassName =
    props.message.role === "user" ? "bg-sky-600" : "bg-slate-50 text-black";
  const alignmentClassName =
    props.message.role === "user" ? "mr-auto" : "ml-auto";
  return (
    <div
      className={`${alignmentClassName} ${colorClassName} rounded px-4 py-2 max-w-[80%] mb-8`}
    >
      {props.message.content}
    </div>
  );
}

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex flex-col items-center mt-48">
      <div className="flex flex-col w-[80%] grow mb-4">
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m}></ChatMessage>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex w-[80%]">
        <input
          className="grow mr-12 p-4 rounded"
          value={input}
          onChange={handleInputChange}
        />
        <button type="submit" className="px-8 py-4 bg-sky-600 rounded">
          Send
        </button>
      </form>
    </div>
  );
}
