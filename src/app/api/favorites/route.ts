import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { readDb, writeDb, type RecordRow } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ records: [] });
  const all = await readDb<RecordRow[]>("favorites", []);
  const records = all.filter((r) => r.userId === user.id).sort((a, b) => b.createdAt - a.createdAt);
  return NextResponse.json({ records });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body?.feature || !body?.path || !body?.title) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const all = await readDb<RecordRow[]>("favorites", []);
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
    await writeDb("favorites", all);
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { path } = await req.json().catch(() => ({}));
  const all = await readDb<RecordRow[]>("favorites", []);
  await writeDb("favorites", all.filter((r) => !(r.userId === user.id && r.path === path)));
  return NextResponse.json({ ok: true });
}
