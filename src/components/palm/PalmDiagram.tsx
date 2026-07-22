import type { PalmMode } from "@/lib/engines/palm";

interface LegendItem {
  key: string;
  name: string;
  icon: string;
  meaning: string;
}

/**
 * 手掌三大主線／面相五官的 SVG 圖解（純示意，不含任何照片資料）。
 * 分享連結開啟、無本機照片時亦可作為預覽替代圖。
 */
export default function PalmDiagram({
  mode,
  legend,
}: {
  mode: PalmMode;
  legend: LegendItem[];
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-[minmax(0,220px)_1fr] sm:items-center">
      <div className="mx-auto w-full max-w-[220px]">
        {mode === "palm" ? <HandSvg /> : <FaceSvg />}
      </div>
      <ul className="space-y-2.5">
        {legend.map((l) => (
          <li key={l.key} className="text-sm leading-relaxed">
            <span className="font-bold text-gold-400">
              <span className="mr-1" aria-hidden>{l.icon}</span>
              {l.name}
            </span>
            <span className="text-ink-300">：{l.meaning}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function HandSvg() {
  return (
    <svg
      viewBox="0 0 200 240"
      role="img"
      aria-label="手掌三大主線示意圖：生命線、智慧線、感情線"
      className="h-auto w-full"
    >
      {/* 手掌與手指輪廓 */}
      <g fill="rgba(148,120,201,0.10)" stroke="rgba(212,175,120,0.45)" strokeWidth="2">
        <path d="M52 232 C40 200 38 150 44 120 C40 100 44 92 52 92 C56 78 66 76 70 88 L72 108 C74 96 84 92 88 100 L90 96 C94 84 106 86 108 98 L110 104 C114 92 126 96 126 108 L128 132 C136 128 150 132 150 148 C150 178 146 210 138 232 Z" />
      </g>
      {/* 三大主線 */}
      {/* 生命線：環繞拇指根部 */}
      <path
        d="M60 108 C52 132 54 172 78 200"
        fill="none"
        stroke="#7dd3a0"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* 智慧線：橫貫掌心中段 */}
      <path
        d="M58 138 C82 150 112 150 134 140"
        fill="none"
        stroke="#e0b968"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* 感情線：掌心上方 */}
      <path
        d="M62 120 C88 110 118 112 138 118"
        fill="none"
        stroke="#e78aa0"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <g fontSize="10" fontWeight="bold">
        <text x="80" y="212" fill="#7dd3a0">生命線</text>
        <text x="138" y="146" fill="#e0b968">智慧線</text>
        <text x="140" y="116" fill="#e78aa0">感情線</text>
      </g>
    </svg>
  );
}

function FaceSvg() {
  return (
    <svg
      viewBox="0 0 200 240"
      role="img"
      aria-label="面相五官示意圖：眉、眼、鼻、口、耳"
      className="h-auto w-full"
    >
      {/* 臉型 */}
      <ellipse cx="100" cy="120" rx="60" ry="78" fill="rgba(148,120,201,0.10)" stroke="rgba(212,175,120,0.45)" strokeWidth="2" />
      {/* 耳 */}
      <path d="M40 110 C28 108 28 132 42 132" fill="none" stroke="#7dd3a0" strokeWidth="3" strokeLinecap="round" />
      <path d="M160 110 C172 108 172 132 158 132" fill="none" stroke="#7dd3a0" strokeWidth="3" strokeLinecap="round" />
      {/* 眉 */}
      <path d="M66 92 C76 86 88 86 96 90" fill="none" stroke="#c8a24a" strokeWidth="3" strokeLinecap="round" />
      <path d="M104 90 C112 86 124 86 134 92" fill="none" stroke="#c8a24a" strokeWidth="3" strokeLinecap="round" />
      {/* 眼 */}
      <path d="M68 106 C76 100 90 100 96 106 C90 112 76 112 68 106 Z" fill="none" stroke="#e0b968" strokeWidth="2.5" />
      <path d="M104 106 C110 100 124 100 132 106 C124 112 110 112 104 106 Z" fill="none" stroke="#e0b968" strokeWidth="2.5" />
      {/* 鼻 */}
      <path d="M100 112 L94 142 C98 148 102 148 106 142 Z" fill="none" stroke="#9d84c9" strokeWidth="2.5" strokeLinejoin="round" />
      {/* 口 */}
      <path d="M82 166 C92 174 108 174 118 166" fill="none" stroke="#e78aa0" strokeWidth="3" strokeLinecap="round" />
      <g fontSize="9" fontWeight="bold">
        <text x="132" y="88" fill="#c8a24a">眉</text>
        <text x="134" y="104" fill="#e0b968">眼</text>
        <text x="110" y="140" fill="#9d84c9">鼻</text>
        <text x="122" y="170" fill="#e78aa0">口</text>
        <text x="24" y="126" fill="#7dd3a0">耳</text>
      </g>
    </svg>
  );
}
