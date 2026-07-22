"use client";

import { useEffect, useState } from "react";
import type { Article } from "@/lib/articles";

const EMPTY: Article = {
  slug: "",
  title: "",
  category: "",
  excerpt: "",
  content: "",
  seoTitle: "",
  seoDescription: "",
  published: false,
  createdAt: 0,
  updatedAt: 0,
};

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [draft, setDraft] = useState<Article | null>(null);
  const [originalSlug, setOriginalSlug] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/content/articles")
      .then((r) => r.json())
      .then(({ data }) => setArticles(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  async function putAll(next: Article[], okMsg: string): Promise<boolean> {
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/admin/content/articles", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    setSaving(false);
    if (res.ok) {
      setArticles(next);
      setMsg(okMsg);
      return true;
    }
    setMsg("儲存失敗");
    return false;
  }

  async function saveDraft() {
    if (!draft) return;
    const slug = draft.slug.trim();
    if (!slug || !draft.title.trim()) {
      setMsg("slug 與標題為必填");
      return;
    }
    if (
      articles.some((a) => a.slug === slug && a.slug !== originalSlug)
    ) {
      setMsg("slug 已存在，請換一個");
      return;
    }
    const now = Date.now();
    const item: Article = {
      ...draft,
      slug,
      createdAt: draft.createdAt || now,
      updatedAt: now,
    };
    const next =
      originalSlug === null
        ? [item, ...articles]
        : articles.map((a) => (a.slug === originalSlug ? item : a));
    if (await putAll(next, "已儲存")) {
      setDraft(null);
      setOriginalSlug(null);
    }
  }

  async function remove(slug: string) {
    if (!confirm(`確定要刪除文章「${slug}」嗎？此動作無法復原。`)) return;
    await putAll(articles.filter((a) => a.slug !== slug), "已刪除");
    if (originalSlug === slug) {
      setDraft(null);
      setOriginalSlug(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-gradient-gold text-2xl font-bold">文章管理</h1>
          <p className="mt-1 text-sm text-slate-400">命理專欄文章的新增與編輯</p>
        </div>
        <div className="flex items-center gap-3">
          {msg && <span className="text-sm text-emerald-400">{msg}</span>}
          <button
            className="btn-gold"
            onClick={() => {
              setDraft({ ...EMPTY });
              setOriginalSlug(null);
              setMsg("");
            }}
          >
            ＋ 新增文章
          </button>
        </div>
      </div>

      {draft && (
        <div className="card-mystic mt-6 p-6">
          <h2 className="font-semibold text-slate-200">
            {originalSlug === null ? "新增文章" : `編輯：${originalSlug}`}
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block text-sm text-slate-300">
              slug（網址代稱）
              <input
                className="input-mystic mt-1 w-full"
                value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                placeholder="例：tarot-beginner-guide"
              />
            </label>
            <label className="block text-sm text-slate-300">
              分類
              <input
                className="input-mystic mt-1 w-full"
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                placeholder="例：塔羅、八字、占星"
              />
            </label>
            <label className="block text-sm text-slate-300 md:col-span-2">
              標題
              <input
                className="input-mystic mt-1 w-full"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </label>
            <label className="block text-sm text-slate-300 md:col-span-2">
              摘要
              <textarea
                className="input-mystic mt-1 w-full"
                rows={2}
                value={draft.excerpt}
                onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
              />
            </label>
            <label className="block text-sm text-slate-300 md:col-span-2">
              內文（Markdown）
              <textarea
                className="input-mystic mt-1 w-full font-mono text-xs"
                rows={14}
                value={draft.content}
                onChange={(e) => setDraft({ ...draft, content: e.target.value })}
              />
            </label>
            <label className="block text-sm text-slate-300">
              SEO 標題（選填）
              <input
                className="input-mystic mt-1 w-full"
                value={draft.seoTitle ?? ""}
                onChange={(e) => setDraft({ ...draft, seoTitle: e.target.value })}
              />
            </label>
            <label className="block text-sm text-slate-300">
              SEO 描述（選填）
              <input
                className="input-mystic mt-1 w-full"
                value={draft.seoDescription ?? ""}
                onChange={(e) =>
                  setDraft({ ...draft, seoDescription: e.target.value })
                }
              />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <button
              type="button"
              role="switch"
              aria-checked={draft.published}
              onClick={() => setDraft({ ...draft, published: !draft.published })}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                draft.published ? "bg-amber-400/80" : "bg-white/10"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                  draft.published ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
            <span className="text-sm text-slate-300">
              {draft.published ? "已發布" : "草稿"}
            </span>
            <div className="ml-auto flex gap-3">
              <button className="btn-gold" onClick={saveDraft} disabled={saving}>
                {saving ? "儲存中…" : "儲存文章"}
              </button>
              <button
                className="btn-ghost"
                onClick={() => {
                  setDraft(null);
                  setOriginalSlug(null);
                }}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="mt-8 text-slate-400">載入中…</p>
      ) : (
        <div className="card-mystic mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-400">
                <th className="px-4 py-3">標題</th>
                <th className="px-4 py-3">分類</th>
                <th className="px-4 py-3">狀態</th>
                <th className="px-4 py-3">更新時間</th>
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.slug} className="border-b border-white/5">
                  <td className="max-w-xs px-4 py-3">
                    <p className="truncate text-slate-200">{a.title}</p>
                    <p className="truncate text-xs text-slate-500">/{a.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{a.category}</td>
                  <td className="px-4 py-3">
                    {a.published ? (
                      <span className="text-emerald-400">已發布</span>
                    ) : (
                      <span className="text-slate-500">草稿</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {a.updatedAt
                      ? new Date(a.updatedAt).toLocaleDateString("zh-TW")
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      className="btn-ghost px-3 py-1 text-sm"
                      onClick={() => {
                        setDraft({ ...a });
                        setOriginalSlug(a.slug);
                        setMsg("");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      編輯
                    </button>
                    <button
                      className="btn-ghost ml-2 px-3 py-1 text-sm text-rose-400"
                      onClick={() => remove(a.slug)}
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              ))}
              {articles.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    尚無文章
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
