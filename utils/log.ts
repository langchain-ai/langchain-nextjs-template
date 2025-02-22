export const logError = (...args: any[]) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(...args);
  }
};
