"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  DEFAULT_PROFILE_ID,
  axisDefinitions,
  axisScoreProfiles,
  getProductAxisScores,
  getProductsWithScores,
  getProfile,
  getSortableScore,
} from "@/lib/data";
import { getHighlightAxis } from "@/lib/axisScore";
import type { AxisKey } from "@/types/axis";
import { ProductCard } from "./ProductCard";

const personaProfiles = axisScoreProfiles.filter((p) => p.id !== DEFAULT_PROFILE_ID);

/**
 * 「あなたに合う理由」の1行説明。real商品はpublicRationale（ユーザー向け）を優先し、
 * 内部監査用のrationaleをそのまま公開UIに出さない。sample商品はpublicRationaleを持たないため
 * 従来どおりrationale（編集部が書いた説明文で、もともと内部用語を含まない）を使う。
 */
function getReason(productId: string, axisKey: AxisKey | null): string | undefined {
  if (!axisKey) return undefined;
  const scores = getProductAxisScores(productId);
  const entry = scores?.scores.find((s) => s.axisKey === axisKey);
  return entry?.publicRationale ?? entry?.rationale;
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

  const items = useMemo(() => {
    return [...getProductsWithScores(activeProfileId)].sort(
      (a, b) => getSortableScore(b) - getSortableScore(a)
    );
  }, [activeProfileId]);

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
        <p className="mb-1 text-sm text-brand-inkSoft">
          {selectedPersona
            ? `「${selectedPersona.name}」を優先した重み付けで再計算しています。`
            : "重視するポイントを選ぶと、あなた向けのランキングに切り替わります。"}
        </p>
        {items.some((i) => i.displayAwareResult) && (
          <p className="mb-4 text-xs text-brand-inkSoft">
            「参考」がついたAXIS SCORE™は、確認できているAXISのみで算出しています。評価情報の充足度が商品ごとに異なるため、単純な比較にはご注意ください。
          </p>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <ProductCard
              key={item.product.id}
              item={item}
              reason={getReason(item.product.id, highlightAxis)}
              highlightAxis={highlightAxis}
            />
          ))}
        </div>
      </section>
    </>
  );
}
