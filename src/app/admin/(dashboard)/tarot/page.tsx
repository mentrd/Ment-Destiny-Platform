"use client";

import { useEffect, useMemo, useState } from "react";
import { TAROT_CARDS, type TarotCard } from "@/lib/engines/tarot-data";

const FIELDS: { key: keyof TarotCard; label: string }[] = [
  { key: "upright", label: "正位牌義" },
  { key: "reversed", label: "逆位牌義" },
  { key: "love", label: "愛情（正位）" },
  { key: "loveReversed", label: "愛情（逆位）" },
  { key: "career", label: "事業（正位）" },
  { key: "careerReversed", label: "事業（逆位）" },
];

export default function AdminTarotPage() {
  const [cards, setCards] = useState<TarotCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [arcana, setArcana] = useState<"all" | "major" | "minor">("all");
  const [q, setQ] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<TarotCard | null>(null);

  useEffect(() => {
    fetch("/api/admin/content/tarot-cards")
      .then((r) => r.json())
      .then(({ data }) => setCards(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () =>
      cards.filter((c) => {
        if (arcana !== "all" && c.arcana !== arcana) return false;
        if (!q) return true;
        const s = q.trim().toLowerCase();
        return (
          c.name.includes(s) ||
          c.nameEn.toLowerCase().includes(s) ||
          c.keywords.some((k) => k.includes(s))
        );
      }),
    [cards, arcana, q]
  );

  async function putAll(next: TarotCard[], okMsg: string) {
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/admin/content/tarot-cards", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    setSaving(false);
    if (res.ok) {
      setCards(next);
      setMsg(okMsg);
    } else {
      setMsg("儲存失敗");
    }
  }

  function startEdit(card: TarotCard) {
    setEditingId(card.id);
    setDraft({ ...card, keywords: [...card.keywords] });
    setMsg("");
  }

  async function saveDraft() {
    if (!draft) return;
    const next = cards.map((c) => (c.id === draft.id ? draft : c));
    await putAll(next, "已儲存");
    setEditingId(null);
    setDraft(null);
  }

  async function resetAll() {
    if (!confirm("確定要將全部 78 張牌義還原為預設嗎？此動作無法復原。")) return;
    await putAll(TAROT_CARDS, "已還原預設");
    setEditingId(null);
    setDraft(null);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-gradient-gold text-2xl font-bold">塔羅牌義</h1>
          <p className="mt-1 text-sm text-slate-400">編輯 78 張塔羅牌的解讀文案</p>
        </div>
        <div className="flex items-center gap-3">
          {msg && <span className="text-sm text-emerald-400">{msg}</span>}
          <button className="btn-ghost" onClick={resetAll} disabled={saving}>
            還原全部預設
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <select
          className="input-mystic"
          value={arcana}
          onChange={(e) => setArcana(e.target.value as typeof arcana)}
        >
          <option value="all">全部</option>
          <option value="major">大阿爾克那</option>
          <option value="minor">小阿爾克那</option>
        </select>
        <input
          className="input-mystic flex-1 min-w-48"
          placeholder="搜尋牌名 / 英文 / 關鍵字…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="mt-8 text-slate-400">載入中…</p>
      ) : (
        <div className="card-mystic mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-400">
                <th className="px-4 py-3">牌</th>
                <th className="px-4 py-3">類別</th>
                <th className="px-4 py-3">關鍵字</th>
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-white/5 align-top">
                  <td className="px-4 py-3 text-slate-200">
                    <span className="mr-2" aria-hidden>
                      {c.emoji}
                    </span>
                    {c.name}
                    <span className="ml-2 text-xs text-slate-500">{c.nameEn}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {c.arcana === "major" ? "大阿爾克那" : "小阿爾克那"}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {c.keywords.join("、")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      className="btn-ghost px-3 py-1 text-sm"
                      onClick={() =>
                        editingId === c.id
                          ? (setEditingId(null), setDraft(null))
                          : startEdit(c)
                      }
                    >
                      {editingId === c.id ? "收合" : "編輯"}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                    找不到符合的牌
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {draft && editingId !== null && (
        <div className="card-mystic mt-4 p-6">
          <h2 className="font-semibold text-slate-200">
            編輯：{draft.emoji} {draft.name}（{draft.nameEn}）
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {FIELDS.map((f) => (
              <label key={f.key} className="block text-sm text-slate-300">
                {f.label}
                <textarea
                  className="input-mystic mt-1 w-full"
                  rows={4}
                  value={String(draft[f.key] ?? "")}
                  onChange={(e) =>
                    setDraft({ ...draft, [f.key]: e.target.value })
                  }
                />
              </label>
            ))}
            <label className="block text-sm text-slate-300 md:col-span-2">
              關鍵字（以「、」或逗號分隔）
              <input
                className="input-mystic mt-1 w-full"
                value={draft.keywords.join("、")}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    keywords: e.target.value
                      .split(/[、,，]/)
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </label>
          </div>
          <div className="mt-4 flex gap-3">
            <button className="btn-gold" onClick={saveDraft} disabled={saving}>
              {saving ? "儲存中…" : "儲存此牌"}
            </button>
            <button
              className="btn-ghost"
              onClick={() => {
                setEditingId(null);
                setDraft(null);
              }}
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
