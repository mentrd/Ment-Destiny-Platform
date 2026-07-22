"use client";

import { useEffect, useMemo, useState } from "react";

/** 籤詩資料（結構以引擎 lots-data 為準，這裡採寬鬆型別以保留其他欄位） */
type LotRow = Record<string, unknown> & {
  poem?: string;
  modern?: string;
  advice?: string;
  level?: string;
};
type LotSetRow = Record<string, unknown> & {
  name?: string;
  lots?: LotRow[];
};

const EDIT_FIELDS: { key: "poem" | "modern" | "advice"; label: string; rows: number }[] = [
  { key: "poem", label: "籤詩原文", rows: 3 },
  { key: "modern", label: "白話解說", rows: 4 },
  { key: "advice", label: "建議", rows: 3 },
];

export default function AdminLotsPage() {
  const [sets, setSets] = useState<LotSetRow[]>([]);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [draft, setDraft] = useState<LotRow | null>(null);

  useEffect(() => {
    fetch("/api/admin/content/lots")
      .then((r) => r.json())
      .then(({ data }) => setSets(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const current = sets[tab];
  const lots = useMemo(
    () => (Array.isArray(current?.lots) ? current.lots : []),
    [current]
  );

  function startEdit(idx: number) {
    setEditIdx(idx);
    setDraft({ ...lots[idx] });
    setMsg("");
  }

  async function saveDraft() {
    if (draft === null || editIdx === null) return;
    const next = sets.map((s, si) =>
      si === tab
        ? {
            ...s,
            lots: (Array.isArray(s.lots) ? s.lots : []).map((l, li) =>
              li === editIdx ? { ...l, ...draft } : l
            ),
          }
        : s
    );
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/admin/content/lots", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    setSaving(false);
    if (res.ok) {
      setSets(next);
      setMsg("已儲存");
      setEditIdx(null);
      setDraft(null);
    } else {
      setMsg("儲存失敗");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-gradient-gold text-2xl font-bold">籤詩管理</h1>
          <p className="mt-1 text-sm text-slate-400">編輯各籤種的籤詩內容</p>
        </div>
        {msg && <span className="text-sm text-emerald-400">{msg}</span>}
      </div>

      {loading ? (
        <p className="mt-8 text-slate-400">載入中…</p>
      ) : sets.length === 0 ? (
        <p className="mt-8 text-slate-500">尚無籤詩資料</p>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap gap-2">
            {sets.map((s, i) => (
              <button
                key={i}
                className={
                  i === tab
                    ? "btn-gold px-4 py-1.5 text-sm"
                    : "btn-ghost px-4 py-1.5 text-sm"
                }
                onClick={() => {
                  setTab(i);
                  setEditIdx(null);
                  setDraft(null);
                }}
              >
                {String(s.name ?? `籤種 ${i + 1}`)}
              </button>
            ))}
          </div>

          <div className="card-mystic mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-slate-400">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">吉凶</th>
                  <th className="px-4 py-3">籤詩</th>
                  <th className="px-4 py-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {lots.map((lot, i) => (
                  <tr key={i} className="border-b border-white/5 align-top">
                    <td className="px-4 py-3 text-slate-400">第 {i + 1} 籤</td>
                    <td className="px-4 py-3 text-amber-200">
                      {String(lot.level ?? "—")}
                    </td>
                    <td className="max-w-md px-4 py-3 text-slate-300">
                      <span className="line-clamp-2">{String(lot.poem ?? "")}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        className="btn-ghost px-3 py-1 text-sm"
                        onClick={() =>
                          editIdx === i
                            ? (setEditIdx(null), setDraft(null))
                            : startEdit(i)
                        }
                      >
                        {editIdx === i ? "收合" : "編輯"}
                      </button>
                    </td>
                  </tr>
                ))}
                {lots.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                      此籤種尚無籤詩
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {draft !== null && editIdx !== null && (
            <div className="card-mystic mt-4 p-6">
              <h2 className="font-semibold text-slate-200">
                編輯：{String(current?.name ?? "")} 第 {editIdx + 1} 籤
              </h2>
              <div className="mt-4 grid gap-4">
                <label className="block text-sm text-slate-300">
                  吉凶等級
                  <input
                    className="input-mystic mt-1 w-full max-w-xs"
                    value={String(draft.level ?? "")}
                    onChange={(e) => setDraft({ ...draft, level: e.target.value })}
                    placeholder="例：上上、中吉、下下"
                  />
                </label>
                {EDIT_FIELDS.map((f) => (
                  <label key={f.key} className="block text-sm text-slate-300">
                    {f.label}
                    <textarea
                      className="input-mystic mt-1 w-full"
                      rows={f.rows}
                      value={String(draft[f.key] ?? "")}
                      onChange={(e) =>
                        setDraft({ ...draft, [f.key]: e.target.value })
                      }
                    />
                  </label>
                ))}
              </div>
              <div className="mt-4 flex gap-3">
                <button className="btn-gold" onClick={saveDraft} disabled={saving}>
                  {saving ? "儲存中…" : "儲存此籤"}
                </button>
                <button
                  className="btn-ghost"
                  onClick={() => {
                    setEditIdx(null);
                    setDraft(null);
                  }}
                >
                  取消
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
