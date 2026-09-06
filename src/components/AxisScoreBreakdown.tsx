import type { AxisScoreResult } from "@/lib/axisScore";
import type { AxisDefinition, ProductAxisScores } from "@/types/axis";

export function AxisScoreBreakdown({
  result,
  axisDefinitions,
  scores,
}: {
  result: AxisScoreResult;
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
              <span className="shrink-0 font-heading text-xl font-bold tabular-nums text-brand-accent">
                {item.normalizedScore}
              </span>
            </div>
            {entry && (
              <p className="mt-2 text-sm text-brand-inkSoft">
                <span className="font-bold text-brand-accent2">根拠：</span>
                {entry.rationale}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
