"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  DEFAULT_PROFILE_ID,
  axisDefinitions,
  axisScoreProfiles,
  getProductAxisScores,
  getProductEditorial,
  getProductsWithScores,
  getProfile,
  getSortableScore,
  type ProductWithScore,
} from "@/lib/data";
import { getHighlightAxis } from "@/lib/axisScore";
import { groupComparableRankings } from "@/lib/ranking";
import { groupByConfirmedPrice, type PriceSortKey } from "@/lib/priceFilter";
import type { AxisKey } from "@/types/axis";
import { CandidateCard, type ReasonInfo } from "./CandidateCard";

/** 主要な入口として先頭に並べる6条件。既存persona（axisScoreProfiles.json）の範囲内で、既存の他条件も「その他の条件」から選べる。 */
const PRIMARY_PERSONA_IDS = [
  "narrow-home",
  "low-maintenance",
  "mopping-focus",
  "sleeping-kids",
  "cost-value",
  "performance-first",
] as const;

const PERSONA_ICON: Record<string, ReactNode> = {
  "narrow-home": <path d="M4 11.5 12 5l8 6.5M6 10v8.5a1 1 0 0 0 1 1h3.5v-5h3v5H17a1 1 0 0 0 1-1V10" />,
  "low-maintenance": (
    <path d="M12 4v3M12 17v3M5 12H2M22 12h-3M6.5 6.5l1.8 1.8M17.5 6.5l-1.8 1.8M8.3 15.7l-1.8 1.8M15.7 15.7l1.8 1.8M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
  ),
  "mopping-focus": <path d="M12 3s5 5.5 5 9.5a5 5 0 0 1-10 0C7 8.5 12 3 12 3Z" />,
  "sleeping-kids": <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />,
  "cost-value": (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9 8h4.5a2 2 0 0 1 0 4H9m0 0h6m-6 0 3 5" />
    </>
  ),
  "performance-first": <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />,
};

const personaProfiles = axisScoreProfiles.filter((p) => p.id !== DEFAULT_PROFILE_ID);
const primaryPersonas = PRIMARY_PERSONA_IDS.map((id) => personaProfiles.find((p) => p.id === id)).filter(
  (p): p is (typeof personaProfiles)[number] => !!p
);
const otherPersonas = personaProfiles.filter((p) => !(PRIMARY_PERSONA_IDS as readonly string[]).includes(p.id));

/**
 * 選んだpersonaが重視するAXISについて、確認済み情報の性質だけで「合う点／注意点／判断できない点」を出し分ける。
 * 新しい合否閾値（◯点未満は不適合、等）は導入しない。HomeAxisExperience.tsxの
 * getReasonInfoと同じロジック（削除前のファイルから移設）。
 */
function getReasonInfo(item: ProductWithScore, axisKey: AxisKey | null): ReasonInfo | undefined {
  if (!axisKey) return undefined;

  const breakdown = item.displayAwareResult?.breakdown.find((b) => b.axisKey === axisKey);
  if (!breakdown || breakdown.scoreDisplayStatus === "insufficient" || breakdown.normalizedScore === null) {
    const scores = getProductAxisScores(item.product.id);
    const entry = scores?.scores.find((s) => s.axisKey === axisKey);
    const text = entry?.publicRationale ?? entry?.rationale;
    return text ? { kind: "unknown", text } : undefined;
  }

  const editorial = getProductEditorial(item.product.id);
  const fit = editorial?.recommendedFor.find((r) => r.axisKey === axisKey);
  if (fit) return { kind: "fit", text: fit.reason };
  const caution = editorial?.considerAlternativesIf.find((c) => c.axisKey === axisKey);
  if (caution) return { kind: "caution", text: caution.reason };
  return undefined;
}

function groupHeading(excludedAxisKeys: AxisKey[]): string {
  if (excludedAxisKeys.length === 0) return "5つのAXISすべてにもとづく評価";
  const labels = excludedAxisKeys.map((key) => axisDefinitions.find((d) => d.axisKey === key)?.label ?? key);
  return `参考評価（${labels.join("・")}の評価情報が不足しているため、それ以外のAXISで算出）`;
}

