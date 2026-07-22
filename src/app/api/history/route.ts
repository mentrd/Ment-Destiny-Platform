import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { readDb, writeDb, type RecordRow } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ records: [] });
  const all = await readDb<RecordRow[]>("history", []);
  const records = all.filter((r) => r.userId === user.id).sort((a, b) => b.createdAt - a.createdAt).slice(0, 200);
  return NextResponse.json({ records });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body?.feature || !body?.path || !body?.title) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const all = await readDb<RecordRow[]>("history", []);
  if (!all.some((r) => r.userId === user.id && r.path === body.path)) {
    all.push({
      id: body.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      userId: user.id,
      feature: String(body.feature),
      title: String(body.title).slice(0, 100),
      path: String(body.path).slice(0, 2000),
      summary: String(body.summary ?? "").slice(0, 300),
      createdAt: body.createdAt || Date.now(),
    });
    await writeDb("history", all);
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id, all: clearAll } = await req.json().catch(() => ({}));
  const rows = await readDb<RecordRow[]>("history", []);
  const kept = clearAll
    ? rows.filter((r) => r.userId !== user.id)
    : rows.filter((r) => !(r.userId === user.id && r.id === id));
  await writeDb("history", kept);
  return NextResponse.json({ ok: true });
}
