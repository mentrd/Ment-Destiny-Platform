"use client";

import { useEffect, useState } from "react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  createdAt: number;
  read?: boolean;
}

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/contacts")
      .then((r) => r.json())
      .then(({ messages }) =>
        setMessages(Array.isArray(messages) ? messages : [])
      )
      .finally(() => setLoading(false));
  }, []);

  async function markRead(id: string, read: boolean) {
    setBusyId(id);
    const res = await fetch("/api/admin/contacts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read }),
    });
    setBusyId(null);
    if (res.ok) {
      setMessages((all) => all.map((m) => (m.id === id ? { ...m, read } : m)));
    }
  }

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <h1 className="text-gradient-gold text-2xl font-bold">聯絡訊息</h1>
      <p className="mt-1 text-sm text-slate-400">
        共 {messages.length} 則訊息，{unread} 則未讀
      </p>

      {loading ? (
        <p className="mt-8 text-slate-400">載入中…</p>
      ) : messages.length === 0 ? (
        <p className="mt-8 text-slate-500">尚無聯絡訊息</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {messages.map((m) => {
            const open = openId === m.id;
            return (
              <li key={m.id} className="card-mystic p-4">
                <button
                  type="button"
                  className="flex w-full items-center gap-3 text-left"
                  onClick={() => setOpenId(open ? null : m.id)}
                >
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      m.read ? "bg-white/15" : "bg-amber-400"
                    }`}
                    aria-label={m.read ? "已讀" : "未讀"}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-slate-200">
                      <span className="mr-2 rounded bg-white/10 px-1.5 py-0.5 text-xs text-slate-300">
                        {m.topic}
                      </span>
                      {m.name}
                      <span className="ml-2 text-xs text-slate-500">
                        {m.email}
                      </span>
                    </p>
                    {!open && (
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {m.message}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-slate-500">
                    {new Date(m.createdAt).toLocaleString("zh-TW")}
                  </span>
                  <span className="shrink-0 text-slate-500">{open ? "▲" : "▼"}</span>
                </button>
                {open && (
                  <div className="mt-3 border-t border-white/10 pt-3">
                    <p className="text-sm whitespace-pre-wrap text-slate-300">
                      {m.message}
                    </p>
                    <div className="mt-3 text-right">
                      <button
                        className="btn-ghost px-3 py-1 text-sm"
                        disabled={busyId === m.id}
                        onClick={() => markRead(m.id, !m.read)}
                      >
                        {m.read ? "標為未讀" : "標記已讀"}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
