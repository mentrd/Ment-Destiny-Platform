import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/site";

export default function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  const all = [{ name: "首頁", path: "/" }, ...items];
  return (
    <nav aria-label="麵包屑" className="mb-4 text-sm text-ink-500">
      <JsonLd data={breadcrumbJsonLd(all)} />
      {all.map((it, i) => (
        <span key={it.path}>
          {i > 0 && <span className="mx-1.5 text-ink-500/50">/</span>}
          {i === all.length - 1 ? (
            <span className="text-ink-300">{it.name}</span>
          ) : (
            <Link href={it.path} className="hover:text-gold-300">{it.name}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}
