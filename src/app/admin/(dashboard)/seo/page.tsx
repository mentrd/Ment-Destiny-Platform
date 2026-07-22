"use client";

import { useEffect, useState } from "react";

interface SeoOverride {
  path: string;
  title: string;
  description: string;
}

interface SeoConfig {
  siteTitleTemplate: string;
  defaultDescription: string;
  ogImageUrl: string;
  overrides: SeoOverride[];
}

const EMPTY: SeoConfig = {
  siteTitleTemplate: "",
  defaultDescription: "",
  ogImageUrl: "",
  overrides: [],
};

export default function AdminSeoPage() {
  const [cfg, setCfg] = useState<SeoConfig>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/content/seo")
      .then((r) => r.json())
      .then(({ data }) =>
        setCfg({
          ...EMPTY,
          ...(data ?? {}),
          overrides: Array.isArray(data?.overrides) ? data.overrides : [],
        })
      )
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/admin/content/seo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...cfg,
        overrides: cfg.overrides.filter((o) => o.path.trim()),
      }),
    });
    setSaving(false);
    setMsg(res.ok ? "已儲存" : "儲存失敗");
  }

  function setOverride(idx: number, patch: Partial<SeoOverride>) {
    setCfg({
      ...cfg,
      overrides: cfg.overrides.map((o, i) => (i === idx ? { ...o, ...patch } : o)),
    });
  }

  if (loading) return <p className="text-slate-400">載入中…</p>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-gradient-gold text-2xl font-bold">SEO 設定</h1>
          <p className="mt-1 text-sm text-slate-400">全站標題、描述與各頁覆寫</p>
        </div>
        <div className="flex items-center gap-3">
          {msg && <span className="text-sm text-emerald-400">{msg}</span>}
          <button className="btn-gold" onClick={save} disabled={saving}>
            {saving ? "儲存中…" : "儲存設定"}
          </button>
        </div>
      </div>

      <div className="card-mystic mt-6 p-6">
        <h2 className="font-semibold text-slate-200">全站設定</h2>
        <div className="mt-4 grid gap-4">
          <label className="block text-sm text-slate-300">
            網站標題模板（%s 代表頁面標題）
            <input
              className="input-mystic mt-1 w-full"
              value={cfg.siteTitleTemplate}
              onChange={(e) =>
                setCfg({ ...cfg, siteTitleTemplate: e.target.value })
              }
              placeholder="例：%s｜星語 - 免費線上命理測算"
            />
          </label>
          <label className="block text-sm text-slate-300">
            預設描述（meta description）
            <textarea
              className="input-mystic mt-1 w-full"
              rows={3}
              value={cfg.defaultDescription}
              onChange={(e) =>
                setCfg({ ...cfg, defaultDescription: e.target.value })
              }
            />
          </label>
          <label className="block text-sm text-slate-300">
            OG 分享圖網址
            <input
              className="input-mystic mt-1 w-full"
              value={cfg.ogImageUrl}
              onChange={(e) => setCfg({ ...cfg, ogImageUrl: e.target.value })}
              placeholder="https://…/og.png"
            />
          </label>
        </div>
      </div>

      <div className="card-mystic mt-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-200">各頁面覆寫</h2>
          <button
            className="btn-ghost text-sm"
            onClick={() =>
              setCfg({
                ...cfg,
                overrides: [
                  ...cfg.overrides,
                  { path: "", title: "", description: "" },
                ],
              })
            }
          >
            ＋ 新增覆寫
          </button>
        </div>
        {cfg.overrides.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">尚無覆寫規則</p>
        ) : (
          <div className="mt-4 space-y-4">
            {cfg.overrides.map((o, i) => (
              <div
                key={i}
                className="rounded-lg border border-white/10 p-4"
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="block text-sm text-slate-300">
                    路徑
                    <input
                      className="input-mystic mt-1 w-full"
                      value={o.path}
                      onChange={(e) => setOverride(i, { path: e.target.value })}
                      placeholder="例：/tarot"
                    />
                  </label>
                  <label className="block text-sm text-slate-300">
                    標題
                    <input
                      className="input-mystic mt-1 w-full"
                      value={o.title}
                      onChange={(e) => setOverride(i, { title: e.target.value })}
                    />
                  </label>
                  <label className="block text-sm text-slate-300 md:col-span-2">
                    描述
                    <textarea
                      className="input-mystic mt-1 w-full"
                      rows={2}
                      value={o.description}
                      onChange={(e) =>
                        setOverride(i, { description: e.target.value })
                      }
                    />
                  </label>
                </div>
                <div className="mt-3 text-right">
                  <button
                    className="btn-ghost px-3 py-1 text-sm text-rose-400"
                    onClick={() =>
                      setCfg({
                        ...cfg,
                        overrides: cfg.overrides.filter((_, j) => j !== i),
                      })
                    }
                  >
                    刪除此覆寫
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
