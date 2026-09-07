import type { AxisKey, ScoreDisplayStatus } from "@/types/axis";
import { AXIS_ORDER } from "@/lib/data";

const SHORT_LABELS: Record<AxisKey, string> = {
  cleaning_power: "清掃",
  quietness: "静音",
  maintainability: "メンテ",
  space_fit: "住宅",
  price_value: "価格",
};

export function AxisMiniBreakdown({
  breakdown,
  highlightAxis,
}: {
  /**
   * scoreDisplayStatusはdataType==="real"の商品（displayAwareResult経由）でのみ渡される。
   * sample商品（axisScoreResult経由）はscoreDisplayStatusを持たず、常に数値表示のまま（既存の見た目）。
   */
  breakdown: { axisKey: AxisKey; normalizedScore: number | null; scoreDisplayStatus?: ScoreDisplayStatus }[];
  highlightAxis?: AxisKey | null;
}) {
  const ordered = [...breakdown].sort(
    (a, b) => AXIS_ORDER.indexOf(a.axisKey) - AXIS_ORDER.indexOf(b.axisKey)
  );

  return (
    <div className="grid grid-cols-5 gap-1.5">
      {ordered.map((item) => {
        const isHighlighted = highlightAxis === item.axisKey;
        const isInsufficient = item.scoreDisplayStatus === "insufficient";
        const isProvisional = item.scoreDisplayStatus === "provisional";
        const displayScore = isInsufficient || item.normalizedScore === null ? null : item.normalizedScore;
        return (
          <div key={item.axisKey} className="text-center">
            <div
              className={`text-[10px] ${
                isHighlighted ? "font-bold text-brand-accent" : "text-brand-inkSoft"
              }`}
            >
              {SHORT_LABELS[item.axisKey]}
            </div>
            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-brand-accentSoft">
              <div
                className={`h-full rounded-full ${
                  isInsufficient ? "bg-brand-line" : isHighlighted ? "bg-brand-accent2" : "bg-brand-accent"
                }`}
                style={{ width: `${displayScore ?? 0}%` }}
              />
            </div>
            <div
              className={`mt-1 text-[11px] font-bold tabular-nums ${
                isProvisional ? "text-brand-accent2" : "text-brand-ink"
              }`}
            >
              {displayScore === null ? "–" : isProvisional ? `参考${displayScore}` : displayScore}
            </div>
          </div>
        );
      })}
    </div>
  );
}
