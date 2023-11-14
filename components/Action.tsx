"use server"

import { ChatOpenAI } from "langchain/chat_models/openai"

export async function testServerAction() {
  const model = new ChatOpenAI({});
  console.log("INVOKING");
  const res = await model.invoke("Hi there! How are you?");
  console.log(res);
  return {content: res.content}
}