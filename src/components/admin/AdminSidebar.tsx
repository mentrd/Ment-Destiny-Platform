"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/admin", label: "儀表板", icon: "📊" },
  { href: "/admin/features", label: "功能管理", icon: "🧩" },
  { href: "/admin/tarot", label: "塔羅牌義", icon: "🃏" },
  { href: "/admin/lots", label: "籤詩管理", icon: "🎋" },
  { href: "/admin/horoscope", label: "運勢文案", icon: "🌠" },
  { href: "/admin/articles", label: "文章管理", icon: "📝" },
  { href: "/admin/seo", label: "SEO 設定", icon: "🔍" },
  { href: "/admin/homepage", label: "首頁設定", icon: "🏠" },
  { href: "/admin/members", label: "會員管理", icon: "👥" },
  { href: "/admin/stats", label: "統計報表", icon: "📈" },
  { href: "/admin/contacts", label: "聯絡訊息", icon: "✉️" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const nav = (
    <nav className="flex flex-col gap-1 p-3">
      {NAV.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-white/10 font-semibold text-amber-200"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span aria-hidden>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
      <div className="my-2 border-t border-white/10" />
      <Link
        href="/"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
        onClick={() => setOpen(false)}
      >
        <span aria-hidden>🌙</span>
        回前台
      </Link>
      <button
        type="button"
        onClick={logout}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
      >
        <span aria-hidden>🚪</span>
        登出
      </button>
    </nav>
  );

  return (
    <>
      {/* 手機頂欄 */}
      <header className="sticky top-0 z-40 flex items-center justify-between bg-night-900 px-4 py-3 shadow md:hidden">
        <span className="text-gradient-gold text-lg font-bold">星語後台</span>
        <button
          type="button"
          aria-label="開啟選單"
          className="rounded-lg border border-white/15 px-3 py-1.5 text-slate-200"
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>
      </header>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 overflow-y-auto bg-night-900 transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-5 py-5">
          <Link
            href="/admin"
            className="text-gradient-gold text-xl font-bold"
            onClick={() => setOpen(false)}
          >
            星語後台
          </Link>
          <p className="mt-1 text-xs text-slate-500">管理主控台</p>
        </div>
        {nav}
      </aside>
    </>
  );
}
