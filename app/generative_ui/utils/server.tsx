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
import { AIMessage } from "../ai/message";

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
  const [lastEvent, resolve] = withResolvers<string>();

  (async () => {
    let lastEventValue: StreamEvent | null = null;

    const callbacks: Record<
      string,
      ReturnType<typeof createStreamableUI | typeof createStreamableValue>
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
          if (!callbacks[streamEvent.run_id]) {
            // the createStreamableValue / useStreamableValue is preferred
            // as the stream events are updated immediately in the UI
            // rather than being batched by React via createStreamableUI
            const textStream = createStreamableValue();
            ui.append(<AIMessage value={textStream.value} />);
            callbacks[streamEvent.run_id] = textStream;
          }

          callbacks[streamEvent.run_id].append(chunk.text);
        }
      }
      lastEventValue = streamEvent;
    }

    // resolve the promise, which will be sent
    // to the client thanks to RSC
    resolve(lastEventValue?.data.output);

    Object.values(callbacks).forEach((cb) => cb.done());
    ui.done();
  })();

  return { ui: ui.value, lastEvent };
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

/**
 * Polyfill to emulate the upcoming Promise.withResolvers
 */
export function withResolvers<T>() {
  let resolve: (value: T) => void;
  let reject: (reason?: any) => void;

  const innerPromise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  // @ts-expect-error
  return [innerPromise, resolve, reject] as const;
}
