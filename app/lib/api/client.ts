// lib/api/client.ts
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://jobstack-backend-api-production.up.railway.app/api";

type Json = Record<string, unknown>;

function extractErrorMessage(status: number, text: string) {
  try {
    const data = text ? JSON.parse(text) : {};
    // Common shapes: {message: "..."} or {message: ["...","..."]} or {errors:{...}}
    if (Array.isArray(data?.message)) return data.message.join("\n");
    if (typeof data?.message === "string") return data.message;
    if (data?.errors) return JSON.stringify(data.errors);
    return `Request failed (${status})`;
  } catch {
    return `Request failed (${status})`;
  }
}

async function post<T = Json>(path: string, body: Json): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text(); // read as text so we can parse/log even on errors
  if (!res.ok) {
    throw new Error(extractErrorMessage(res.status, text));
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    return {} as T;
  }
}

export const api = {
  login: (input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }) => post("/auth/jobseeker/login", input),

  sendVerification: (email: string) =>
    post("/auth/jobseeker/send-verification-email", { email }),

  verifyEmail: (email: string, code: string) =>
    post("/auth/jobseeker/verify-email", { email, code }),
};
