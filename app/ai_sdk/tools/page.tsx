"use client";

import { readStreamableValue } from "ai/rsc";
import React, { useEffect, useRef, useState } from "react";
import { executeTool } from "./action";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

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
        <Input
          placeholder="What's the weather in XYZ city and XYZ state"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="flex items-center">
          <Checkbox
            id="wso-checkbox"
            checked={options.wso}
            onCheckedChange={(checked) =>
              setOptions((prev) => ({ ...prev, wso: !!checked }))
            }
          />
          <label htmlFor="wso-checkbox" className="ml-2 text-sm font-medium">
            Use <code>withStructuredOutput</code>
          </label>
        </div>
        <div className="flex items-center">
          <Checkbox
            id="stream-events-checkbox"
            checked={options.streamEvents}
            onCheckedChange={(checked) =>
              setOptions((prev) => ({ ...prev, streamEvents: !!checked }))
            }
          />
          <label
            htmlFor="stream-events-checkbox"
            className="ml-2 text-sm font-medium"
          >
            Use <code>streamEvents</code>
          </label>
        </div>
        <Button type="submit" disabled={isLoading}>
          Submit
        </Button>
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
