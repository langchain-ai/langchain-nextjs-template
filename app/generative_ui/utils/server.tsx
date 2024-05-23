import "server-only";

import { ReactNode, isValidElement } from "react";
import { createStreamableUI, createStreamableValue } from "ai/rsc";
import { Runnable } from "@langchain/core/runnables";
import {
  CallbackManagerForToolRun,
  CallbackManagerForRetrieverRun,
  CallbackManagerForChainRun,
  CallbackManagerForLLMRun,
} from "@langchain/core/callbacks/manager";
import {
  LogStreamCallbackHandler,
  RunLogPatch,
  StreamEvent,
} from "@langchain/core/tracers/log_stream";
import { AIProvider } from "./client";

/**
 * Executes `streamEvents` method on a runnable
 * and converts the generator to a RSC friendly stream
 *
 * @param runnable
 * @returns React node which can be sent to the client
 */
export function streamRunnableUI<RunInput, RunOutput>(
  runnable: Runnable<RunInput, RunOutput>,
  inputs: RunInput,
) {
  const ui = createStreamableUI();
  const value = createStreamableValue();

  (async () => {
    let lastEvent: StreamEvent | null = null;

    const streamableMap: Record<
      string,
      ReturnType<typeof createStreamableUI>
    > = {};

    for await (const streamEvent of runnable.streamEvents(inputs, {
      version: "v1",
    })) {
      const [kind, type] = streamEvent.event.split("_").slice(1);
      if (type === "stream" && kind !== "chain") {
        const chunk = streamEvent.data.chunk;

        if (isValidElement(chunk)) {
          ui.append(chunk);
        } else if ("text" in chunk && typeof chunk.text === "string") {
          if (!streamableMap[streamEvent.run_id]) {
            streamableMap[streamEvent.run_id] = createStreamableUI();
            const value = streamableMap[streamEvent.run_id].value;

            // create an AI message
            ui.append(
              <div className="empty:hidden border border-gray-700 p-3 rounded-lg max-w-[50vw]">
                {value}
              </div>,
            );
          }

          streamableMap[streamEvent.run_id].append(chunk.text);
        }
      }
      lastEvent = streamEvent;
    }

    value.done(lastEvent?.data.output);

    for (const ui of Object.values(streamableMap)) ui.done();
    ui.done();
  })();

  return {
    ui: ui.value,
    value: value.value,
  };
}

/**
 * Yields an UI element within a runnable,
 * which can be streamed to the client via `streamRunnableUI`
 *
 * @param config callback
 * @param initialValue Initial React node to be sent to the client
 * @returns Vercel AI RSC compatible streamable UI
 */
export const createRunnableUI = (
  config:
    | CallbackManagerForToolRun
    | CallbackManagerForRetrieverRun
    | CallbackManagerForChainRun
    | CallbackManagerForLLMRun
    | undefined,
  initialValue?: React.ReactNode,
): ReturnType<typeof createStreamableUI> => {
  if (!config) throw new Error("No config provided");

  const logStreamTracer = config.handlers.find(
    (i): i is LogStreamCallbackHandler => i.name === "log_stream_tracer",
  );

  const ui = createStreamableUI(initialValue);

  if (!logStreamTracer) throw new Error("No log stream tracer found");
  // @ts-expect-error Private field
  const runName = logStreamTracer.keyMapByRunId[config.runId];
  if (!runName) {
    console.log("No name found for", config.runId);
    throw new Error("No run name found");
  }

  logStreamTracer.writer.write(
    new RunLogPatch({
      ops: [
        {
          op: "add",
          path: `/logs/${runName}/streamed_output/-`,
          value: ui.value,
        },
      ],
    }),
  );

  return ui;
};

/**
 * Expose these endpoints outside for the client
 * We wrap the functions in order to properly resolve importing
 * client components.
 *
 * TODO: replace with createAI instead, even though that
 * implicitly handles state management
 *
 * See https://github.com/vercel/next.js/pull/59615
 * @param actions
 */
export function exposeEndpoints<T extends Record<string, unknown>>(
  actions: T,
): {
  (props: { children: ReactNode }): Promise<JSX.Element>;
  $$types?: T;
} {
  return async function AI(props: { children: ReactNode }) {
    return <AIProvider actions={actions}>{props.children}</AIProvider>;
  };
}
