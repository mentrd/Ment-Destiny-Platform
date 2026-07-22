import type { Chart } from "@/lib/engines/astrology";
import { ZODIAC_SIGNS } from "@/lib/engines/horoscope-data";

/**
 * 本命盤星盤輪（純 SVG 手繪）
 * - 外圈：12 星座符號，每 30° 一格
 * - 中圈：行星符號依黃經放置（角度重疊時自動微調半徑）
 * - 中央：星空漸層圓
 * 角度轉換：黃經 0°（牡羊 0 度）置於左方（占星慣例），逆時針遞增。
 */

const CX = 170;
const CY = 170;
const R_OUTER = 160; // 星座圈外緣
const R_SIGN_IN = 128; // 星座圈內緣
const R_PLANET = 100; // 行星基準半徑
const R_CORE = 66; // 中央星空圓

/** 黃經 → SVG 座標（黃經 0 在左、逆時針增加） */
function pt(lon: number, r: number): [number, number] {
  const a = ((180 - lon) * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY - r * Math.sin(a)];
}

/** 固定亂數星點（讓中央星空每次渲染一致） */
const CORE_STARS: [number, number, number][] = Array.from({ length: 18 }, (_, i) => {
  const ang = (i * 137.5 * Math.PI) / 180;
  const rr = 8 + ((i * 37) % 52);
  return [CX + rr * Math.cos(ang), CY + rr * Math.sin(ang), 0.6 + ((i * 13) % 10) / 12];
});

export default function ChartWheel({ chart }: { chart: Chart }) {
  // 行星角度過近時，交錯調整半徑避免重疊
  const sorted = [...chart.planets].sort((a, b) => a.lon - b.lon);
  const radiusOf = new Map<string, number>();
  let prevLon = -999;
  let level = 0;
  for (const p of sorted) {
    level = p.lon - prevLon < 14 ? (level + 1) % 3 : 0;
    radiusOf.set(p.id, R_PLANET - level * 20);
    prevLon = p.lon;
  }

  return (
    <svg
      viewBox="0 0 340 340"
      role="img"
      aria-label={`本命盤：太陽${chart.sun.sign.name}、月亮${chart.moon.sign.name}${chart.ascendant ? `、上升${chart.ascendant.sign.name}` : ""}`}
      className="mx-auto block h-auto w-full max-w-[420px]"
    >
      <defs>
        <radialGradient id="wheel-core" cx="50%" cy="42%" r="65%">
          <stop offset="0%" stopColor="#2a3670" />
          <stop offset="55%" stopColor="#121a3a" />
          <stop offset="100%" stopColor="#070b1a" />
        </radialGradient>
        <radialGradient id="wheel-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0b1026" />
          <stop offset="100%" stopColor="#121a3a" />
        </radialGradient>
      </defs>

      {/* 底盤 */}
      <circle cx={CX} cy={CY} r={R_OUTER} fill="url(#wheel-bg)" stroke="#e6c86055" strokeWidth="1.5" />
      <circle cx={CX} cy={CY} r={R_SIGN_IN} fill="none" stroke="#e6c86040" strokeWidth="1" />

      {/* 12 星座 30° 分格線 */}
      {Array.from({ length: 12 }, (_, i) => {
        const [x1, y1] = pt(i * 30, R_SIGN_IN);
        const [x2, y2] = pt(i * 30, R_OUTER);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e6c86035" strokeWidth="1" />;
      })}

      {/* 星座符號（格中央 15°） */}
      {ZODIAC_SIGNS.map((s, i) => {
        const [x, y] = pt(i * 30 + 15, (R_OUTER + R_SIGN_IN) / 2);
        return (
          <text
            key={s.slug}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="15"
            fill="#e6c860"
            opacity="0.9"
          >
            {s.emoji}
          </text>
        );
      })}

      {/* 內圈刻度（每 10°） */}
      {Array.from({ length: 36 }, (_, i) => {
        const [x1, y1] = pt(i * 10, R_SIGN_IN);
        const [x2, y2] = pt(i * 10, R_SIGN_IN - 5);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#b3a6f540" strokeWidth="1" />;
      })}

      {/* 中央星空圓 */}
      <circle cx={CX} cy={CY} r={R_CORE} fill="url(#wheel-core)" stroke="#b3a6f530" strokeWidth="1" />
      {CORE_STARS.map(([x, y, r], i) =>
        Math.hypot(x - CX, y - CY) + r < R_CORE - 3 ? (
          <circle key={i} cx={x} cy={y} r={r} fill="#f4e9c8" opacity={0.35 + (i % 4) * 0.15} />
        ) : null
      )}
      <text x={CX} y={CY} textAnchor="middle" dominantBaseline="central" fontSize="20" fill="#e6c860" opacity="0.9">
        ✦
      </text>

      {/* 上升線（ASC） */}
      {chart.ascendant && (
        <g>
          {(() => {
            const [x1, y1] = pt(chart.ascendant.lon, R_CORE);
            const [x2, y2] = pt(chart.ascendant.lon, R_SIGN_IN);
            const [tx, ty] = pt(chart.ascendant.lon, R_SIGN_IN - 14);
            return (
              <>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e58bb0" strokeWidth="1.5" opacity="0.85" />
                <text x={tx} y={ty} textAnchor="middle" dominantBaseline="central" fontSize="9" fill="#e58bb0">
                  ASC
                </text>
              </>
            );
          })()}
        </g>
      )}

      {/* 行星符號與指示線 */}
      {chart.planets.map((p) => {
        const r = radiusOf.get(p.id) ?? R_PLANET;
        const [x, y] = pt(p.lon, r);
        const [lx1, ly1] = pt(p.lon, r + 11);
        const [lx2, ly2] = pt(p.lon, R_SIGN_IN);
        return (
          <g key={p.id}>
            <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke="#b3a6f535" strokeWidth="1" />
            <circle cx={x} cy={y} r="10.5" fill="#0b1026" stroke="#e6c86070" strokeWidth="1" />
            <text x={x} y={y + 0.5} textAnchor="middle" dominantBaseline="central" fontSize="12" fill="#f4e9c8">
              {p.symbol}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
