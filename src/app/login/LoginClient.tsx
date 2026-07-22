"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mergeLocalToAccount } from "@/lib/storage";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    const errs: { email?: string; password?: string } = {};
    if (!EMAIL_RE.test(email.trim())) errs.email = "請輸入正確的 Email 格式";
    if (!password) errs.password = "請輸入密碼";
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.user) {
        setServerError(data.error || "登入失敗，請稍後再試");
        setLoading(false);
        return;
      }
      await mergeLocalToAccount();
      router.push("/me");
      router.refresh();
    } catch {
      setServerError("網路連線異常，請稍後再試");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-10 sm:py-16">
      <div className="rise-stagger">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-mystic-400/40 bg-night-800/60 text-3xl shadow-[0_0_30px_rgba(139,122,232,0.35)]">
            <span aria-hidden>🔮</span>
          </div>
          <h1 className="mt-4 font-serif text-2xl font-bold text-gradient-gold">會員登入</h1>
          <p className="mt-2 text-sm text-ink-300">登入後可跨裝置同步您的測算紀錄與收藏</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="card-mystic mt-6 p-6 sm:p-8">
          <div>
            <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-ink-100">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              className="input-mystic"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={fieldErrors.email ? "true" : undefined}
              aria-describedby={fieldErrors.email ? "login-email-error" : undefined}
            />
            {fieldErrors.email && (
              <p id="login-email-error" className="mt-1.5 text-sm text-rose-400">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-ink-100">
              密碼
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              className="input-mystic"
              placeholder="請輸入密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={fieldErrors.password ? "true" : undefined}
              aria-describedby={fieldErrors.password ? "login-password-error" : undefined}
            />
            {fieldErrors.password && (
              <p id="login-password-error" className="mt-1.5 text-sm text-rose-400">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {serverError && (
            <p role="alert" className="mt-4 rounded-lg border border-rose-400/40 bg-rose-400/10 px-3 py-2 text-sm text-rose-400">
              {serverError}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-gold mt-6 w-full">
            {loading ? "登入中…" : "登入"}
          </button>

          <div className="divider-star my-6 text-xs">✦</div>

          <p className="text-center text-sm text-ink-300">
            還沒有帳號？{" "}
            <Link href="/register" className="font-medium text-gold-300 underline-offset-4 hover:underline">
              立即註冊
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
