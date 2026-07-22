"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "登入失敗，請再試一次");
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="card-mystic w-full max-w-sm p-8">
        <h1 className="text-gradient-gold text-center text-2xl font-bold">
          星語後台管理
        </h1>
        <p className="mt-2 text-center text-sm text-slate-400">
          請輸入管理員帳號密碼
        </p>
        <label className="mt-6 block text-sm text-slate-300">
          帳號
          <input
            className="input-mystic mt-1 w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label className="mt-4 block text-sm text-slate-300">
          密碼
          <input
            type="password"
            className="input-mystic mt-1 w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
        <button type="submit" className="btn-gold mt-6 w-full" disabled={loading}>
          {loading ? "登入中…" : "登入"}
        </button>
      </form>
    </div>
  );
}
