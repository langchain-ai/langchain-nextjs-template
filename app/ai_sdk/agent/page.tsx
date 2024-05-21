"use client";

import React, { useEffect, useRef, useState } from "react";
import { readStreamableValue } from "ai/rsc";
import { runAgent } from "./action";
import { StreamEvent } from "@langchain/core/tracers/log_stream";

export default function Page() {
  const [input, setInput] = useState("");
  const [data, setData] = useState<StreamEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [data]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input) return;
    setIsLoading(true);
    setData([]);
    setInput("");

    const { streamData } = await runAgent(input);
    for await (const item of readStreamableValue(streamData)) {
      setData((prev) => [...prev, item]);
    }
    setIsLoading(false);
  }

  return (
    <div className="mx-auto w-full max-w-4xl py-12 flex flex-col stretch gap-3">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="What's the weather like in..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
          disabled={isLoading}
        >
          Submit
        </button>
      </form>
      <div
        ref={scrollRef}
        className="flex flex-col gap-2 px-2 h-[650px] overflow-y-auto"
      >
        {data.map((item, i) => (
          <div key={i} className="p-4 bg-[#25252f] rounded-lg">
            <strong>Event:</strong> <p className="text-sm">{item.event}</p>
            <br />
            <strong>Data:</strong>{" "}
            <p className="break-all text-sm">
              {JSON.stringify(item.data, null, 2)}
            </p>
          </div>
        ))}
      </div>
      {data.length > 1 && (
        <div className="flex flex-col w-full gap-2">
          <strong className="text-center">Question</strong>
          <p className="break-words">{data[0].data.input.input}</p>
        </div>
      )}
      {!isLoading && data.length > 1 && (
        <>
          <hr />
          <div className="flex flex-col w-full gap-2">
            <strong className="text-center">Result</strong>
            <p className="break-words">{data[data.length - 1].data.output}</p>
          </div>
        </>
      )}
    </div>
  );
}
