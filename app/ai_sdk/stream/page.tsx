"use client";

import { useChat } from "ai/react";
import React from "react";

export default function Page() {
  const { handleSubmit, messages, input, setInput } = useChat({
    api: "/api/chat/stream",
  });

  return (
    <div className="mx-auto w-full max-w-md py-12 flex flex-col stretch">
      <div className="flex flex-col pb-3">
        {messages.map((m) => (
          <div key={m.id}>
            {m.role === "user" ? "User: " : "AI: "}
            {m.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Tell me a joke about..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Click to render
        </button>
      </form>
    </div>
  );
}