function PersonaButton({
  id,
  name,
  isActive,
  onClick,
}: {
  id: string;
  name: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-left text-sm font-bold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas-primary ${
        isActive
          ? "border-canvas-primary bg-canvas-primary text-white"
          : "border-canvas-line bg-canvas-card text-canvas-ink hover:border-canvas-primary hover:text-canvas-primary"
      }`}
    >
      {PERSONA_ICON[id] && (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0"
          aria-hidden="true"
        >
          {PERSONA_ICON[id]}
        </svg>
      )}
      {name}
    </button>
  );
}

export function PersonaPicker() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showOthers, setShowOthers] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const activeProfileId = selectedId ?? DEFAULT_PROFILE_ID;
  const activeProfile = useMemo(() => getProfile(activeProfileId), [activeProfileId]);
  const selectedPersona = personaProfiles.find((p) => p.id === selectedId) ?? null;
  const highlightAxis = useMemo(
    () => (selectedId ? getHighlightAxis(activeProfile) : null),
    [selectedId, activeProfile]
  );

  const allItems = useMemo(() => getProductsWithScores(activeProfileId), [activeProfileId]);

  const { confirmed: priceFiltered, unconfirmed: priceUnconfirmed } = useMemo(() => {
    if (maxPrice === null) return { confirmed: allItems, unconfirmed: [] as ProductWithScore[] };
    const sortKey: PriceSortKey = "score_desc";
    return groupByConfirmedPrice(
      allItems,
      (item) => ({ currentPrice: item.product.currentPrice, referencePrice: item.product.referencePrice }),
      getSortableScore,
      { maxPrice, sortKey }
    );
  }, [allItems, maxPrice]);

  const { groups, unranked } = useMemo(() => groupComparableRankings(priceFiltered), [priceFiltered]);
  const noResults = maxPrice !== null && groups.length === 0 && unranked.length === 0;

  return (
    <section aria-labelledby="condition-picker-heading">
      <h2 id="condition-picker-heading" className="mb-2 text-xl font-bold text-canvas-ink">
        条件から候補を見る
      </h2>
      <p className="mb-5 text-sm text-canvas-inkSoft">
        重視したいことを選ぶと、その軸を重み付けした「あなた向け AXIS SCORE™」で候補が並び替わります。
      </p>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {primaryPersonas.map((persona) => (
          <PersonaButton
            key={persona.id}
            id={persona.id}
            name={persona.name}
            isActive={selectedId === persona.id}
            onClick={() => setSelectedId(selectedId === persona.id ? null : persona.id)}
          />
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <button
          type="button"
          onClick={() => setShowOthers((v) => !v)}
          aria-expanded={showOthers}
          className="font-bold text-canvas-primary underline decoration-canvas-primary/40 underline-offset-2 hover:text-canvas-primaryHover"
        >
          {showOthers ? "その他の条件を閉じる ▲" : "その他の条件を見る ▼"}
        </button>
        {selectedId && (
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="font-bold text-canvas-inkSoft underline underline-offset-2 hover:text-canvas-ink"
          >
            選択を解除
          </button>
        )}
      </div>

      {showOthers && (
        <div className="mt-3 flex flex-wrap gap-2">
          {otherPersonas.map((persona) => {
            const isActive = selectedId === persona.id;
            return (
              <button
                key={persona.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setSelectedId(isActive ? null : persona.id)}
                className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas-primary ${
                  isActive
                    ? "border-canvas-primary bg-canvas-primary text-white"
                    : "border-canvas-line bg-canvas-card text-canvas-ink hover:border-canvas-primary hover:text-canvas-primary"
                }`}
              >
                {persona.name}
              </button>
            );
          })}
        </div>
      )}

      {selectedId && (
        <p className="mt-3 rounded-md bg-canvas-primarySoft px-3 py-2 text-xs font-bold text-canvas-primary">
          選択中：{selectedPersona?.name}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-canvas-line pt-5 text-sm">
        <label className="flex items-center gap-2 font-bold text-canvas-ink">
          予算
          <select
            className="rounded-md border border-canvas-line bg-canvas-card px-2 py-1.5 font-normal focus-visible:outline focus-visible:outline-2 focus-visible:outline-canvas-primary"
            defaultValue=""
            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">指定なし</option>
            <option value="30000">3万円以下</option>
            <option value="50000">5万円以下</option>
            <option value="80000">8万円以下</option>
          </select>
        </label>
        {maxPrice !== null && (
          <button
            type="button"
            onClick={() => setMaxPrice(null)}
            className="font-bold text-canvas-inkSoft underline underline-offset-2 hover:text-canvas-ink"
          >
            予算条件を解除
          </button>
        )}
      </div>
      <p className="mt-2 text-xs text-canvas-inkSoft">
        予算の絞り込みは、編集部が確認できた現在価格（確認済み価格）のみを対象にしています。参考価格（AXIS
        SCORE™の価格対効果の採点に使う基準価格）とは別物で、現在価格が未確認の商品は予算内かどうか判断していません。
      </p>

      <div className="mt-6" aria-live="polite">
        {noResults ? (
          <div className="rounded-xl border border-dashed border-canvas-line bg-canvas-card p-6 text-center text-sm text-canvas-inkSoft">
            指定した条件に一致する、現在価格を確認できた商品は該当なしでした。予算条件を変更するか、下の「価格未確認の商品」もあわせてご確認ください。
          </div>
        ) : (
          groups.map((group) => {
            const groupKey = group.excludedAxisKeys.join(",") || "all";
            return (
              <div key={groupKey} className="mb-6">
                {groups.length > 1 && (
                  <p className="mb-2 text-xs font-bold text-canvas-inkSoft">{groupHeading(group.excludedAxisKeys)}</p>
                )}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((item) => (
                    <CandidateCard key={item.product.id} item={item} reasonInfo={getReasonInfo(item, highlightAxis)} />
                  ))}
                </div>
              </div>
            );
          })
        )}

        {!noResults && unranked.length > 0 && (
          <div className="mb-6">
            {groups.length > 0 && <p className="mb-2 text-xs font-bold text-canvas-inkSoft">評価情報不足の商品</p>}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {unranked.map((item) => (
                <CandidateCard key={item.product.id} item={item} reasonInfo={getReasonInfo(item, highlightAxis)} />
              ))}
            </div>
          </div>
        )}

        {maxPrice !== null && priceUnconfirmed.length > 0 && (
          <div>
            <p className="mb-1 text-xs font-bold text-canvas-inkSoft">
              価格未確認の商品（{priceUnconfirmed.length}件）
            </p>
            <p className="mb-2 text-xs text-canvas-inkSoft">
              現在価格を確認できていないため、予算内かどうかは判断できません。参考価格を参考として表示しています。
            </p>
            <div className="grid grid-cols-1 gap-4 opacity-90 sm:grid-cols-2 lg:grid-cols-3">
              {priceUnconfirmed.map((item) => (
                <CandidateCard key={item.product.id} item={item} reasonInfo={getReasonInfo(item, highlightAxis)} />
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="mt-6 text-sm">
        <Link
          href="/robot-vacuums"
          className="font-bold text-canvas-primary underline decoration-canvas-primary/40 underline-offset-2 hover:text-canvas-primaryHover"
        >
          掲載商品をすべて比較する →
        </Link>
      </p>
    </section>
  );
}
