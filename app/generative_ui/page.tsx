"use client";

import { useState } from "react";
import type { EndpointsContext } from "./agent";
import { useActions } from "./utils/client";
import { LocalContext } from "./shared";
import { readStreamableValue } from "ai/rsc";

export default function GenerativeUIPage() {
  const actions = useActions<typeof EndpointsContext>();

  const [elements, setElements] = useState<JSX.Element[]>([]);
  const [input, setInput] = useState("");

  const historyState = useState<[role: string, content: string][]>([]);
  const [history, setHistory] = historyState;

  async function onSubmit(input: string) {
    const newElements = [...elements];

    const element = await actions.agent({
      input,
      chat_history: history,
    });

    newElements.push(
      <div className="flex flex-col gap-2" key={history.length}>
        <div className="bg-gray-700 p-3 rounded-lg self-start">{input}</div>
        <div className="self-end text-right">{element.ui}</div>
      </div>,
    );

    (async () => {
      let finalValue = null;
      for await (const value of readStreamableValue(element.value)) {
        finalValue = value;
      }

      if (finalValue != null) {
        setHistory((prev) => [
          ...prev,
          ["user", input],
          ["assistant", finalValue],
        ]);
      }
    })();

    setElements(newElements);
    setInput("");
  }

  return (
    <div>
      <div className="p-4 md:p-8 rounded bg-[#25252d] w-full max-h-[85%] overflow-hidden">
        <h1 className="text-3xl md:text-4xl mb-4">
          ▲ Next.js + LangChain.js Generative UI
        </h1>
      </div>

      <div className="flex flex-col gap-4 items-stretch">
        <LocalContext.Provider value={onSubmit}>
          <div>{elements}</div>
        </LocalContext.Provider>

        <form
          className="grid grid-cols-[1fr,auto] items-center gap-2"
          onSubmit={async (e) => {
            e.stopPropagation();
            e.preventDefault();
            onSubmit(input);
          }}
        >
          <input
            type="text"
            value={input}
            className="bg-transparent px-3 py-2 border border-gray-600 rounded-md text-white outline-none"
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="flex p-1 border border-gray-600 rounded-md px-4 py-2"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
