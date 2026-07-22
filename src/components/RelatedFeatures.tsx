import Link from "next/link";
import { getRelated } from "@/lib/features";

export default function RelatedFeatures({ slug }: { slug: string }) {
  const related = getRelated(slug);
  if (related.length === 0) return null;
  return (
    <section className="mt-12">
      <p className="divider-star mb-4 text-sm font-semibold">✦ 你可能也想試試 ✦</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {related.map((f) => (
          <Link
            key={f.slug}
            href={`/${f.slug}`}
            className="card-mystic card-mystic-hover flex items-center gap-3 p-4"
          >
            <span className="text-2xl" aria-hidden>{f.icon}</span>
            <span>
              <span className="block text-sm font-bold text-ink-100">{f.name}</span>
              <span className="block text-xs text-ink-500">{f.tagline}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
