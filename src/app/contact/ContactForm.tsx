"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", topic: "功能建議", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "請輸入稱呼";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "請輸入正確的 Email";
    if (form.message.trim().length < 10) e.message = "請至少輸入 10 個字，讓我們更了解您的需求";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).catch(() => {});
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="card-mystic animate-rise-in mt-8 p-8 text-center">
        <p className="text-4xl" aria-hidden>💌</p>
        <p className="mt-3 font-serif text-xl font-bold text-gold-300">已收到您的訊息</p>
        <p className="mt-2 text-sm text-ink-300">我們會盡快處理，感謝您幫助星語變得更好。</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card-mystic mt-8 space-y-5 p-6" noValidate>
      <div>
        <label htmlFor="c-name" className="mb-1.5 block text-sm text-ink-300">稱呼 *</label>
        <input
          id="c-name"
          className="input-mystic"
          value={form.name}
          aria-invalid={!!errors.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="怎麼稱呼您？"
        />
        {errors.name && <p className="mt-1 text-xs text-rose-400">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="c-email" className="mb-1.5 block text-sm text-ink-300">Email *</label>
        <input
          id="c-email"
          type="email"
          className="input-mystic"
          value={form.email}
          aria-invalid={!!errors.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="回覆將寄送到這裡"
        />
        {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="c-topic" className="mb-1.5 block text-sm text-ink-300">主題</label>
        <select
          id="c-topic"
          className="input-mystic"
          value={form.topic}
          onChange={(e) => setForm({ ...form, topic: e.target.value })}
        >
          {["功能建議", "內容勘誤", "合作提案", "個資權利行使", "其他"].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="c-message" className="mb-1.5 block text-sm text-ink-300">訊息內容 *</label>
        <textarea
          id="c-message"
          rows={5}
          className="input-mystic resize-y"
          value={form.message}
          aria-invalid={!!errors.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="請描述您的建議或需求…"
        />
        {errors.message && <p className="mt-1 text-xs text-rose-400">{errors.message}</p>}
      </div>
      <button type="submit" className="btn-gold w-full" disabled={status === "sending"}>
        {status === "sending" ? "送出中…" : "送出訊息"}
      </button>
    </form>
  );
}
