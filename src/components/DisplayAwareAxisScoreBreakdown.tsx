import type { DisplayAwareAxisScoreResult } from "@/lib/axisScore";
import type { AxisDefinition, ProductAxisScores } from "@/types/axis";
import { AxisScoreValue } from "./AxisScoreValue";

/**
 * dataType==="real"の商品向けAXIS SCORE™内訳。calculateDisplayAwareAxisScoreの結果を
 * scoreDisplayStatus込みで表示する。sample商品向けのAxisScoreBreakdownとは別コンポーネント。
 */
export function DisplayAwareAxisScoreBreakdown({
  result,
  axisDefinitions,
  scores,
}: {
  result: DisplayAwareAxisScoreResult;
  axisDefinitions: AxisDefinition[];
  scores: ProductAxisScores;
}) {
  return (
    <div className="divide-y divide-brand-line rounded-lg border border-brand-line bg-brand-card">
      {result.breakdown.map((item) => {
        const def = axisDefinitions.find((d) => d.axisKey === item.axisKey);
        const entry = scores.scores.find((s) => s.axisKey === item.axisKey);
        return (
          <div key={item.axisKey} className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="font-bold text-brand-ink">{def?.label ?? item.axisKey}</span>
                {def && <p className="mt-0.5 text-xs text-brand-inkSoft">{def.description}</p>}
              </div>
              <AxisScoreValue normalizedScore={item.normalizedScore} scoreDisplayStatus={item.scoreDisplayStatus} />
            </div>
            <p className="mt-2 text-xs text-brand-inkSoft">
              評価充足率：{item.evaluationCoverage}%
              {!item.includedInTotal && "（評価情報不足のため総合スコアの計算対象外）"}
            </p>
            {entry?.publicRationale && (
              <p className="mt-2 text-sm text-brand-inkSoft">{entry.publicRationale}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
