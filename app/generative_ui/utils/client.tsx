"use client";

import { ReactNode, useContext } from "react";
import { createContext } from "react";

const ActionsContext = createContext<any>(null);

/**
 * Internal provider exposing serialised React Actions
 * This needs to be consumed in the layout of the route
 */
export const AIProvider = (props: {
  actions: Record<string, any>;
  children: ReactNode;
}) => {
  return (
    <ActionsContext.Provider value={props.actions}>
      {props.children}
    </ActionsContext.Provider>
  );
};

/**
 * Use actions exposes via `exposeEndpoints` function in `@/app/generative_ui/utils/server.tsx`
 * Reason why we need this is because we can't import components as such due to NextJS limitations:
 *
 * server (layout) --> client (page) --> server (action) -x-> client (components for llm)
 *
 * See https://github.com/vercel/next.js/pull/59615
 */
export function useActions<T extends { $$types?: Record<string, unknown> }>() {
  return useContext(ActionsContext) as Exclude<T["$$types"], undefined>;
}
