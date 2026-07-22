"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "首頁", icon: "🏠" },
  { href: "/horoscope", label: "運勢", icon: "🌠" },
  { href: "/categories", label: "全部功能", icon: "🔮" },
  { href: "/me/history", label: "紀錄", icon: "🕘" },
  { href: "/me", label: "我的", icon: "👤" },
];

export default function MobileTabBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-mystic-500/25 bg-night-900/95 backdrop-blur-md lg:hidden"
      aria-label="快捷列"
    >
      {TABS.map((t) => {
        const active = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] ${
              active ? "text-gold-400" : "text-ink-500"
            }`}
          >
            <span className="text-lg leading-none" aria-hidden>{t.icon}</span>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
