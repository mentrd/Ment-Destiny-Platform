"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ConfirmModal from "@/components/me/ConfirmModal";
import { clearLocalHistory } from "@/lib/storage";

interface MeUser {
  id: string;
  email: string;
  nickname: string;
  birthday: string | null;
}

export default function MeClient() {
  const router = useRouter();
  // undefined = 載入中；null = 未登入
  const [user, setUser] = useState<MeUser | null | undefined>(undefined);
  const [nickname, setNickname] = useState("");
  const [birthday, setBirthday] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!mounted) return;
        const u: MeUser | null = d?.user ?? null;
        setUser(u);
        if (u) {
          setNickname(u.nickname ?? "");
          setBirthday(u.birthday ?? "");
        }
      })
      .catch(() => {
        if (mounted) setUser(null);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2400);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveError("");
    const name = nickname.trim();
    if (name.length < 1 || name.length > 20) {
      setSaveError("請輸入 1-20 字的暱稱");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: name, birthday }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.user) {
        setSaveError(data.error || "儲存失敗，請稍後再試");
      } else {
        setUser(data.user);
        setNickname(data.user.nickname ?? "");
        setBirthday(data.user.birthday ?? "");
        showToast("個人資料已更新 ✨");
      }
    } catch {
      setSaveError("網路連線異常，請稍後再試");
    }
    setSaving(false);
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* 即使失敗也導回首頁 */
    }
    router.push("/");
    router.refresh();
  }

  function handleClearLocal() {
    if (!window.confirm("確定要清除此裝置上的本機測算紀錄嗎？此操作無法復原。")) return;
    clearLocalHistory();
    showToast("已清除本機紀錄");
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    try {
      const res = await fetch("/api/me", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setDeleting(false);
        setDeleteOpen(false);
        showToast(data.error || "刪除失敗，請稍後再試");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setDeleting(false);
      setDeleteOpen(false);
      showToast("網路連線異常，請稍後再試");
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 pb-12">
      <Breadcrumbs items={[{ name: "會員中心", path: "/me" }]} />
      <h1 className="font-serif text-2xl font-bold text-gradient-gold">會員中心</h1>

      {user === undefined && (
        <div className="card-mystic mt-6 p-8 text-center text-sm text-ink-500" role="status">
          載入中…
        </div>
      )}

      {user === null && (
        <div className="card-mystic mt-6 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-mystic-400/40 bg-night-800/60 text-3xl shadow-[0_0_30px_rgba(139,122,232,0.35)]">
            <span aria-hidden>🔒</span>
          </div>
          <h2 className="mt-4 font-serif text-xl font-bold text-ink-100">請先登入</h2>
          <p className="mt-2 text-sm text-ink-300">登入後即可管理個人資料，並跨裝置同步您的測算紀錄與收藏</p>
          <Link href="/login" className="btn-gold mt-6">
            前往登入
          </Link>
          <p className="mt-4 text-sm text-ink-300">
            還沒有帳號？{" "}
            <Link href="/register" className="font-medium text-gold-300 underline-offset-4 hover:underline">
              立即註冊
            </Link>
          </p>
        </div>
      )}

      {user && (
        <div className="rise-stagger">
          {/* 個人資料卡 */}
          <form onSubmit={handleSave} noValidate className="card-mystic mt-6 p-6">
            <h2 className="font-serif text-lg font-bold text-ink-100">👤 個人資料</h2>

            <div className="mt-4">
              <label htmlFor="me-nickname" className="mb-1.5 block text-sm font-medium text-ink-100">
                暱稱
              </label>
              <input
                id="me-nickname"
                type="text"
                maxLength={20}
                autoComplete="nickname"
                className="input-mystic"
                placeholder="1-20 字"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>

            <div className="mt-4">
              <label htmlFor="me-email" className="mb-1.5 block text-sm font-medium text-ink-100">
                Email（無法修改）
              </label>
              <input
                id="me-email"
                type="email"
                className="input-mystic cursor-not-allowed opacity-60"
                value={user.email}
                readOnly
              />
            </div>

            <div className="mt-4">
              <label htmlFor="me-birthday" className="mb-1.5 block text-sm font-medium text-ink-100">
                預設生日
              </label>
              <input
                id="me-birthday"
                type="date"
                className="input-mystic"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
              <p className="mt-1.5 text-xs text-ink-500">設定後，各項測算將自動帶入您的生日</p>
            </div>

            {saveError && (
              <p role="alert" className="mt-4 rounded-lg border border-rose-400/40 bg-rose-400/10 px-3 py-2 text-sm text-rose-400">
                {saveError}
              </p>
            )}

            <button type="submit" disabled={saving} className="btn-gold mt-6 w-full sm:w-auto">
              {saving ? "儲存中…" : "儲存變更"}
            </button>
          </form>

          {/* 快速入口 */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Link href="/me/history" className="card-mystic card-mystic-hover flex flex-col items-center gap-2 p-6 text-center">
              <span className="text-3xl" aria-hidden>
                🕘
              </span>
              <span className="font-serif font-bold text-ink-100">歷史紀錄</span>
              <span className="text-xs text-ink-500">回顧每一次測算</span>
            </Link>
            <Link href="/me/favorites" className="card-mystic card-mystic-hover flex flex-col items-center gap-2 p-6 text-center">
              <span className="text-3xl" aria-hidden>
                ⭐
              </span>
              <span className="font-serif font-bold text-ink-100">我的收藏</span>
              <span className="text-xs text-ink-500">收藏的結果隨時回味</span>
            </Link>
          </div>

          {/* 登出 */}
          <div className="mt-6 text-center">
            <button type="button" onClick={handleLogout} disabled={loggingOut} className="btn-ghost w-full sm:w-auto">
              {loggingOut ? "登出中…" : "登出"}
            </button>
          </div>

          <div className="divider-star my-8 text-xs">✦</div>

          {/* 危險區域 */}
          <section className="card-mystic border-rose-400/30 p-6" aria-label="危險區域">
            <h2 className="font-serif text-lg font-bold text-rose-400">⚠️ 危險區域</h2>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-ink-100">清除本機紀錄</p>
                <p className="mt-0.5 text-xs text-ink-500">刪除此裝置瀏覽器中的測算歷史（不影響帳號雲端紀錄）</p>
              </div>
              <button type="button" onClick={handleClearLocal} className="btn-ghost shrink-0 text-sm">
                清除本機紀錄
              </button>
            </div>

            <div className="mt-5 border-t border-mystic-400/15 pt-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-ink-100">刪除帳號</p>
                  <p className="mt-0.5 text-xs text-ink-500">永久刪除帳號與所有個資、歷史紀錄與收藏</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteOpen(true)}
                  className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full border border-rose-400/60 px-6 py-2.5 text-sm font-medium text-rose-400 transition hover:bg-rose-400/10"
                >
                  刪除帳號
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      <ConfirmModal
        open={deleteOpen}
        title="確定要刪除帳號嗎？"
        confirmLabel="永久刪除"
        loading={deleting}
        onConfirm={handleDeleteAccount}
        onCancel={() => setDeleteOpen(false)}
      >
        此操作將<strong className="text-rose-400">永久刪除</strong>您的帳號，以及所有個人資料、歷史紀錄與收藏，且
        <strong className="text-rose-400">無法復原</strong>。確定要繼續嗎？
      </ConfirmModal>

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4">
          <p
            role="status"
            className="animate-rise-in rounded-full border border-gold-300/40 bg-night-800/95 px-5 py-2 text-sm text-gold-300 shadow-lg"
          >
            {toast}
          </p>
        </div>
      )}
    </div>
  );
}
