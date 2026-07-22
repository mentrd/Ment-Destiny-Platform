import { NextResponse } from "next/server";
import { readDb, type UserRow } from "@/lib/db";
import { verifyPassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "請輸入 Email 與密碼" }, { status: 400 });
  }

  const users = await readDb<UserRow[]>("users", []);
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Email 或密碼錯誤" }, { status: 401 });
  }
  if (user.suspended) {
    return NextResponse.json({ error: "此帳號已被停權，請聯絡客服" }, { status: 403 });
  }

  await setSessionCookie(user.id);
  return NextResponse.json({ user: { id: user.id, email: user.email, nickname: user.nickname } });
}
