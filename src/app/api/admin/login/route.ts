import { NextResponse } from "next/server";
import { verifyAdmin, setAdminCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const username = String(body?.username ?? "");
  const password = String(body?.password ?? "");
  if (!verifyAdmin(username, password)) {
    return NextResponse.json({ error: "帳號或密碼錯誤" }, { status: 401 });
  }
  await setAdminCookie();
  return NextResponse.json({ ok: true });
}
