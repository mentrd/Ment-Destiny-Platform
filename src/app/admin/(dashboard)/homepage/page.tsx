"use client";

import { useEffect, useState } from "react";

interface HomepageConfig {
  heroTitle: string;
  heroSubtitle: string;
  announcement: string;
}

const EMPTY: HomepageConfig = {
  heroTitle: "",
  heroSubtitle: "",
  announcement: "",
};

export default function AdminHomepagePage() {
  const [cfg, setCfg] = useState<HomepageConfig>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/content/homepage")
      .then((r) => r.json())
      .then(({ data }) => setCfg({ ...EMPTY, ...(data ?? {}) }))
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/admin/content/homepage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cfg),
    });
    setSaving(false);
    setMsg(res.ok ? "已儲存" : "儲存失敗");
  }

  if (loading) return <p className="text-slate-400">載入中…</p>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-gradient-gold text-2xl font-bold">首頁設定</h1>
          <p className="mt-1 text-sm text-slate-400">
            首頁主視覺文案與公告列（留空使用預設）
          </p>
        </div>
        <div className="flex items-center gap-3">
          {msg && <span className="text-sm text-emerald-400">{msg}</span>}
          <button className="btn-gold" onClick={save} disabled={saving}>
            {saving ? "儲存中…" : "儲存設定"}
          </button>
        </div>
      </div>

      <div className="card-mystic mt-6 max-w-2xl p-6">
        <div className="grid gap-4">
          <label className="block text-sm text-slate-300">
            主標題（Hero Title）
            <input
              className="input-mystic mt-1 w-full"
              value={cfg.heroTitle}
              onChange={(e) => setCfg({ ...cfg, heroTitle: e.target.value })}
            />
          </label>
          <label className="block text-sm text-slate-300">
            副標題（Hero Subtitle）
            <textarea
              className="input-mystic mt-1 w-full"
              rows={2}
              value={cfg.heroSubtitle}
              onChange={(e) => setCfg({ ...cfg, heroSubtitle: e.target.value })}
            />
          </label>
          <label className="block text-sm text-slate-300">
            公告列（留空則不顯示）
            <textarea
              className="input-mystic mt-1 w-full"
              rows={2}
              value={cfg.announcement}
              onChange={(e) => setCfg({ ...cfg, announcement: e.target.value })}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
