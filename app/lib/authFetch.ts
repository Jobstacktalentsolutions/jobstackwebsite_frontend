// lib/authedFetch.ts
import "server-only";
import { cookies } from "next/headers";

export async function authedFetch(input: string, init?: RequestInit) {
  const cookieStore = await cookies(); // <-- await fixes the TS error
  const accessToken = cookieStore.get("accessToken")?.value;

  const res = await fetch(`${process.env.AUTH_API_BASE}${input}`, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    cache: "no-store",
  });

  return res;
}
