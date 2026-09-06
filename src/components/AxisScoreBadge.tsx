import type { ScoreDisplayStatus } from "@/types/axis";

export function AxisScoreBadge({
  score,
  trademark = false,
  displayStatus,
}: {
  score: number | null;
  /** ™表記を付けるか。見出し的に単独で使う箇所（商品詳細ページ等）でtrueにする。表中で繰り返し使う箇所ではfalseのままにする。 */
  trademark?: boolean;
  /**
   * dataType==="real"の商品向け。scoreDisplayStatusに応じた表示に切り替える。
   * 省略時（sample商品・既存呼び出し）は従来どおりの表示：scoreがnullなら「採点準備中」、それ以外はそのまま表示。
   */
  displayStatus?: ScoreDisplayStatus;
}) {
  if (displayStatus === "insufficient" || (score === null && !displayStatus)) {
    return (
      <div className="inline-flex items-baseline gap-1.5 rounded-full border border-dashed border-brand-line bg-brand-bgRaised px-3 py-1">
        <span className="text-[10px] font-bold uppercase tracking-wide text-brand-inkSoft">
          {displayStatus === "insufficient" ? "評価情報不足" : "採点準備中"}
        </span>
      </div>
    );
  }

  if (score === null) {
    return (
      <div className="inline-flex items-baseline gap-1.5 rounded-full border border-dashed border-brand-line bg-brand-bgRaised px-3 py-1">
        <span className="text-[10px] font-bold uppercase tracking-wide text-brand-inkSoft">採点準備中</span>
      </div>
    );
  }

  const isProvisional = displayStatus === "provisional";

  return (
    <div
      className={`inline-flex items-baseline gap-1.5 rounded-full px-3 py-1 ${
        isProvisional ? "bg-brand-accent2Soft" : "bg-brand-accentSoft"
      }`}
    >
      <span
        className={`text-[10px] font-bold uppercase tracking-wide ${
          isProvisional ? "text-brand-accent2" : "text-brand-accent"
        }`}
      >
        {isProvisional && "参考 "}
        AXIS SCORE{trademark && "™"}
      </span>
      <span
        className={`font-heading text-lg font-bold tabular-nums ${
          isProvisional ? "text-brand-accent2" : "text-brand-accent"
        }`}
      >
        {score.toFixed(1)}
      </span>
    </div>
  );
}
