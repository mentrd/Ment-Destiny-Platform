import { NextResponse } from "next/server";
import { bumpStat } from "@/lib/db";

const VALID_TYPES = new Set(["reading_start", "reading_complete", "share", "favorite", "register"]);

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || !VALID_TYPES.has(body.type)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  await bumpStat(
    String(body.type),
    body.feature ? String(body.feature).slice(0, 30) : undefined,
    body.channel ? String(body.channel).slice(0, 10) : undefined
  );
  return NextResponse.json({ ok: true });
}
