import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { readDb, writeDb, bumpStat, type UserRow } from "@/lib/db";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password, nickname, agree } = await req.json().catch(() => ({}));

  if (!agree) return NextResponse.json({ error: "請先同意使用條款與隱私權政策" }, { status: 400 });
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email 格式不正確" }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 8) {
    return NextResponse.json({ error: "密碼至少需要 8 個字元" }, { status: 400 });
  }
  if (typeof nickname !== "string" || nickname.trim().length < 1 || nickname.length > 20) {
    return NextResponse.json({ error: "請輸入 1-20 字的暱稱" }, { status: 400 });
  }

  const users = await readDb<UserRow[]>("users", []);
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return NextResponse.json({ error: "這個 Email 已經註冊過了" }, { status: 409 });
  }

  const user: UserRow = {
    id: randomUUID(),
    email: email.toLowerCase(),
    nickname: nickname.trim(),
    passwordHash: hashPassword(password),
    createdAt: Date.now(),
  };
  users.push(user);
  await writeDb("users", users);
  await setSessionCookie(user.id);
  await bumpStat("register");

  return NextResponse.json({ user: { id: user.id, email: user.email, nickname: user.nickname } });
}
