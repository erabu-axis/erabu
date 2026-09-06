import type { ScoreDisplayStatus } from "@/types/axis";
import { formatAxisScoreDisplay } from "@/lib/format";

const STATUS_TITLE: Record<ScoreDisplayStatus, string> = {
  confirmed: "評価充足率・重要項目とも基準を満たしています",
  provisional: "評価充足率が一定水準にとどまるため参考値として表示しています",
  insufficient: "評価充足率が低いため、スコアは表示せず情報不足として扱っています",
};

/**
 * 1つのAXISのnormalizedScoreを、scoreDisplayStatusに応じた表示ルールで描画する。
 * normalizedScore自体（内部データ）は変更しない。表示のしかただけをここで分離する。
 */
export function AxisScoreValue({
  normalizedScore,
  scoreDisplayStatus,
}: {
  normalizedScore: number | null;
  scoreDisplayStatus: ScoreDisplayStatus;
}) {
  const text = formatAxisScoreDisplay(normalizedScore, scoreDisplayStatus);
  const title = STATUS_TITLE[scoreDisplayStatus];

  if (scoreDisplayStatus === "insufficient") {
    return (
      <span
        className="text-sm font-bold text-brand-inkSoft"
        title={title}
      >
        {text}
      </span>
    );
  }

  if (scoreDisplayStatus === "provisional") {
    return (
      <span
        className="font-heading text-xl font-bold tabular-nums text-brand-inkSoft"
        title={title}
      >
        {text}
      </span>
    );
  }

  return (
    <span
      className="font-heading text-xl font-bold tabular-nums text-brand-accent"
      title={title}
    >
      {text}
    </span>
  );
}
