import { tool } from "@langchain/core/tools";
import { z } from "zod";

/** Deliberately accepts only arithmetic operands, never executable expressions. */
export const calculator = tool(
  ({ operation, left, right }) => {
    let result: number;
    switch (operation) {
      case "add":
        result = left + right;
        break;
      case "subtract":
        result = left - right;
        break;
      case "multiply":
        result = left * right;
        break;
      case "divide":
        if (right === 0) return "Cannot divide by zero.";
        result = left / right;
        break;
    }
    return Number.isFinite(result)
      ? String(result)
      : "Result is outside the finite number range.";
  },
  {
    name: "calculator",
    description:
      "Add, subtract, multiply, or divide two finite numbers. Use multiple calls for multi-step calculations.",
    schema: z.object({
      operation: z.enum(["add", "subtract", "multiply", "divide"]),
      left: z.number().finite(),
      right: z.number().finite(),
    }),
  },
);
