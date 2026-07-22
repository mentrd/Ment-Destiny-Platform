"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { encodeParams, decodeParams } from "@/lib/encode";
import { track } from "@/lib/stats";
import RitualLoading from "@/components/RitualLoading";
import PalmResult from "@/components/palm/PalmResult";
import {
  analyzePalm,
  type Gender,
  type Hand,
  type PalmMode,
} from "@/lib/engines/palm";

interface PalmParams {
  hash: number;
  hand: Hand;
  gender: Gender;
  mode: PalmMode;
}

const HASH_BYTES = 50 * 1024;

function isValid(p: PalmParams | null): p is PalmParams {
  return Boolean(
    p &&
      Number.isFinite(p.hash) &&
      (p.hand === "L" || p.hand === "R") &&
      (p.gender === "M" || p.gender === "F") &&
      (p.mode === "palm" || p.mode === "face")
  );
}

/** 僅取檔案前段位元組累加為種子，照片本身絕不離開瀏覽器 */
async function computePhotoHash(file: File): Promise<number> {
  const buf = await file.slice(0, HASH_BYTES).arrayBuffer();
  const bytes = new Uint8Array(buf);
  let h = 2166136261;
  for (let i = 0; i < bytes.length; i++) {
    h ^= bytes[i];
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export default function PalmStartClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const encoded = sp.get("d");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<PalmMode>("palm");
  const [hand, setHand] = useState<Hand>("R");
  const [gender, setGender] = useState<Gender>("F");
  const [agree, setAgree] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [hash, setHash] = useState<number | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const parsed = useMemo(() => {
    if (!encoded) return null;
    const p = decodeParams<PalmParams>(encoded);
    return isValid(p) ? p : null;
  }, [encoded]);

  // 分享連結／送出後：同頁渲染結果（照片預覽僅本次上傳才有）
  if (parsed) {
    const analysis = analyzePalm({
      photoHash: parsed.hash,
      hand: parsed.hand,
      gender: parsed.gender,
      mode: parsed.mode,
    });
    return (
      <PalmResult
        analysis={analysis}
        mode={parsed.mode}
        hand={parsed.hand}
        gender={parsed.gender}
        photoPreview={preview}
      />
    );
  }

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("請選擇圖片檔（JPG／PNG 等）");
      return;
    }
    setError("");
    setFileName(file.name);

    // 僅於本機讀取作預覽，絕不上傳
    const reader = new FileReader();
    reader.onload = () =>
      setPreview(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);

    try {
      setHash(await computePhotoHash(file));
    } catch {
      setError("讀取照片時發生問題，請換一張再試");
    }
  }

  function submit() {
    if (hash === null) {
      setError("請先選擇一張照片，照片只會在你的裝置上分析。");
      return;
    }
    if (!agree) {
      setError("請先勾選下方同意事項，我們才會開始分析。");
      return;
    }
    setError("");
    track({ type: "reading_start", feature: "palm" });
    setLoading(true);
  }

  function goResult() {
    // 參數只帶種子與選項，絕不包含任何照片資料
    const enc = encodeParams({ hash, hand, gender, mode });
    router.replace(`/palm/start?d=${enc}`);
  }

  if (loading) {
    return (
      <RitualLoading
        messages={
          mode === "palm"
            ? ["正在端詳你的掌紋…", "對照傳統相理…", "你的解析即將浮現…"]
            : ["正在端詳你的面相…", "對照五官相理…", "你的解析即將浮現…"]
        }
        onDone={goResult}
      />
    );
  }

  return (
    <div className="card-mystic p-6 sm:p-8">
      <h1 className="text-center font-serif text-2xl font-bold">
        <span className="text-gradient-gold">🖐️ 手相・面相分析</span>
      </h1>
      <p className="mt-2 text-center text-sm text-ink-300">
        上傳一張清晰的照片，看看傳統相學怎麼形容此刻的你
      </p>

      {/* 模式切換 */}
      <div className="mt-6 flex gap-2" role="tablist" aria-label="分析類型">
        {(["palm", "face"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            className={mode === m ? "btn-gold flex-1" : "btn-ghost flex-1"}
            onClick={() => setMode(m)}
          >
            {m === "palm" ? "🖐️ 手相" : "🙂 面相"}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-5">
        {/* 照片上傳 */}
        <div>
          <span className="mb-2 block text-sm font-bold text-ink-100">
            上傳{mode === "palm" ? "手掌" : "臉部"}照片
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onPickFile}
          />
          <button
            type="button"
            className="btn-ghost w-full"
            onClick={() => fileInputRef.current?.click()}
          >
            📷 {fileName ? "重新選擇照片" : "選擇照片"}
          </button>
          {preview && (
            <figure className="mt-3 text-center">
              <img
                src={preview}
                alt="照片預覽"
                className="mx-auto max-h-56 w-auto rounded-xl border border-gold-500/20 object-contain"
              />
              <figcaption className="mt-1.5 text-xs text-ink-500">
                {fileName}・僅顯示於本機
              </figcaption>
            </figure>
          )}
          <p className="mt-2 rounded-xl border border-mystic-400/30 bg-mystic-500/5 px-3 py-2 text-xs leading-relaxed text-mystic-300">
            🔒 照片僅在您的瀏覽器中讀取與顯示，不會上傳伺服器、不會被保存。
          </p>
        </div>

        {/* 手相：選左右手 */}
        {mode === "palm" && (
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-ink-100">分析的手</span>
            <select
              className="input-mystic w-full"
              value={hand}
              onChange={(e) => setHand(e.target.value as Hand)}
            >
              <option value="R">右手（傳統上看後天發展）</option>
              <option value="L">左手（傳統上看先天特質）</option>
            </select>
          </label>
        )}

        {/* 性別 */}
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-ink-100">性別</span>
          <select
            className="input-mystic w-full"
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
          >
            <option value="F">女性</option>
            <option value="M">男性</option>
          </select>
        </label>

        {/* 同意事項 */}
        <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-ink-500/20 p-3 text-sm text-ink-300">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 accent-gold-500"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <span>我了解照片僅於本機分析，不會上傳。</span>
        </label>

        {error && (
          <p role="alert" className="rounded-xl border border-rose-400/40 bg-rose-400/10 px-3 py-2 text-sm text-rose-400">
            {error}
          </p>
        )}

        <button type="button" className="btn-gold w-full" onClick={submit}>
          🔮 開始{mode === "palm" ? "手相" : "面相"}分析
        </button>
        <p className="text-center text-xs text-ink-500">
          結果為傳統相學的趣味重構，僅供娛樂與自我探索參考，不涉及吉凶或健康斷言。
        </p>
      </div>
    </div>
  );
}
