import type { ScoreDisplayStatus } from "@/types/axis";

export function AxisScoreRing({
  score,
  size = 92,
  displayStatus,
}: {
  score: number | null;
  size?: number;
  /** dataType==="real"の商品向け。insufficientの場合はscoreの値に関わらずプレースホルダ表示にする。 */
  displayStatus?: ScoreDisplayStatus;
}) {
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  if (score === null || displayStatus === "insufficient") {
    return (
      <div className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray="4 6"
            className="text-brand-line"
          />
        </svg>
        <div className="absolute flex flex-col items-center leading-none">
          <span className="font-heading text-2xl font-bold text-brand-inkSoft">–</span>
        </div>
      </div>
    );
  }

  const clamped = Math.max(0, Math.min(100, score));
  const dashOffset = circumference * (1 - clamped / 100);
  const isProvisional = displayStatus === "provisional";

  return (
    <div className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className={isProvisional ? "text-brand-accent2Soft" : "text-brand-accentSoft"}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className={`transition-[stroke-dashoffset] duration-500 ease-out ${
            isProvisional ? "text-brand-accent2" : "text-brand-accent"
          }`}
        />
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span
          className={`font-heading text-2xl font-bold tabular-nums ${
            isProvisional ? "text-brand-accent2" : "text-brand-ink"
          }`}
        >
          {Math.round(clamped)}
        </span>
        <span className="mt-0.5 text-[10px] font-bold text-brand-inkSoft">/100</span>
      </div>
    </div>
  );
}
