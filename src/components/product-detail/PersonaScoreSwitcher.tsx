"use client";

import { useMemo, useState } from "react";
import { calculateDisplayAwareAxisScore } from "@/lib/axisScore";
import { AxisScoreBadge } from "@/components/AxisScoreBadge";
import { ScoreStatusNote } from "@/components/ScoreStatusNote";
import type { AxisDefinition, AxisScoreProfile, ProductAxisScores } from "@/types/axis";

const DEFAULT_PROFILE_ID = "default";
/** "default"プロファイルのaxisScoreProfiles.json上のnameは「総合スコア（単純平均）」のままだが、
 *  この画面では選択肢として並ぶため、表示名だけをここで上書きする（データは変更しない）。 */
const DISPLAY_NAME_OVERRIDES: Record<string, string> = {
  [DEFAULT_PROFILE_ID]: "バランス重視",
};

/**
 * 商品詳細ページの「あなたなら何点？」。既存のcalculateDisplayAwareAxisScoreをそのまま使い、
 * persona（重み付けプロファイル）を切り替えるたびにこの商品のAXIS SCORE™を再計算して表示する。
 * 計算ロジック・weight・scoreDisplayStatus判定は一切変更しない。
 */
export function PersonaScoreSwitcher({
  productScores,
  axisDefinitions,
  profiles,
}: {
  productScores: ProductAxisScores;
  axisDefinitions: AxisDefinition[];
  profiles: AxisScoreProfile[];
}) {
  const [selectedProfileId, setSelectedProfileId] = useState<string>(DEFAULT_PROFILE_ID);

  const selectedProfile = useMemo(
    () => profiles.find((p) => p.id === selectedProfileId) ?? profiles[0],
    [profiles, selectedProfileId]
  );

  const result = useMemo(
    () => calculateDisplayAwareAxisScore(productScores, selectedProfile, axisDefinitions),
    [productScores, selectedProfile, axisDefinitions]
  );

  return (
    <section className="mb-10">
      <h2 className="mb-1 text-lg font-bold">あなたなら何点？</h2>
      <p className="mb-4 text-sm text-brand-inkSoft">何を重視するか選ぶと、この商品のAXIS SCORE™が再計算されます。</p>

      <div className="mb-4 flex flex-wrap gap-2">
        {profiles.map((profile) => {
          const isActive = profile.id === selectedProfileId;
          return (
            <button
              key={profile.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setSelectedProfileId(profile.id)}
              className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                isActive
                  ? "border-brand-accent bg-brand-accent text-brand-bgRaised"
                  : "border-brand-line bg-brand-card text-brand-ink hover:border-brand-accent hover:text-brand-accent"
              }`}
            >
              {DISPLAY_NAME_OVERRIDES[profile.id] ?? profile.name}
            </button>
          );
        })}
      </div>

      <div className="rounded-lg border border-brand-line bg-brand-card p-5">
        <p className="mb-2 text-sm text-brand-inkSoft">
          「{DISPLAY_NAME_OVERRIDES[selectedProfileId] ?? selectedProfile.name}」を優先した場合
        </p>
        <AxisScoreBadge score={result.totalScore} displayStatus={result.overallScoreDisplayStatus} />
        <ScoreStatusNote status={result.overallScoreDisplayStatus} />
      </div>
    </section>
  );
}
