import Link from "next/link";
import { SITE } from "@/lib/site";

export default function Disclaimer() {
  return (
    <p className="mt-6 rounded-xl border border-mystic-500/15 bg-night-900/50 px-4 py-3 text-center text-xs leading-relaxed text-ink-500">
      {SITE.disclaimer}
      <Link href="/disclaimer" className="ml-1 underline hover:text-ink-300">完整免責聲明</Link>
    </p>
  );
}
