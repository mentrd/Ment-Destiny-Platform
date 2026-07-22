/**
 * 六爻視覺：由下而上排列的陰陽橫條（畫面上方為上爻）。
 * 陽爻 ⚊ 為整條、陰爻 ⚋ 為中斷兩段；動爻以金色高亮並加標記。
 */

const POSITION_NAMES = ["初", "二", "三", "四", "五", "上"];

interface Props {
  /** 6 位字串，初爻在最左，1=陽 0=陰 */
  binary: string;
  /** 動爻索引（0=初爻 … 5=上爻） */
  changingLines?: number[];
  /** 是否顯示爻位名稱 */
  showLabels?: boolean;
  /** 尺寸 */
  size?: "sm" | "lg";
}

export default function HexagramLines({ binary, changingLines = [], showLabels = false, size = "lg" }: Props) {
  const barH = size === "lg" ? "h-2.5 sm:h-3" : "h-1.5";
  const barW = size === "lg" ? "w-36 sm:w-44" : "w-16";
  const gap = size === "lg" ? "gap-2.5 sm:gap-3" : "gap-1.5";

  // 由上爻（索引 5）往下渲染到初爻（索引 0）
  const indexes = [5, 4, 3, 2, 1, 0];

  return (
    <div className={`flex flex-col items-center ${gap}`} role="img" aria-label={`卦象 ${binary}`}>
      {indexes.map((i) => {
        const yang = binary[i] === "1";
        const changing = changingLines.includes(i);
        const color = changing
          ? "bg-gold-400 shadow-[0_0_10px_rgba(212,175,55,0.6)]"
          : "bg-mystic-300/85";
        return (
          <div key={i} className="flex items-center gap-3">
            {showLabels && (
              <span className={`w-8 text-right text-xs ${changing ? "text-gold-300" : "text-ink-500"}`}>
                {POSITION_NAMES[i]}爻
              </span>
            )}
            <div className={`flex ${barW} items-center justify-between`}>
              {yang ? (
                <span className={`${barH} w-full rounded-sm ${color}`} />
              ) : (
                <>
                  <span className={`${barH} w-[42%] rounded-sm ${color}`} />
                  <span className={`${barH} w-[42%] rounded-sm ${color}`} />
                </>
              )}
            </div>
            {showLabels && (
              <span className="w-8 text-left text-xs text-gold-400">{changing ? "動" : ""}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
