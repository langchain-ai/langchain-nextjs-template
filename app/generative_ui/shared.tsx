"use client";
import { createContext } from "react";

export const LocalContext = createContext<(value: string) => void>(
  () => void 0,
);
