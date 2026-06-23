import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL 
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth`
    : "http://localhost:5000/api/auth",
  fetchOptions: {
    customFetchImpl: async (url, init) => {
      return fetch(url, { ...init, credentials: "include" });
    }
  }
});
