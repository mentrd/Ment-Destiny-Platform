import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { readDb, writeDb, type RecordRow } from "@/lib/db";

/** 登入後把 localStorage 的紀錄合併進帳號 */
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { history = [], favorites = [] } = await req.json().catch(() => ({}));

  async function merge(dbName: "history" | "favorites", incoming: unknown[]) {
    const rows = await readDb<RecordRow[]>(dbName, []);
    for (const item of incoming.slice(0, 100)) {
      const r = item as Partial<RecordRow>;
      if (!r?.feature || !r?.path || !r?.title) continue;
      if (rows.some((x) => x.userId === user!.id && x.path === r.path)) continue;
      rows.push({
        id: r.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        userId: user!.id,
        feature: String(r.feature),
        title: String(r.title).slice(0, 100),
        path: String(r.path).slice(0, 2000),
        summary: String(r.summary ?? "").slice(0, 300),
        createdAt: r.createdAt || Date.now(),
      });
    }
    await writeDb(dbName, rows);
  }

  await merge("history", history);
  await merge("favorites", favorites);
  return NextResponse.json({ ok: true });
}
