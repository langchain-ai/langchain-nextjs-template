"use client";

import { StreamableValue, useStreamableValue } from "ai/rsc";

export function AIMessage(props: { value: StreamableValue<string> }) {
  const [data] = useStreamableValue(props.value);

  return (
    <div className="empty:hidden border border-gray-700 p-3 rounded-lg max-w-[50vw]">
      {data}
    </div>
  );
}
