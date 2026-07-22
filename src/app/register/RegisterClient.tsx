"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mergeLocalToAccount } from "@/lib/storage";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FieldErrors {
  email?: string;
  password?: string;
  confirm?: string;
  nickname?: string;
  agree?: string;
}

export default function RegisterClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [agree, setAgree] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    const errs: FieldErrors = {};
    if (!EMAIL_RE.test(email.trim())) errs.email = "請輸入正確的 Email 格式";
    if (password.length < 8) errs.password = "密碼至少需要 8 個字元";
    if (confirm !== password) errs.confirm = "兩次輸入的密碼不一致";
    const nick = nickname.trim();
    if (nick.length < 1 || nick.length > 20) errs.nickname = "請輸入 1-20 字的暱稱";
    if (!agree) errs.agree = "請先閱讀並同意使用條款與隱私權政策";
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, nickname: nick, agree: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.user) {
        setServerError(data.error || "註冊失敗，請稍後再試");
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
          <h1 className="mt-4 font-serif text-2xl font-bold text-gradient-gold">註冊會員</h1>
          <p className="mt-2 text-sm text-ink-300">免費加入，保存每一次與星空的對話</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="card-mystic mt-6 p-6 sm:p-8">
          <div>
            <label htmlFor="reg-email" className="mb-1.5 block text-sm font-medium text-ink-100">
              Email
            </label>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              className="input-mystic"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={fieldErrors.email ? "true" : undefined}
              aria-describedby={fieldErrors.email ? "reg-email-error" : undefined}
            />
            {fieldErrors.email && (
              <p id="reg-email-error" className="mt-1.5 text-sm text-rose-400">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label htmlFor="reg-password" className="mb-1.5 block text-sm font-medium text-ink-100">
              密碼
            </label>
            <input
              id="reg-password"
              type="password"
              autoComplete="new-password"
              className="input-mystic"
              placeholder="至少 8 個字元"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={fieldErrors.password ? "true" : undefined}
              aria-describedby={fieldErrors.password ? "reg-password-error" : undefined}
            />
            {fieldErrors.password && (
              <p id="reg-password-error" className="mt-1.5 text-sm text-rose-400">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label htmlFor="reg-confirm" className="mb-1.5 block text-sm font-medium text-ink-100">
              確認密碼
            </label>
            <input
              id="reg-confirm"
              type="password"
              autoComplete="new-password"
              className="input-mystic"
              placeholder="再次輸入密碼"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              aria-invalid={fieldErrors.confirm ? "true" : undefined}
              aria-describedby={fieldErrors.confirm ? "reg-confirm-error" : undefined}
            />
            {fieldErrors.confirm && (
              <p id="reg-confirm-error" className="mt-1.5 text-sm text-rose-400">
                {fieldErrors.confirm}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label htmlFor="reg-nickname" className="mb-1.5 block text-sm font-medium text-ink-100">
              暱稱
            </label>
            <input
              id="reg-nickname"
              type="text"
              autoComplete="nickname"
              maxLength={20}
              className="input-mystic"
              placeholder="想被怎麼稱呼？（1-20 字）"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              aria-invalid={fieldErrors.nickname ? "true" : undefined}
              aria-describedby={fieldErrors.nickname ? "reg-nickname-error" : undefined}
            />
            {fieldErrors.nickname && (
              <p id="reg-nickname-error" className="mt-1.5 text-sm text-rose-400">
                {fieldErrors.nickname}
              </p>
            )}
          </div>

          <div className="mt-5">
            <label className="flex cursor-pointer items-start gap-2.5 text-sm text-ink-300">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                aria-invalid={fieldErrors.agree ? "true" : undefined}
                aria-describedby={fieldErrors.agree ? "reg-agree-error" : undefined}
                className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--gold-400)]"
              />
              <span>
                我已閱讀並同意{" "}
                <a href="/terms" target="_blank" rel="noopener" className="text-gold-300 underline-offset-4 hover:underline">
                  使用條款
                </a>{" "}
                與{" "}
                <a href="/privacy" target="_blank" rel="noopener" className="text-gold-300 underline-offset-4 hover:underline">
                  隱私權政策
                </a>
              </span>
            </label>
            {fieldErrors.agree && (
              <p id="reg-agree-error" className="mt-1.5 text-sm text-rose-400">
                {fieldErrors.agree}
              </p>
            )}
          </div>

          {serverError && (
            <p role="alert" className="mt-4 rounded-lg border border-rose-400/40 bg-rose-400/10 px-3 py-2 text-sm text-rose-400">
              {serverError}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-gold mt-6 w-full">
            {loading ? "註冊中…" : "免費註冊"}
          </button>

          <div className="divider-star my-6 text-xs">✦</div>

          <p className="text-center text-sm text-ink-300">
            已經有帳號了？{" "}
            <Link href="/login" className="font-medium text-gold-300 underline-offset-4 hover:underline">
              直接登入
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
