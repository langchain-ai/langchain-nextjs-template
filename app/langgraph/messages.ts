import type {
  HumanMessage,
  AIMessage,
  ToolMessage,
  FunctionMessage,
  SystemMessage,
  ChatMessage,
  RemoveMessage,
  BaseMessage,
} from "@langchain/core/messages";

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type PickIfExists<T, K extends string | number | symbol> = Pick<
  T,
  K extends keyof T ? K : never
>;

type ClassToObj<Type extends string, T extends object> = { type: Type } & Omit<
  T,
  | "_getType"
  | "lc_namespace"
  | "lc_kwargs"
  | "lc_serializable"
  | "response_metadata"
  | "additional_kwargs"
  | GetFunctionKeys<T>
  | GetReadonlyKeys<T>
> &
  Partial<PickIfExists<T, "response_metadata" | "additional_kwargs">>;

type GetFunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type GetReadonlyKeys<T extends Object> = {
  [K in keyof T]: (<S>() => S extends { [Z in K]: T[Z] } ? 2 : 1) extends <
    S,
  >() => S extends { -readonly [Z in K]: T[Z] } ? 2 : 1
    ? never
    : K;
}[keyof T];

type HumanMessageDict = Prettify<
  ClassToObj<
    "human",
    Omit<HumanMessage, "name" | "response_metadata" | "additional_kwargs">
  >
>;
type AIMessageDict = Prettify<ClassToObj<"ai", Omit<AIMessage, "name">>>;
type ToolMessageDict = Prettify<ClassToObj<"tool", ToolMessage>>;
type SystemMessageDict = Prettify<
  ClassToObj<
    "system",
    Omit<SystemMessage, "name" | "response_metadata" | "additional_kwargs">
  >
>;
type FunctionMessageDict = Prettify<
  ClassToObj<
    "function",
    Omit<FunctionMessage, "name" | "response_metadata" | "additional_kwargs">
  >
>;
type ChatMessageDict = Prettify<ClassToObj<"chat", ChatMessage>>;
type RemoveMessageDict = Prettify<
  ClassToObj<
    "remove",
    Omit<RemoveMessage, "name" | "response_metadata" | "additional_kwargs">
  >
>;

export const toMessageDict = (chunk: BaseMessage): MessageDict => {
  const { type, data } = chunk.toDict();
  return { ...data, type } as MessageDict;
};

export type MessageDict =
  | HumanMessageDict
  | AIMessageDict
  | ToolMessageDict
  | SystemMessageDict
  | FunctionMessageDict
  | ChatMessageDict
  | RemoveMessageDict;
