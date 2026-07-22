"use client";

import { useEffect, useMemo, useState } from "react";

interface Member {
  id: string;
  email: string;
  nickname: string;
  birthday?: string;
  createdAt: number;
  suspended: boolean;
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/members")
      .then((r) => r.json())
      .then(({ members }) => setMembers(Array.isArray(members) ? members : []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return members;
    return members.filter(
      (m) =>
        m.email.toLowerCase().includes(s) ||
        m.nickname.toLowerCase().includes(s)
    );
  }, [members, q]);

  async function toggleSuspend(m: Member) {
    setBusyId(m.id);
    setMsg("");
    const res = await fetch("/api/admin/members", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: m.id, suspended: !m.suspended }),
    });
    setBusyId(null);
    if (res.ok) {
      setMembers((all) =>
        all.map((x) => (x.id === m.id ? { ...x, suspended: !m.suspended } : x))
      );
    } else {
      setMsg("操作失敗");
    }
  }

  async function remove(m: Member) {
    if (
      !confirm(
        `確定要刪除會員「${m.nickname}」（${m.email}）嗎？\n其測算紀錄與收藏也會一併刪除，此動作無法復原。`
      )
    )
      return;
    setBusyId(m.id);
    setMsg("");
    const res = await fetch("/api/admin/members", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: m.id }),
    });
    setBusyId(null);
    if (res.ok) {
      setMembers((all) => all.filter((x) => x.id !== m.id));
      setMsg("已刪除");
    } else {
      setMsg("刪除失敗");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-gradient-gold text-2xl font-bold">會員管理</h1>
          <p className="mt-1 text-sm text-slate-400">
            共 {members.length} 位會員
          </p>
        </div>
        {msg && <span className="text-sm text-emerald-400">{msg}</span>}
      </div>

      <input
        className="input-mystic mt-4 w-full max-w-sm"
        placeholder="搜尋 Email 或暱稱…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {loading ? (
        <p className="mt-8 text-slate-400">載入中…</p>
      ) : (
        <div className="card-mystic mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-400">
                <th className="px-4 py-3">暱稱</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">生日</th>
                <th className="px-4 py-3">註冊時間</th>
                <th className="px-4 py-3">狀態</th>
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-b border-white/5">
                  <td className="px-4 py-3 text-slate-200">{m.nickname}</td>
                  <td className="px-4 py-3 text-slate-400">{m.email}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {m.birthday ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {new Date(m.createdAt).toLocaleDateString("zh-TW")}
                  </td>
                  <td className="px-4 py-3">
                    {m.suspended ? (
                      <span className="text-rose-400">已停權</span>
                    ) : (
                      <span className="text-emerald-400">正常</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      className="btn-ghost px-3 py-1 text-sm"
                      disabled={busyId === m.id}
                      onClick={() => toggleSuspend(m)}
                    >
                      {m.suspended ? "復權" : "停權"}
                    </button>
                    <button
                      className="btn-ghost ml-2 px-3 py-1 text-sm text-rose-400"
                      disabled={busyId === m.id}
                      onClick={() => remove(m)}
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    {members.length === 0 ? "尚無會員" : "找不到符合的會員"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
