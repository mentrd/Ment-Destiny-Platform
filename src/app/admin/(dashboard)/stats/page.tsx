"use client";

import { useCallback, useEffect, useState } from "react";
import { FEATURES } from "@/lib/features";

interface StatRow {
  date: string;
  type: string;
  feature?: string;
  channel?: string;
  count: number;
}

const CHANNEL_LABEL: Record<string, string> = {
  fb: "Facebook",
  line: "LINE",
  ig: "Instagram",
  link: "複製連結",
  image: "下載圖片",
};

function dateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default function AdminStatsPage() {
  const [from, setFrom] = useState(dateStr(new Date(Date.now() - 29 * 86400000)));
  const [to, setTo] = useState(dateStr(new Date()));
  const [rows, setRows] = useState<StatRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (f: string, t: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/stats?from=${encodeURIComponent(f)}&to=${encodeURIComponent(t)}`
      );
      const data = await res.json();
      setRows(Array.isArray(data?.rows) ? data.rows : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(from, to);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sum = (list: StatRow[]) => list.reduce((a, r) => a + r.count, 0);

  const readings = rows.filter((r) => r.type === "reading_complete");
  const shares = rows.filter((r) => r.type === "share");
  const registers = sum(rows.filter((r) => r.type === "register"));
  const readingTotal = sum(readings);
  const shareTotal = sum(shares);
  const shareRate =
    readingTotal > 0 ? ((shareTotal / readingTotal) * 100).toFixed(1) : "—";

  const byFeature = new Map<string, number>();
  for (const r of readings) {
    const key = r.feature ?? "unknown";
    byFeature.set(key, (byFeature.get(key) ?? 0) + r.count);
  }
  const featureRows = [...byFeature.entries()].sort((a, b) => b[1] - a[1]);
  const featureMax = Math.max(1, ...featureRows.map(([, c]) => c));

  const byChannel = new Map<string, number>();
  for (const r of shares) {
    const key = r.channel ?? "other";
    byChannel.set(key, (byChannel.get(key) ?? 0) + r.count);
  }
  const channelRows = [...byChannel.entries()].sort((a, b) => b[1] - a[1]);
  const channelMax = Math.max(1, ...channelRows.map(([, c]) => c));

  return (
    <div>
      <h1 className="text-gradient-gold text-2xl font-bold">統計報表</h1>
      <p className="mt-1 text-sm text-slate-400">選擇日期區間檢視使用數據</p>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="block text-sm text-slate-300">
          起始日
          <input
            type="date"
            className="input-mystic mt-1 block"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </label>
        <label className="block text-sm text-slate-300">
          結束日
          <input
            type="date"
            className="input-mystic mt-1 block"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </label>
        <button className="btn-gold" onClick={() => load(from, to)} disabled={loading}>
          {loading ? "查詢中…" : "查詢"}
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "測算完成", value: String(readingTotal) },
          { label: "分享次數", value: String(shareTotal) },
          { label: "新註冊", value: String(registers) },
          { label: "分享率", value: shareRate === "—" ? "—" : `${shareRate}%` },
        ].map((c) => (
          <div key={c.label} className="card-mystic p-5">
            <p className="text-sm text-slate-400">{c.label}</p>
            <p className="mt-2 text-3xl font-bold text-amber-200">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="card-mystic p-6">
          <h2 className="font-semibold text-slate-200">各功能使用量</h2>
          {featureRows.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">此區間無測算資料</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[380px] text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-slate-400">
                    <th className="px-2 py-2">功能</th>
                    <th className="px-2 py-2 w-24 text-right">次數</th>
                    <th className="px-2 py-2 w-1/2">佔比</th>
                  </tr>
                </thead>
                <tbody>
                  {featureRows.map(([slug, count]) => {
                    const f = FEATURES.find((x) => x.slug === slug);
                    return (
                      <tr key={slug} className="border-b border-white/5">
                        <td className="px-2 py-2 text-slate-300">
                          <span className="mr-1.5" aria-hidden>
                            {f?.icon ?? "✨"}
                          </span>
                          {f?.name ?? slug}
                        </td>
                        <td className="px-2 py-2 text-right text-slate-400">
                          {count}
                        </td>
                        <td className="px-2 py-2">
                          <div className="h-2.5 rounded-full bg-white/5">
                            <div
                              className="h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-200"
                              style={{ width: `${(count / featureMax) * 100}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="card-mystic p-6">
          <h2 className="font-semibold text-slate-200">分享管道分佈</h2>
          {channelRows.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">此區間無分享資料</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {channelRows.map(([ch, count]) => (
                <li key={ch}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">
                      {CHANNEL_LABEL[ch] ?? ch}
                    </span>
                    <span className="text-slate-400">{count}</span>
                  </div>
                  <div className="mt-1 h-2.5 rounded-full bg-white/5">
                    <div
                      className="h-2.5 rounded-full bg-gradient-to-r from-indigo-400 to-violet-300"
                      style={{ width: `${(count / channelMax) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
