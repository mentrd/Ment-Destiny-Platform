"use client";

/**
 * 歷史紀錄與收藏：
 * - 未登入 → localStorage（上限 50 筆）
 * - 已登入 → 同步伺服器 API（/api/history、/api/favorites）
 */

export interface ReadingRecord {
  id: string;
  feature: string; // feature slug
  title: string; // 顯示標題，如「愛情塔羅」「八字命盤 - 1990/5/1」
  path: string; // 可重現的結果頁連結（含 ?d= 參數）
  summary: string; // 一句話摘要
  createdAt: number;
}

const HISTORY_KEY = "sw_history";
const FAV_KEY = "sw_favorites";
const LIMIT = 50;

function load(key: string): ReadingRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function save(key: string, records: ReadingRecord[]) {
  try {
    localStorage.setItem(key, JSON.stringify(records.slice(0, LIMIT)));
  } catch {
    /* 容量滿時靜默失敗 */
  }
}

function makeRecord(r: Omit<ReadingRecord, "id" | "createdAt">): ReadingRecord {
  return { ...r, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: Date.now() };
}

async function isLoggedIn(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    return Boolean(data.user);
  } catch {
    return false;
  }
}

export async function addHistory(r: Omit<ReadingRecord, "id" | "createdAt">) {
  const rec = makeRecord(r);
  // 同一結果（相同 path）不重複記錄
  const local = load(HISTORY_KEY);
  if (!local.some((x) => x.path === rec.path)) {
    save(HISTORY_KEY, [rec, ...local]);
  }
  if (await isLoggedIn()) {
    fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rec),
    }).catch(() => {});
  }
}

export async function getHistory(): Promise<ReadingRecord[]> {
  if (await isLoggedIn()) {
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      if (Array.isArray(data.records)) return data.records;
    } catch {}
  }
  return load(HISTORY_KEY);
}

export function clearLocalHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

export async function toggleFavorite(r: Omit<ReadingRecord, "id" | "createdAt">): Promise<boolean> {
  const local = load(FAV_KEY);
  const existing = local.find((x) => x.path === r.path);
  let added: boolean;
  if (existing) {
    save(FAV_KEY, local.filter((x) => x.path !== r.path));
    added = false;
  } else {
    save(FAV_KEY, [makeRecord(r), ...local]);
    added = true;
  }
  if (await isLoggedIn()) {
    fetch("/api/favorites", {
      method: added ? "POST" : "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(added ? makeRecord(r) : { path: r.path }),
    }).catch(() => {});
  }
  return added;
}

export async function getFavorites(): Promise<ReadingRecord[]> {
  if (await isLoggedIn()) {
    try {
      const res = await fetch("/api/favorites");
      const data = await res.json();
      if (Array.isArray(data.records)) return data.records;
    } catch {}
  }
  return load(FAV_KEY);
}

export function isFavoritedLocal(path: string): boolean {
  return load(FAV_KEY).some((x) => x.path === path);
}

/** 登入後合併本機紀錄到帳號 */
export async function mergeLocalToAccount() {
  const history = load(HISTORY_KEY);
  const favorites = load(FAV_KEY);
  if (history.length === 0 && favorites.length === 0) return;
  await fetch("/api/history/merge", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ history, favorites }),
  }).catch(() => {});
}
