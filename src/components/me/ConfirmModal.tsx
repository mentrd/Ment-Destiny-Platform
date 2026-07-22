"use client";

/** 二次確認 Modal（危險操作用） */
export default function ConfirmModal({
  open,
  title,
  confirmLabel,
  loading = false,
  onConfirm,
  onCancel,
  children,
}: {
  open: boolean;
  title: string;
  confirmLabel: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-night-900/80 backdrop-blur-sm"
        onClick={loading ? undefined : onCancel}
        aria-hidden
      />
      <div className="card-mystic relative w-full max-w-sm p-6">
        <h2 className="font-serif text-lg font-bold text-ink-100">{title}</h2>
        <div className="mt-3 text-sm leading-relaxed text-ink-300">{children}</div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={onCancel} disabled={loading} className="btn-ghost flex-1">
            取消
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full bg-rose-400 px-6 py-2.5 font-bold text-night-900 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "處理中…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
