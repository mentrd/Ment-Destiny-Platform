import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
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

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const messages = await readDb<ContactMessage[]>("contacts", []);
  return NextResponse.json({
    messages: [...messages].sort((a, b) => b.createdAt - a.createdAt),
  });
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const id = String(body?.id ?? "");
  const messages = await readDb<ContactMessage[]>("contacts", []);
  const msg = messages.find((m) => m.id === id);
  if (!msg) return NextResponse.json({ error: "not found" }, { status: 404 });
  msg.read = typeof body?.read === "boolean" ? body.read : true;
  await writeDb("contacts", messages);
  return NextResponse.json({ ok: true });
}
