"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getHistory, getFavorites, type ReadingRecord } from "@/lib/storage";
import { getFeature } from "@/lib/features";

type Kind = "history" | "favorites";

const LOCAL_KEYS: Record<Kind, string> = {
  history: "sw_history",
  favorites: "sw_favorites",
};

/** 相對時間：剛剛 / X 分鐘前 / X 小時前 / X 天前 / 日期 */
function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "剛剛";
  if (min < 60) return `${min} 分鐘前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} 小時前`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} 天前`;
  const d = new Date(ts);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

export default function RecordList({ kind }: { kind: Kind }) {
  // null = 載入中
  const [records, setRecords] = useState<ReadingRecord[] | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [filter, setFilter] = useState("all");
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      let li = false;
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        li = Boolean(data?.user);
      } catch {
        /* 視為未登入 */
      }
      const recs = kind === "history" ? await getHistory() : await getFavorites();
      if (!mounted) return;
      setLoggedIn(li);
      setRecords(recs);
    })();
    return () => {
      mounted = false;
    };
  }, [kind]);

  /** 有紀錄的 feature slugs（保留出現順序） */
  const slugs = useMemo(() => {
    const list: string[] = [];
    for (const r of records ?? []) {
      if (!list.includes(r.feature)) list.push(r.feature);
    }
    return list;
  }, [records]);

  // 刪除後若目前篩選的 feature 已無紀錄，回到「全部」
  useEffect(() => {
    if (filter !== "all" && !slugs.includes(filter)) setFilter("all");
  }, [filter, slugs]);

  const filtered = useMemo(() => {
    if (!records) return [];
    return filter === "all" ? records : records.filter((r) => r.feature === filter);
  }, [records, filter]);

  async function handleDelete(rec: ReadingRecord) {
    setDeletingId(rec.id);
    try {
      if (loggedIn) {
        const res = await fetch(kind === "history" ? "/api/history" : "/api/favorites", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(kind === "history" ? { id: rec.id } : { path: rec.path }),
        });
        if (!res.ok) return;
      } else {
        const key = LOCAL_KEYS[kind];
        try {
          const list: ReadingRecord[] = JSON.parse(localStorage.getItem(key) || "[]");
          const next = list.filter((x) => (kind === "history" ? x.id !== rec.id : x.path !== rec.path));
          localStorage.setItem(key, JSON.stringify(next));
        } catch {
          /* 解析失敗時略過本機更新 */
        }
      }
      setRecords((rs) => (rs ?? []).filter((x) => x.id !== rec.id));
    } catch {
      /* 網路錯誤：保留原紀錄 */
    } finally {
      setDeletingId("");
    }
  }

  const chipBase = "min-h-[36px] rounded-full border px-3.5 py-1.5 text-sm transition";

  return (
    <div>
      {/* 未登入提示條 */}
      {records !== null && !loggedIn && (
        <div className="card-mystic mt-4 flex flex-col items-center justify-between gap-3 p-4 sm:flex-row">
          <p className="text-sm text-ink-300">
            <span aria-hidden>☁️ </span>登入後可跨裝置同步紀錄
          </p>
          <Link href="/login" className="btn-gold shrink-0 !min-h-[36px] px-5 py-1.5 text-sm">
            登入
          </Link>
        </div>
      )}

      {records === null && (
        <div className="card-mystic mt-4 p-8 text-center text-sm text-ink-500" role="status">
          載入中…
        </div>
      )}

      {records !== null && records.length === 0 && (
        <div className="card-mystic mt-4 p-10 text-center">
          <div className="text-5xl" aria-hidden>
            {kind === "history" ? "🔮" : "⭐"}
          </div>
          <p className="mt-4 text-ink-300">
            {kind === "history" ? "還沒有紀錄，去試試熱門的塔羅占卜吧" : "收藏喜歡的結果，隨時回味"}
          </p>
          <Link href="/tarot" className="btn-gold mt-6">
            {kind === "history" ? "🃏 開始塔羅占卜" : "🃏 去塔羅占卜逛逛"}
          </Link>
        </div>
      )}

      {records !== null && records.length > 0 && (
        <>
          {/* 功能篩選 chips */}
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="功能篩選">
            <button
              type="button"
              onClick={() => setFilter("all")}
              aria-pressed={filter === "all"}
              className={`${chipBase} ${
                filter === "all"
                  ? "border-gold-300/60 bg-gold-300/15 text-gold-300"
                  : "border-mystic-400/25 bg-night-800/60 text-ink-300 hover:border-mystic-400/50"
              }`}
            >
              全部
            </button>
            {slugs.map((s) => {
              const f = getFeature(s);
              const active = filter === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFilter(s)}
                  aria-pressed={active}
                  className={`${chipBase} ${
                    active
                      ? "border-gold-300/60 bg-gold-300/15 text-gold-300"
                      : "border-mystic-400/25 bg-night-800/60 text-ink-300 hover:border-mystic-400/50"
                  }`}
                >
                  {f ? `${f.icon} ${f.shortName}` : s}
                </button>
              );
            })}
          </div>

          {/* 紀錄列表 */}
          <ul className="mt-4 flex flex-col gap-3">
            {filtered.map((rec) => {
              const f = getFeature(rec.feature);
              return (
                <li key={rec.id} className="card-mystic flex items-start gap-3 p-4">
                  <span className="mt-0.5 text-2xl" aria-hidden>
                    {f?.icon ?? "🔮"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate font-serif font-bold text-ink-100">{rec.title}</p>
                      <time className="shrink-0 text-xs text-ink-500" dateTime={new Date(rec.createdAt).toISOString()}>
                        {relativeTime(rec.createdAt)}
                      </time>
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-ink-300">{rec.summary}</p>
                    <div className="mt-2 flex items-center gap-4">
                      <Link
                        href={rec.path}
                        className="text-sm font-medium text-gold-300 underline-offset-4 hover:underline"
                      >
                        重看結果 →
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(rec)}
                        disabled={deletingId === rec.id}
                        aria-label={`刪除「${rec.title}」`}
                        className="text-sm text-ink-500 transition hover:text-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === rec.id ? "刪除中…" : "🗑 刪除"}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
