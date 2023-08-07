"use client";

import { useChat } from "ai/react";
import { useRef } from "react";
import type { FormEvent } from "react";

import { ChatMessageBubble } from "@/components/ChatMessageBubble";
import { InfoCard } from "@/components/InfoCard";

export default function Home() {
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({});

  function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (messageContainerRef.current) {
      messageContainerRef.current.classList.add("h-[50vh]");
    }
    if (isLoading) {
      return;
    }
    handleSubmit(e);
  }

  return (
    <div className="flex flex-col items-center mt-48">
      <div
        className="flex flex-col-reverse w-[80%] grow mb-4 overflow-auto"
        ref={messageContainerRef}
      >
        {messages.length > 0 ? (
          [...messages]
            .reverse()
            .map((m) => (
              <ChatMessageBubble key={m.id} message={m}></ChatMessageBubble>
            ))
        ) : (
          <InfoCard></InfoCard>
        )}
      </div>

      <form onSubmit={sendMessage} className="flex w-[80%]">
        <input
          className="grow mr-8 p-4 rounded"
          value={input}
          placeholder="What's it like to be a pirate?"
          onChange={handleInputChange}
        />
        <button type="submit" className="px-8 py-4 bg-sky-600 rounded">
          Send
        </button>
      </form>
    </div>
  );
}
