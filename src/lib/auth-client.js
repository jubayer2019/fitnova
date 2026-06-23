import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined"
    ? `${window.location.origin}/api/auth`
    : (process.env.NEXT_PUBLIC_API_URL 
        ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/api/auth`
        : "http://localhost:5000/api/auth"),
  fetchOptions: {
    customFetchImpl: async (url, init) => {
      return fetch(url, { ...init, credentials: "include" });
    }
  }
});
