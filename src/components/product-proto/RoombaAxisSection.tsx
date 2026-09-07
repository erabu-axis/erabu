import { axisDefinitions, axisScoreProfiles, type AxisLeader } from "@/lib/data";
import type { DisplayAwareAxisScoreResult } from "@/lib/axisScore";
import type { ProductAxisScores } from "@/types/axis";
import { CompareWithOthers } from "@/components/product-detail/CompareWithOthers";
import { RoombaPersonaScoreSwitcher } from "./RoombaPersonaScoreSwitcher";
import { RoombaAxisBreakdown } from "./RoombaAxisBreakdown";

/**
 * 「AXIS SCORE™・評価の根拠」。
 * 「こんな人におすすめ」「他の商品も比較したい人」（=recommendedFor/considerAlternativesIf）は
 * RoombaHero側で根拠つき全件表示に統合したため、ここでは重複させない
 * （上部と下部で同じ内容を二度読ませない、という修正の一環）。
 * 他4商品はこのコンポーネントを経由しない（従来のJSXのまま）ため、ここでの変更は他商品に影響しない。
 */
export function RoombaAxisSection({
  scores,
  displayAwareResult,
  axisLeaders,
}: {
  scores: ProductAxisScores;
  displayAwareResult: DisplayAwareAxisScoreResult;
  axisLeaders: AxisLeader[];
}) {
  return (
    <section aria-labelledby="axis-section-heading" className="mb-10 space-y-8">
      <h2 id="axis-section-heading" className="text-lg font-bold text-canvas-ink">
        AXIS SCORE™・評価の根拠
      </h2>

      <RoombaPersonaScoreSwitcher productScores={scores} axisDefinitions={axisDefinitions} profiles={axisScoreProfiles} />

      <div>
        <h3 className="mb-3 text-base font-bold text-canvas-ink">AXIS SCORE™ 内訳</h3>
        <RoombaAxisBreakdown result={displayAwareResult} axisDefinitions={axisDefinitions} scores={scores} />
      </div>

      <CompareWithOthers leaders={axisLeaders} axisDefinitions={axisDefinitions} theme="canvas" />
    </section>
  );
}
