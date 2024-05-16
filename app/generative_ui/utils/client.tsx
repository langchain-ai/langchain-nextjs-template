"use client";

import { ReactNode, useContext } from "react";
import { createContext } from "react";

const ActionsContext = createContext<any>(null);

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

export function useActions<T extends { $$types?: Record<string, unknown> }>() {
  return useContext(ActionsContext) as Exclude<T["$$types"], undefined>;
}
