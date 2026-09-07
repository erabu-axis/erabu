"use client";

import { useMemo, useState } from "react";
import { calculateDisplayAwareAxisScore } from "@/lib/axisScore";
import type { AxisDefinition, AxisScoreProfile, ProductAxisScores } from "@/types/axis";
import { CanvasAxisScoreBadge } from "./CanvasAxisScoreBadge";

const DEFAULT_PROFILE_ID = "default";
const DISPLAY_NAME_OVERRIDES: Record<string, string> = {
  [DEFAULT_PROFILE_ID]: "バランス重視",
};

/**
 * PersonaScoreSwitcher.tsxのcanvasトークン版。計算ロジック（calculateDisplayAwareAxisScore・
 * weight・scoreDisplayStatus判定）は元コンポーネントと完全に同一で、一切変更していない。
 */
export function RoombaPersonaScoreSwitcher({
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

  const status = result.overallScoreDisplayStatus;
  const statusNote =
    status === "confirmed"
      ? "必要な評価情報を満たしています。"
      : status === "provisional"
        ? "一部のAXISの評価情報が不足しているため、確認できている情報のみで算出した参考スコアです。"
        : "評価情報が不足しているため、総合スコアは表示していません。";

  return (
    <div>
      <h3 className="mb-1 text-base font-bold text-canvas-ink">あなたなら何点？</h3>
      <p className="mb-4 text-sm text-canvas-inkSoft">何を重視するか選ぶと、この商品のAXIS SCORE™が再計算されます。</p>

      <div className="mb-4 flex flex-wrap gap-2">
        {profiles.map((profile) => {
          const isActive = profile.id === selectedProfileId;
          return (
            <button
              key={profile.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setSelectedProfileId(profile.id)}
              className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas-primary ${
                isActive
                  ? "border-canvas-primary bg-canvas-primary text-white"
                  : "border-canvas-line bg-canvas-card text-canvas-ink hover:border-canvas-primary hover:text-canvas-primary"
              }`}
            >
              {DISPLAY_NAME_OVERRIDES[profile.id] ?? profile.name}
            </button>
          );
        })}
      </div>

      <div className="rounded-lg border border-canvas-line bg-canvas-card p-5">
        <p className="mb-2 text-sm text-canvas-inkSoft">
          「{DISPLAY_NAME_OVERRIDES[selectedProfileId] ?? selectedProfile.name}」を優先した場合
        </p>
        <CanvasAxisScoreBadge score={result.totalScore} displayStatus={status} />
        <p className="mt-1.5 text-xs text-canvas-inkSoft">{statusNote}</p>
      </div>
    </div>
  );
}
