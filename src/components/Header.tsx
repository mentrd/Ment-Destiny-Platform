"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FEATURES, CATEGORY_LABELS, byCategory, type FeatureCategory } from "@/lib/features";

const NAV_CATS: FeatureCategory[] = ["divination", "chart", "fortune", "match"];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ nickname: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user ?? null))
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-mystic-500/20 bg-night-900/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="text-2xl" aria-hidden>🔮</span>
          <span className="text-gradient-gold font-serif tracking-wide">星語命理</span>
        </Link>

        {/* 桌機導覽 */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="主選單">
          {NAV_CATS.map((cat) => (
            <div key={cat} className="group relative">
              <button className="rounded-lg px-3 py-2 text-sm text-ink-300 transition hover:bg-mystic-500/10 hover:text-ink-100">
                {CATEGORY_LABELS[cat]} ▾
              </button>
              <div className="invisible absolute left-0 top-full min-w-44 rounded-xl border border-mystic-500/25 bg-night-900/95 p-2 opacity-0 shadow-xl backdrop-blur transition-all group-hover:visible group-hover:opacity-100">
                {byCategory(cat).map((f) => (
                  <Link
                    key={f.slug}
                    href={`/${f.slug}`}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-300 hover:bg-mystic-500/15 hover:text-gold-300"
                  >
                    <span aria-hidden>{f.icon}</span> {f.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <Link href="/articles" className="rounded-lg px-3 py-2 text-sm text-ink-300 hover:bg-mystic-500/10 hover:text-ink-100">
            命理文章
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <Link href="/me" className="btn-ghost !min-h-9 !px-4 !py-1.5 text-sm">
              {user.nickname} 的專屬頁
            </Link>
          ) : (
            <Link href="/login" className="btn-ghost !min-h-9 !px-4 !py-1.5 text-sm hidden sm:inline-flex">
              登入
            </Link>
          )}
          <button
            className="rounded-lg p-2 text-2xl leading-none lg:hidden"
            aria-label="開啟選單"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* 手機抽屜選單 */}
      {open && (
        <nav className="border-t border-mystic-500/20 bg-night-900/95 px-4 py-4 lg:hidden" aria-label="行動選單">
          {NAV_CATS.map((cat) => (
            <div key={cat} className="mb-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gold-400">
                {CATEGORY_LABELS[cat]}
              </p>
              <div className="grid grid-cols-2 gap-1">
                {byCategory(cat).map((f) => (
                  <Link
                    key={f.slug}
                    href={`/${f.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-ink-300 hover:bg-mystic-500/15"
                  >
                    <span aria-hidden>{f.icon}</span> {f.shortName}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="mt-4 flex gap-2 border-t border-mystic-500/20 pt-4">
            <Link href="/articles" onClick={() => setOpen(false)} className="btn-ghost flex-1 text-sm">
              命理文章
            </Link>
            {!user && (
              <Link href="/login" onClick={() => setOpen(false)} className="btn-gold flex-1 text-sm">
                登入 / 註冊
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
