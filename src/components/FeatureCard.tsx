import Link from "next/link";
import type { FeatureDef } from "@/lib/features";

export default function FeatureCard({ feature }: { feature: FeatureDef }) {
  return (
    <Link
      href={`/${feature.slug}`}
      className="card-mystic card-mystic-hover group flex flex-col gap-2 p-5"
    >
      <span
        className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
        style={{ background: `${feature.color}22`, border: `1px solid ${feature.color}55` }}
        aria-hidden
      >
        {feature.icon}
      </span>
      <h3 className="mt-1 font-serif text-lg font-bold text-ink-100 group-hover:text-gold-300">
        {feature.name}
      </h3>
      <p className="text-sm leading-relaxed text-ink-500">{feature.tagline}</p>
      <span className="mt-auto pt-2 text-sm font-medium text-mystic-300 group-hover:text-gold-400">
        開始測算 →
      </span>
    </Link>
  );
}
