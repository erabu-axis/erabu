"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  DEFAULT_PROFILE_ID,
  axisDefinitions,
  axisScoreProfiles,
  getProductAxisScores,
  getProductEditorial,
  getProductsWithScores,
  getProfile,
  type ProductWithScore,
} from "@/lib/data";
import { getHighlightAxis } from "@/lib/axisScore";
import { groupComparableRankings } from "@/lib/ranking";
import type { AxisKey } from "@/types/axis";
import { ProductCard, type ReasonInfo } from "./ProductCard";

const personaProfiles = axisScoreProfiles.filter((p) => p.id !== DEFAULT_PROFILE_ID);

/**
 * 選んだpersonaが最も重視するAXISについて、この商品の説明を「合う理由」だけに固定しない。
 * 「他商品より相対的に高い」「0-100の正規化スコアが◯点以上」といった閾値では判定しない
 * （新しい採点基準・合否ラインを増やすことになるため）。
 * 代わりに、productEditorial.jsonに既にある「確認済みの理由」がそのAXISに対応しているかどうかだけを見る：
 *   - そのAXISの評価情報が不足 → 「判断できない点」（AXISのpublicRationaleを表示）
 *   - そのAXISにひもづくrecommendedForがある → 「この条件に合う点」
 *   - そのAXISにひもづくconsiderAlternativesIfがある → 「注意点」
 *   - 対応する確認済みの理由が無い → 何も表示しない（無関係な理由を代用しない）
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

/** グループ見出し。除外AXISが無ければ「5軸すべて」、あれば「◯◯を除く参考評価」。 */
function groupHeading(excludedAxisKeys: AxisKey[]): string {
  if (excludedAxisKeys.length === 0) return "5つのAXISすべてにもとづく評価";
  const labels = excludedAxisKeys.map((key) => axisDefinitions.find((d) => d.axisKey === key)?.label ?? key);
  return `参考評価（${labels.join("・")}の評価情報が不足しているため、それ以外のAXISで算出）`;
}

export function HomeAxisExperience() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const activeProfileId = selectedId ?? DEFAULT_PROFILE_ID;
  const activeProfile = useMemo(() => getProfile(activeProfileId), [activeProfileId]);
  const selectedPersona = personaProfiles.find((p) => p.id === selectedId) ?? null;
  const highlightAxis = useMemo(
    () => (selectedId ? getHighlightAxis(activeProfile) : null),
    [selectedId, activeProfile]
  );

  const items = useMemo(() => getProductsWithScores(activeProfileId), [activeProfileId]);
  // confirmed・参考・評価情報不足をまたいだ通しの並び順にしない。除外AXISの集合が同じ商品同士だけをグループ化する。
  const { groups, unranked } = useMemo(() => groupComparableRankings(items), [items]);

  return (
    <>
      <section>
        <h2 className="mb-2 text-xl font-bold">あなたは何を重視する？</h2>
        <p className="mb-5 text-sm text-brand-inkSoft">
          重視するポイントを選ぶと、その軸を重み付けした「あなた向け AXIS SCORE™」で下のランキングが並び替わります。
        </p>
        <div className="flex flex-wrap gap-2">
          {personaProfiles.map((persona) => {
            const isActive = selectedId === persona.id;
            return (
              <button
                key={persona.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setSelectedId(isActive ? null : persona.id)}
                className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                  isActive
                    ? "border-brand-accent bg-brand-accent text-brand-bgRaised"
                    : "border-brand-line bg-brand-card text-brand-ink hover:border-brand-accent hover:text-brand-accent"
                }`}
              >
                {persona.name}
              </button>
            );
          })}
          {selectedId && (
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="rounded-full px-4 py-2 text-sm font-bold text-brand-inkSoft underline"
            >
              選択を解除
            </button>
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-bold">5つのAXIS（比較軸）</h2>
        <p className="mb-6 text-sm text-brand-inkSoft">
          全ての商品を同じ5軸で評価し、軸ごとの根拠をすべて公開しています。
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {axisDefinitions.map((def) => {
            const isHighlighted = highlightAxis === def.axisKey;
            return (
              <div
                key={def.axisKey}
                className={`rounded-lg border p-4 text-center transition-colors ${
                  isHighlighted
                    ? "border-brand-accent bg-brand-accentSoft"
                    : "border-brand-line bg-brand-card"
                }`}
              >
                <div className="text-sm font-bold text-brand-ink">{def.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-bold">
            {selectedPersona ? "あなた向け AXIS SCORE™" : "AXIS SCORE™ 上位商品"}
          </h2>
          <Link href="/robot-vacuums" className="text-sm font-bold text-brand-accent underline">
            全商品の比較表へ →
          </Link>
        </div>
        <p className="mb-4 text-sm text-brand-inkSoft">
          {selectedPersona
            ? `「${selectedPersona.name}」を優先した重み付けで再計算しています。総合点の計算に使ったAXISの組み合わせが異なる商品同士は、同じ条件で比較できないためグループを分けています。`
            : "重視するポイントを選ぶと、あなた向けのランキングに切り替わります。"}
        </p>

        {groups.map((group) => {
          const groupKey = group.excludedAxisKeys.join(",") || "all";
          return (
            <div key={groupKey} className="mb-6">
              {groups.length > 1 && (
                <p className="mb-2 text-xs font-bold text-brand-inkSoft">{groupHeading(group.excludedAxisKeys)}</p>
              )}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {group.items.map((item) => (
                  <ProductCard
                    key={item.product.id}
                    item={item}
                    reasonInfo={getReasonInfo(item, highlightAxis)}
                    highlightAxis={highlightAxis}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {unranked.length > 0 && (
          <div>
            {groups.length > 0 && (
              <p className="mb-2 text-xs font-bold text-brand-inkSoft">評価情報不足の商品</p>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {unranked.map((item) => (
                <ProductCard
                  key={item.product.id}
                  item={item}
                  reasonInfo={getReasonInfo(item, highlightAxis)}
                  highlightAxis={highlightAxis}
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
