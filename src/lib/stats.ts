"use client";

/** 前台統計事件（供後台使用次數 / 熱門排行 / 分享數據） */

export type StatEvent =
  | { type: "reading_start"; feature: string }
  | { type: "reading_complete"; feature: string }
  | { type: "share"; feature: string; channel: "fb" | "line" | "ig" | "link" | "image" }
  | { type: "favorite"; feature: string }
  | { type: "register" };

export function track(event: StatEvent) {
  try {
    const body = JSON.stringify(event);
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/stats", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/stats", { method: "POST", headers: { "Content-Type": "application/json" }, body }).catch(() => {});
    }
  } catch {
    /* 統計失敗不影響使用 */
  }
}
