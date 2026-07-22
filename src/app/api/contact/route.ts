import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  createdAt: number;
  read?: boolean;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.email || !body?.message) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const messages = await readDb<ContactMessage[]>("contacts", []);
  messages.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: String(body.name).slice(0, 50),
    email: String(body.email).slice(0, 100),
    topic: String(body.topic ?? "其他").slice(0, 20),
    message: String(body.message).slice(0, 2000),
    createdAt: Date.now(),
  });
  await writeDb("contacts", messages);
  return NextResponse.json({ ok: true });
}
