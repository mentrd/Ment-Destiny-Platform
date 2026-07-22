import Link from "next/link";
import { FEATURES } from "@/lib/features";
import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="relative z-10 mt-20 border-t border-mystic-500/20 bg-night-900/70 pb-24 pt-10 lg:pb-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="mb-2 flex items-center gap-2 font-serif text-lg font-bold">
              <span aria-hidden>🔮</span>
              <span className="text-gradient-gold">星語命理</span>
            </p>
            <p className="text-sm leading-relaxed text-ink-500">
              整合塔羅、八字、紫微、占星、姓名學、靈數、易經與靈籤的一站式命理平台。
            </p>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-gold-400">熱門功能</p>
            <ul className="space-y-2 text-sm text-ink-300">
              {FEATURES.slice(0, 6).map((f) => (
                <li key={f.slug}>
                  <Link href={`/${f.slug}`} className="hover:text-gold-300">{f.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-gold-400">探索</p>
            <ul className="space-y-2 text-sm text-ink-300">
              <li><Link href="/categories" className="hover:text-gold-300">全部功能分類</Link></li>
              <li><Link href="/horoscope" className="hover:text-gold-300">每日運勢專區</Link></li>
              <li><Link href="/articles" className="hover:text-gold-300">命理知識文章</Link></li>
              <li><Link href="/me/history" className="hover:text-gold-300">我的測算紀錄</Link></li>
              <li><Link href="/me/favorites" className="hover:text-gold-300">我的收藏</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-gold-400">關於平台</p>
            <ul className="space-y-2 text-sm text-ink-300">
              <li><Link href="/privacy" className="hover:text-gold-300">隱私權政策</Link></li>
              <li><Link href="/terms" className="hover:text-gold-300">使用條款</Link></li>
              <li><Link href="/disclaimer" className="hover:text-gold-300">免責聲明</Link></li>
              <li><Link href="/contact" className="hover:text-gold-300">聯絡我們</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-mystic-500/15 pt-6 text-center text-xs leading-relaxed text-ink-500">
          <p>{SITE.disclaimer}</p>
          <p className="mt-2">© {new Date().getFullYear()} {SITE.name} {SITE.nameEn}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
