"use client";

import { readStreamableValue } from "ai/rsc";
import React, { useEffect, useRef, useState } from "react";
import { executeTool } from "./action";

export default function Page() {
  const [input, setInput] = useState("");
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState({
    wso: false,
    streamEvents: false,
  });

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

    const { streamData } = await executeTool(input, options);
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
          placeholder="What's the weather in XYZ city and XYZ state"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="flex items-center">
          <input
            id="wso-checkbox"
            type="checkbox"
            checked={options.wso}
            onChange={(e) =>
              setOptions((prev) => ({ ...prev, wso: e.target.checked }))
            }
            className="w-4 h-4 text-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <label
            htmlFor="wso-checkbox"
            className="ml-2 text-sm font-medium text-gray-100"
          >
            Use withStructuredOutput
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="stream-events-checkbox"
            type="checkbox"
            checked={options.streamEvents}
            onChange={(e) =>
              setOptions((prev) => ({
                ...prev,
                streamEvents: e.target.checked,
              }))
            }
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <label
            htmlFor="stream-events-checkbox"
            className="ml-2 text-sm font-medium text-gray-100"
          >
            Use streamEvents
          </label>
        </div>
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
            {options.streamEvents ? (
              <>
                <strong>Event:</strong> <p className="text-sm">{item.event}</p>
              </>
            ) : (
              <strong className="text-center">Stream</strong>
            )}
            <br />
            <p className="break-all text-sm">
              {options.streamEvents
                ? JSON.stringify(item.data, null, 2)
                : JSON.stringify(item, null, 2)}
            </p>
          </div>
        ))}
      </div>
      {!isLoading && data.length > 1 && (
        <>
          <hr />
          <div className="flex flex-col w-full gap-2">
            <strong className="text-center">Result</strong>
            <p className="break-all text-sm">
              {JSON.stringify(data[data.length - 1], null, 2)}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
