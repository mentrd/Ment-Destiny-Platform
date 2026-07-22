import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { readDb, type StatRow, type UserRow } from "@/lib/db";

function isDateStr(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

export async function GET(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const today = new Date().toISOString().slice(0, 10);
  const defaultFrom = new Date(Date.now() - 29 * 86400000)
    .toISOString()
    .slice(0, 10);
  let from = url.searchParams.get("from") ?? defaultFrom;
  let to = url.searchParams.get("to") ?? today;
  if (!isDateStr(from)) from = defaultFrom;
  if (!isDateStr(to)) to = today;
  if (from > to) [from, to] = [to, from];

  const stats = await readDb<StatRow[]>("stats", []);
  const rows = stats.filter((s) => s.date >= from && s.date <= to);

  const users = await readDb<UserRow[]>("users", []);
  const memberTotal = users.length;

  return NextResponse.json({ from, to, rows, memberTotal });
}
