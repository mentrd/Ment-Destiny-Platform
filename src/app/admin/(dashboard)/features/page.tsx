"use client";

import { useEffect, useMemo, useState } from "react";
import { FEATURES } from "@/lib/features";

interface FeaturesConfig {
  hidden: string[];
  order: string[];
}

export default function AdminFeaturesPage() {
  const [order, setOrder] = useState<string[]>([]);
  const [hidden, setHidden] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/content/features")
      .then((r) => r.json())
      .then(({ data }: { data: FeaturesConfig }) => {
        const saved = Array.isArray(data?.order) ? data.order : [];
        const all = FEATURES.map((f) => f.slug);
        const merged = [
          ...saved.filter((s) => all.includes(s)),
          ...all.filter((s) => !saved.includes(s)),
        ];
        setOrder(merged);
        setHidden(Array.isArray(data?.hidden) ? data.hidden : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const list = useMemo(
    () =>
      order
        .map((slug) => FEATURES.find((f) => f.slug === slug))
        .filter((f): f is (typeof FEATURES)[number] => Boolean(f)),
    [order]
  );

  function move(idx: number, dir: -1 | 1) {
    const next = [...order];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setOrder(next);
  }

  function toggle(slug: string) {
    setHidden((h) =>
      h.includes(slug) ? h.filter((s) => s !== slug) : [...h, slug]
    );
  }

  async function save() {
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/admin/content/features", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hidden, order }),
    });
    setSaving(false);
    setMsg(res.ok ? "已儲存" : "儲存失敗");
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-gradient-gold text-2xl font-bold">功能管理</h1>
          <p className="mt-1 text-sm text-slate-400">
            控制前台 12 項功能的顯示與排序
          </p>
        </div>
        <div className="flex items-center gap-3">
          {msg && <span className="text-sm text-emerald-400">{msg}</span>}
          <button className="btn-gold" onClick={save} disabled={saving || loading}>
            {saving ? "儲存中…" : "儲存變更"}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="mt-8 text-slate-400">載入中…</p>
      ) : (
        <ul className="mt-6 space-y-2">
          {list.map((f, idx) => {
            const isHidden = hidden.includes(f.slug);
            return (
              <li
                key={f.slug}
                className="card-mystic flex items-center gap-3 px-4 py-3"
              >
                <span className="text-xl" aria-hidden>
                  {f.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={isHidden ? "text-slate-500 line-through" : "text-slate-200"}>
                    {f.name}
                  </p>
                  <p className="truncate text-xs text-slate-500">{f.tagline}</p>
                </div>
                <button
                  className="btn-ghost px-2 py-1 text-sm"
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0}
                  aria-label="上移"
                >
                  ↑
                </button>
                <button
                  className="btn-ghost px-2 py-1 text-sm"
                  onClick={() => move(idx, 1)}
                  disabled={idx === list.length - 1}
                  aria-label="下移"
                >
                  ↓
                </button>
                <button
                  type="button"
                  role="switch"
                  aria-checked={!isHidden}
                  onClick={() => toggle(f.slug)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    isHidden ? "bg-white/10" : "bg-amber-400/80"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                      isHidden ? "left-0.5" : "left-[22px]"
                    }`}
                  />
                </button>
                <span className="w-8 text-xs text-slate-400">
                  {isHidden ? "隱藏" : "顯示"}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
