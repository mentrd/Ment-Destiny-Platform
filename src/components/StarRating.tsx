export default function StarRating({ value, label }: { value: number; label?: string }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`${label ?? ""} ${value} 顆星（滿分 5）`}>
      {label && <span className="mr-1 text-sm text-ink-300">{label}</span>}
      <span aria-hidden className="tracking-wider text-gold-400">
        {"★".repeat(value)}
        <span className="text-ink-500/40">{"★".repeat(5 - value)}</span>
      </span>
    </span>
  );
}
