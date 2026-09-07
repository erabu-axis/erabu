import type { DisplayAwareAxisScoreResult } from "@/lib/axisScore";
import type { AxisDefinition, ProductAxisScores } from "@/types/axis";
import { formatAxisScoreDisplay } from "@/lib/format";
import { getAxisDisplayDescription } from "@/lib/article";

/**
 * DisplayAwareAxisScoreBreakdown.tsxのcanvasトークン版。ロジック・データは同一で、
 * 見た目だけをこのページ用に作り直している。元コンポーネント・他4商品の表示は変更しない。
 * 各軸のスコア・評価状態は常に一覧で見え、長いrationale文だけを<details>（ネイティブHTML、
 * キーボード操作・スクリーンリーダー対応済みで追加ライブラリ不要）で開閉式にする。
 */
export function RoombaAxisBreakdown({
  result,
  axisDefinitions,
  scores,
}: {
  result: DisplayAwareAxisScoreResult;
  axisDefinitions: AxisDefinition[];
  scores: ProductAxisScores;
}) {
  return (
    <div className="divide-y divide-canvas-line rounded-lg border border-canvas-line bg-canvas-card">
      {result.breakdown.map((item) => {
        const def = axisDefinitions.find((d) => d.axisKey === item.axisKey);
        const entry = scores.scores.find((s) => s.axisKey === item.axisKey);
        const isProvisional = item.scoreDisplayStatus === "provisional";
        const isInsufficient = item.scoreDisplayStatus === "insufficient";
        return (
          <div key={item.axisKey} className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="font-bold text-canvas-ink">{def?.label ?? item.axisKey}</span>
                {def && <p className="mt-0.5 text-xs text-canvas-inkSoft">{getAxisDisplayDescription(def)}</p>}
              </div>
              <span
                className={`font-heading text-xl font-bold tabular-nums ${
                  isInsufficient
                    ? "text-sm text-canvas-inkSoft"
                    : isProvisional
                      ? "text-canvas-accentText"
                      : "text-canvas-primary"
                }`}
              >
                {formatAxisScoreDisplay(item.normalizedScore, item.scoreDisplayStatus)}
              </span>
            </div>
            <p className="mt-1 text-xs text-canvas-inkSoft">
              評価充足率：{item.evaluationCoverage}%
              {!item.includedInTotal && "（評価情報不足のため総合スコアの計算対象外）"}
            </p>
            {entry?.publicRationale && (
              <details className="group mt-2">
                <summary className="cursor-pointer text-xs font-bold text-canvas-primary underline decoration-canvas-primary/40 underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas-primary [&::-webkit-details-marker]:hidden">
                  評価の詳しい説明を見る<span className="inline-block transition-transform duration-150 group-open:rotate-180">　▾</span>
                </summary>
                <p className="mt-2 text-sm text-canvas-inkSoft">{entry.publicRationale}</p>
              </details>
            )}
          </div>
        );
      })}
    </div>
  );
}
