import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { readDb, writeDb, type UserRow, type RecordRow } from "@/lib/db";

function sanitize(u: UserRow) {
  return {
    id: u.id,
    email: u.email,
    nickname: u.nickname,
    birthday: u.birthday,
    createdAt: u.createdAt,
    suspended: Boolean(u.suspended),
  };
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const users = await readDb<UserRow[]>("users", []);
  return NextResponse.json({
    members: [...users].sort((a, b) => b.createdAt - a.createdAt).map(sanitize),
  });
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const id = String(body?.id ?? "");
  const users = await readDb<UserRow[]>("users", []);
  const user = users.find((u) => u.id === id);
  if (!user) return NextResponse.json({ error: "not found" }, { status: 404 });
  user.suspended =
    typeof body?.suspended === "boolean" ? body.suspended : !user.suspended;
  await writeDb("users", users);
  return NextResponse.json({ ok: true, member: sanitize(user) });
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const id = String(body?.id ?? "");
  const users = await readDb<UserRow[]>("users", []);
  if (!users.some((u) => u.id === id)) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  await writeDb("users", users.filter((u) => u.id !== id));
  const history = await readDb<RecordRow[]>("history", []);
  await writeDb("history", history.filter((r) => r.userId !== id));
  const favorites = await readDb<RecordRow[]>("favorites", []);
  await writeDb("favorites", favorites.filter((r) => r.userId !== id));
  return NextResponse.json({ ok: true });
}
