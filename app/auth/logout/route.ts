import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const c = cookies();
  (await c).delete("accessToken");
  (await c).delete("refreshToken");
  return NextResponse.json({ success: true });
}
