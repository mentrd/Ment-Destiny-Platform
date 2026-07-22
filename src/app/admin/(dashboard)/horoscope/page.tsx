"use client";

import { useEffect, useState } from "react";
import type {
  FortuneLevel,
  HoroscopeCopy,
} from "@/lib/engines/horoscope-copy";

const POOL_KEYS: { key: "overall" | "love" | "career" | "money" | "health"; label: string }[] = [
  { key: "overall", label: "整體運勢" },
  { key: "love", label: "愛情運勢" },
  { key: "career", label: "事業運勢" },
  { key: "money", label: "財運" },
  { key: "health", label: "健康運勢" },
];

const LEVELS: FortuneLevel[] = [5, 4, 3, 2, 1];
const LEVEL_LABEL: Record<FortuneLevel, string> = {
  5: "5 星（極佳）",
  4: "4 星（良好）",
  3: "3 星（平穩）",
  2: "2 星（低迷）",
  1: "1 星（不佳）",
};

const toLines = (arr: string[]) => arr.join("\n");
const fromLines = (s: string) =>
  s.split("\n").map((l) => l.trim()).filter(Boolean);

export default function AdminHoroscopePage() {
  const [copy, setCopy] = useState<HoroscopeCopy | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/content/horoscope-copy")
      .then((r) => r.json())
      .then(({ data }) => setCopy(data))
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    if (!copy) return;
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/admin/content/horoscope-copy", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(copy),
    });
    setSaving(false);
    setMsg(res.ok ? "已儲存" : "儲存失敗");
  }

  if (loading) {
    return <p className="text-slate-400">載入中…</p>;
  }
  if (!copy) {
    return <p className="text-slate-500">讀取文案失敗</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-gradient-gold text-2xl font-bold">運勢文案</h1>
          <p className="mt-1 text-sm text-slate-400">
            每行一條文案，系統會依日期與星座隨機取用
          </p>
        </div>
        <div className="flex items-center gap-3">
          {msg && <span className="text-sm text-emerald-400">{msg}</span>}
          <button className="btn-gold" onClick={save} disabled={saving}>
            {saving ? "儲存中…" : "儲存全部"}
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {POOL_KEYS.map(({ key, label }) => (
          <section key={key} className="card-mystic p-6">
            <h2 className="font-semibold text-slate-200">{label}</h2>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {LEVELS.map((lv) => (
                <label key={lv} className="block text-sm text-slate-300">
                  {LEVEL_LABEL[lv]}
                  <textarea
                    className="input-mystic mt-1 w-full"
                    rows={5}
                    value={toLines(copy[key]?.[lv] ?? [])}
                    onChange={(e) =>
                      setCopy({
                        ...copy,
                        [key]: { ...copy[key], [lv]: fromLines(e.target.value) },
                      })
                    }
                  />
                </label>
              ))}
            </div>
          </section>
        ))}

        <section className="card-mystic p-6">
          <h2 className="font-semibold text-slate-200">宜忌小提示</h2>
          <textarea
            className="input-mystic mt-4 w-full"
            rows={6}
            value={toLines(copy.tips ?? [])}
            onChange={(e) => setCopy({ ...copy, tips: fromLines(e.target.value) })}
          />
        </section>

        <section className="card-mystic p-6">
          <h2 className="font-semibold text-slate-200">幸運色</h2>
          <p className="mt-1 text-xs text-slate-500">
            格式：色名|色碼，每行一組，例：星夜藍|#2c3e70
          </p>
          <textarea
            className="input-mystic mt-3 w-full font-mono"
            rows={6}
            value={(copy.colors ?? [])
              .map((c) => `${c.name}|${c.hex}`)
              .join("\n")}
            onChange={(e) =>
              setCopy({
                ...copy,
                colors: fromLines(e.target.value).map((line) => {
                  const [name, hex] = line.split("|");
                  return { name: (name ?? "").trim(), hex: (hex ?? "").trim() };
                }),
              })
            }
          />
        </section>

        <section className="card-mystic p-6">
          <h2 className="font-semibold text-slate-200">幸運方位</h2>
          <textarea
            className="input-mystic mt-4 w-full"
            rows={4}
            value={toLines(copy.directions ?? [])}
            onChange={(e) =>
              setCopy({ ...copy, directions: fromLines(e.target.value) })
            }
          />
        </section>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="btn-gold" onClick={save} disabled={saving}>
          {saving ? "儲存中…" : "儲存全部"}
        </button>
      </div>
    </div>
  );
}
