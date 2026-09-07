import type { ScoreDisplayStatus } from "@/types/axis";

/**
 * AxisScoreBadge.tsxのcanvasトークン版。ロジック（表示分岐）は完全に同一で、
 * クラス名だけをcanvas-*に置き換えている。既存のAxisScoreBadge.tsx自体は変更しない
 * （他4商品・他ページは引き続き既存の色で表示される）。
 */
export function CanvasAxisScoreBadge({
  score,
  trademark = false,
  displayStatus,
}: {
  score: number | null;
  trademark?: boolean;
  displayStatus?: ScoreDisplayStatus;
}) {
  if (displayStatus === "insufficient" || (score === null && !displayStatus)) {
    return (
      <div className="inline-flex items-baseline gap-1.5 rounded-full border border-dashed border-canvas-line bg-canvas-bg px-3 py-1">
        <span className="text-[10px] font-bold uppercase tracking-wide text-canvas-inkSoft">
          {displayStatus === "insufficient" ? "評価情報不足" : "採点準備中"}
        </span>
      </div>
    );
  }

  if (score === null) {
    return (
      <div className="inline-flex items-baseline gap-1.5 rounded-full border border-dashed border-canvas-line bg-canvas-bg px-3 py-1">
        <span className="text-[10px] font-bold uppercase tracking-wide text-canvas-inkSoft">採点準備中</span>
      </div>
    );
  }

  const isProvisional = displayStatus === "provisional";

  return (
    <div
      className={`inline-flex items-baseline gap-1.5 rounded-full px-3 py-1 ${
        isProvisional ? "bg-canvas-accentSoft" : "bg-canvas-primarySoft"
      }`}
    >
      <span
        className={`text-[10px] font-bold uppercase tracking-wide ${
          isProvisional ? "text-canvas-accentText" : "text-canvas-primary"
        }`}
      >
        {isProvisional && "参考 "}
        AXIS SCORE{trademark && "™"}
      </span>
      <span
        className={`font-heading text-lg font-bold tabular-nums ${
          isProvisional ? "text-canvas-accentText" : "text-canvas-primary"
        }`}
      >
        {score.toFixed(1)}
      </span>
    </div>
  );
}
