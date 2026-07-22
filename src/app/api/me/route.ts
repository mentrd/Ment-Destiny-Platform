import { NextResponse } from "next/server";
import { getCurrentUser, clearSessionCookie } from "@/lib/auth";
import { readDb, writeDb, type UserRow, type RecordRow } from "@/lib/db";

/** PATCH /api/me — 更新個人資料（暱稱、預設生日） */
export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "請先登入" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "資料格式不正確" }, { status: 400 });
  }

  const { nickname, birthday } = body as { nickname?: unknown; birthday?: unknown };
  let hasUpdate = false;

  let nextNickname: string | undefined;
  if (nickname !== undefined) {
    if (typeof nickname !== "string" || nickname.trim().length < 1 || nickname.trim().length > 20) {
      return NextResponse.json({ error: "請輸入 1-20 字的暱稱" }, { status: 400 });
    }
    nextNickname = nickname.trim();
    hasUpdate = true;
  }

  let nextBirthday: string | undefined;
  let clearBirthday = false;
  if (birthday !== undefined) {
    if (birthday === "" || birthday === null) {
      clearBirthday = true;
    } else {
      if (typeof birthday !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
        return NextResponse.json({ error: "生日格式不正確（YYYY-MM-DD）" }, { status: 400 });
      }
      const d = new Date(`${birthday}T00:00:00`);
      if (Number.isNaN(d.getTime()) || d.getTime() > Date.now() || d.getFullYear() < 1900) {
        return NextResponse.json({ error: "請輸入有效的生日日期" }, { status: 400 });
      }
      nextBirthday = birthday;
    }
    hasUpdate = true;
  }

  if (!hasUpdate) {
    return NextResponse.json({ error: "沒有可更新的欄位" }, { status: 400 });
  }

  const users = await readDb<UserRow[]>("users", []);
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx === -1) return NextResponse.json({ error: "找不到帳號" }, { status: 404 });

  if (nextNickname !== undefined) users[idx].nickname = nextNickname;
  if (clearBirthday) delete users[idx].birthday;
  else if (nextBirthday !== undefined) users[idx].birthday = nextBirthday;

  await writeDb("users", users);

  const u = users[idx];
  return NextResponse.json({
    user: { id: u.id, email: u.email, nickname: u.nickname, birthday: u.birthday ?? null },
  });
}

/** DELETE /api/me — 刪除帳號與所有紀錄，並登出 */
export async function DELETE() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "請先登入" }, { status: 401 });

  const users = await readDb<UserRow[]>("users", []);
  await writeDb(
    "users",
    users.filter((u) => u.id !== user.id)
  );

  const history = await readDb<RecordRow[]>("history", []);
  await writeDb(
    "history",
    history.filter((r) => r.userId !== user.id)
  );

  const favorites = await readDb<RecordRow[]>("favorites", []);
  await writeDb(
    "favorites",
    favorites.filter((r) => r.userId !== user.id)
  );

  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
