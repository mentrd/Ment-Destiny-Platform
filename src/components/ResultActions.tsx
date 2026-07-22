"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toggleFavorite, isFavoritedLocal, addHistory } from "@/lib/storage";
import { track } from "@/lib/stats";
import { SITE } from "@/lib/site";

interface Props {
  feature: string; // feature slug
  featureName: string;
  title: string; // 結果標題（分享圖用）
  summary: string; // 一句話結果摘要（分享圖/歷史紀錄用）
  retryHref: string; // 重新測算連結
}

/** 結果頁共用動作列：重新測算、分享（圖/連結/FB/LINE/IG）、收藏；並自動寫入歷史紀錄 */
export default function ResultActions({ feature, featureName, title, summary, retryHref }: Props) {
  const [fav, setFav] = useState(false);
  const [toast, setToast] = useState("");
  const [path, setPath] = useState("");

  useEffect(() => {
    const p = window.location.pathname + window.location.search;
    setPath(p);
    setFav(isFavoritedLocal(p));
    addHistory({ feature, title, path: p, summary });
    track({ type: "reading_complete", feature });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}${path}` : "";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast("已複製分享連結 ✨");
      track({ type: "share", feature, channel: "link" });
    } catch {
      showToast("複製失敗，請手動複製網址");
    }
  }

  function shareFb() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank", "width=600,height=500");
    track({ type: "share", feature, channel: "fb" });
  }

  function shareLine() {
    window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`${title}｜${SITE.name}`)}`, "_blank", "width=600,height=500");
    track({ type: "share", feature, channel: "line" });
  }

  /** IG 無網頁分享 API：產生分享圖供下載後貼到限動 */
  async function shareImage(channel: "ig" | "image") {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext("2d")!;
    // 星空底
    const grad = ctx.createLinearGradient(0, 0, 0, 1350);
    grad.addColorStop(0, "#121a3a");
    grad.addColorStop(1, "#070b1a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1350);
    for (let i = 0; i < 120; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.7 + 0.1})`;
      ctx.beginPath();
      ctx.arc(Math.random() * 1080, Math.random() * 1350, Math.random() * 2 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    // 邊框
    ctx.strokeStyle = "rgba(212,175,55,0.8)";
    ctx.lineWidth = 4;
    ctx.strokeRect(48, 48, 984, 1254);
    // 文字
    ctx.textAlign = "center";
    ctx.fillStyle = "#e6c860";
    ctx.font = "bold 44px 'Noto Serif TC', serif";
    ctx.fillText(`🔮 ${SITE.name}`, 540, 170);
    ctx.fillStyle = "#f2dd9b";
    ctx.font = "bold 58px 'Noto Serif TC', serif";
    wrapText(ctx, title, 540, 320, 880, 76);
    ctx.fillStyle = "#c3c8e8";
    ctx.font = "40px 'Noto Sans TC', sans-serif";
    wrapText(ctx, summary, 540, 560, 860, 64);
    ctx.fillStyle = "#8f96c2";
    ctx.font = "30px 'Noto Sans TC', sans-serif";
    ctx.fillText("結果僅供娛樂與自我探索參考", 540, 1180);
    ctx.fillStyle = "#b3a6f5";
    ctx.fillText(shareUrl.replace(/^https?:\/\//, "").slice(0, 40), 540, 1240);

    const a = document.createElement("a");
    a.download = `${featureName}-結果分享圖.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
    showToast(channel === "ig" ? "分享圖已下載，貼到 IG 限動吧 ✨" : "分享圖已下載 ✨");
    track({ type: "share", feature, channel });
  }

  async function onFavorite() {
    const added = await toggleFavorite({ feature, title, path, summary });
    setFav(added);
    showToast(added ? "已加入收藏 ⭐" : "已取消收藏");
    if (added) track({ type: "favorite", feature });
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Link href={retryHref} className="btn-gold text-sm">🔄 重新測算</Link>
        <button onClick={onFavorite} className="btn-ghost text-sm" aria-pressed={fav}>
          {fav ? "⭐ 已收藏" : "☆ 收藏結果"}
        </button>
        <button onClick={copyLink} className="btn-ghost text-sm">🔗 複製連結</button>
        <button onClick={shareFb} className="btn-ghost text-sm" aria-label="分享到 Facebook">📘 FB</button>
        <button onClick={shareLine} className="btn-ghost text-sm" aria-label="分享到 LINE">💬 LINE</button>
        <button onClick={() => shareImage("ig")} className="btn-ghost text-sm" aria-label="產生 Instagram 分享圖">📸 IG 分享圖</button>
      </div>
      {toast && (
        <p className="animate-rise-in mt-3 text-center text-sm text-gold-300" role="status">{toast}</p>
      )}
    </div>
  );
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const chars = text.split("");
  let line = "";
  let cy = y;
  for (const ch of chars) {
    if (ctx.measureText(line + ch).width > maxWidth) {
      ctx.fillText(line, x, cy);
      line = ch;
      cy += lineHeight;
      if (cy > y + lineHeight * 4) {
        ctx.fillText(line + "…", x, cy);
        return;
      }
    } else {
      line += ch;
    }
  }
  ctx.fillText(line, x, cy);
}
