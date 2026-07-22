import { promises as fs } from "fs";
import path from "path";

/**
 * JSON 檔案資料庫（伺服器端專用）
 * data/db/*.json — 會員、紀錄、統計
 * data/content/*.json — 後台可編輯的內容（塔羅、籤詩、運勢文案、文章、SEO、首頁設定）
 */

const DB_DIR = path.join(process.cwd(), "data", "db");
const CONTENT_DIR = path.join(process.cwd(), "data", "content");

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

export async function readDb<T>(name: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DB_DIR, `${name}.json`), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeDb<T>(name: string, data: T): Promise<void> {
  await ensureDir(DB_DIR);
  const file = path.join(DB_DIR, `${name}.json`);
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf-8");
  await fs.rename(tmp, file);
}

/** 內容檔：優先讀 data/content 的後台覆寫版，否則回退到程式內建預設 */
export async function readContent<T>(name: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(CONTENT_DIR, `${name}.json`), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeContent<T>(name: string, data: T): Promise<void> {
  await ensureDir(CONTENT_DIR);
  const file = path.join(CONTENT_DIR, `${name}.json`);
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf-8");
  await fs.rename(tmp, file);
}

/* ── 資料模型 ── */

export interface UserRow {
  id: string;
  email: string;
  nickname: string;
  passwordHash: string; // scrypt: salt:hash
  birthday?: string;
  createdAt: number;
  suspended?: boolean;
}

export interface RecordRow {
  id: string;
  userId: string;
  feature: string;
  title: string;
  path: string;
  summary: string;
  createdAt: number;
}

export interface StatRow {
  date: string; // YYYY-MM-DD
  type: string;
  feature?: string;
  channel?: string;
  count: number;
}

export async function bumpStat(type: string, feature?: string, channel?: string) {
  const stats = await readDb<StatRow[]>("stats", []);
  const date = new Date().toISOString().slice(0, 10);
  const row = stats.find(
    (s) => s.date === date && s.type === type && s.feature === feature && s.channel === channel
  );
  if (row) row.count += 1;
  else stats.push({ date, type, feature, channel, count: 1 });
  await writeDb("stats", stats);
}
