"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getOverallScoreInfo, getSortableScore, type ProductWithScore } from "@/lib/data";
import type { AxisDefinition, AxisKey } from "@/types/axis";
import { groupByConfirmedPrice, type PriceSortKey } from "@/lib/priceFilter";
import { AxisScoreBadge } from "./AxisScoreBadge";
import { PriceDisplay } from "./PriceDisplay";
import { ProductImage } from "./ProductImage";

type SortKey = PriceSortKey;

export function ComparisonTable({
  items,
  axisDefinitions,
}: {
  items: ProductWithScore[];
  axisDefinitions: AxisDefinition[];
}) {
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("score_desc");

  const hasReferenceScores = items.some((i) => i.displayAwareResult);
  const isPriceMode = maxPrice !== null || sortKey !== "score_desc";

  const { confirmed, unconfirmed } = useMemo(() => {
    if (!isPriceMode) {
      const sorted = [...items].sort((a, b) => getSortableScore(b) - getSortableScore(a));
      return { confirmed: sorted, unconfirmed: [] as ProductWithScore[] };
    }

    return groupByConfirmedPrice(
      items,
      (item) => ({ currentPrice: item.product.currentPrice, referencePrice: item.product.referencePrice }),
      getSortableScore,
      { maxPrice, sortKey }
    );
  }, [items, maxPrice, sortKey, isPriceMode]);

  function renderRows(list: ProductWithScore[]) {
    return list.map((item) => {
      const { product, axisScoreResult, displayAwareResult } = item;
      const { score, status } = getOverallScoreInfo(item);
      const axisMap = new Map<AxisKey, { normalizedScore: number | null; scoreDisplayStatus?: string }>();
      if (displayAwareResult) {
        for (const b of displayAwareResult.breakdown) {
          axisMap.set(b.axisKey, { normalizedScore: b.normalizedScore, scoreDisplayStatus: b.scoreDisplayStatus });
        }
      } else if (axisScoreResult) {
        for (const b of axisScoreResult.breakdown) {
          axisMap.set(b.axisKey, { normalizedScore: b.normalizedScore });
        }
      }

      return (
        <tr key={product.id} className="border-t border-brand-line align-top">
          <td className="px-4 py-3">
            <div className="flex items-center gap-3">
              <ProductImage product={product} aspect="aspect-square" className="w-10" sizes="40px" />
              <div>
                <div className="font-bold text-brand-ink">{product.name}</div>
                <div className="text-xs text-brand-inkSoft">{product.brand}</div>
              </div>
            </div>
          </td>
          <td className="px-4 py-3">
            <PriceDisplay product={product} />
            {product.priceCheckedAt && (
              <div className="mt-0.5 text-xs text-brand-inkSoft">{product.priceCheckedAt}確認</div>
            )}
          </td>
          <td className="px-4 py-3">
            <AxisScoreBadge score={score} displayStatus={status ?? undefined} />
          </td>
          {axisDefinitions.map((def) => {
            const cell = axisMap.get(def.axisKey);
            if (!cell || cell.normalizedScore === null || cell.scoreDisplayStatus === "insufficient") {
              return (
                <td key={def.axisKey} className="px-4 py-3 text-brand-inkSoft">
                  –
                </td>
              );
            }
            const isProvisional = cell.scoreDisplayStatus === "provisional";
            return (
              <td key={def.axisKey} className={`px-4 py-3 tabular-nums ${isProvisional ? "text-brand-accent2" : ""}`}>
                {isProvisional ? `参考${cell.normalizedScore}` : cell.normalizedScore}
              </td>
            );
          })}
          <td className="whitespace-nowrap px-4 py-3">
            <Link href={`/robot-vacuums/${product.id}`} className="font-bold text-brand-accent underline">
              詳細を見る
            </Link>
          </td>
        </tr>
      );
    });
  }

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          予算（確認済み価格）
          <select
            className="rounded border border-brand-line bg-brand-card px-2 py-1"
            defaultValue=""
            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">指定なし</option>
            <option value="30000">3万円以下</option>
            <option value="50000">5万円以下</option>
            <option value="80000">8万円以下</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          並び替え
          <select
            className="rounded border border-brand-line bg-brand-card px-2 py-1"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
          >
            <option value="score_desc">AXIS SCOREが高い順</option>
            <option value="price_asc">確認済み価格が安い順</option>
            <option value="price_desc">確認済み価格が高い順</option>
          </select>
        </label>
      </div>
      <p className="mb-4 text-xs text-brand-inkSoft">
        予算の絞り込み・価格の並び替えは、編集部が確認できた現在価格（確認済み価格）のみを対象にしています。参考価格（AXIS
        SCORE™の価格対効果の採点に使う基準価格）とは別物です。価格は確認日時点のものです。最新の価格は購入先でご確認ください。
      </p>

      {hasReferenceScores && (
        <p className="mb-3 text-xs text-brand-inkSoft">
          「参考」がついたAXIS SCORE™は、確認できているAXISのみで算出しています。評価情報の充足度が商品ごとに異なるため、単純な比較にはご注意ください。
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-brand-line">
        <table className="w-full min-w-[760px] border-collapse bg-brand-card text-sm">
          <thead>
            <tr className="bg-brand-bgRaised text-left text-brand-inkSoft">
              <th className="px-4 py-3 font-bold">商品名</th>
              <th className="px-4 py-3 font-bold">価格</th>
              <th className="px-4 py-3 font-bold">AXIS SCORE™</th>
              {axisDefinitions.map((def) => (
                <th key={def.axisKey} className="whitespace-nowrap px-4 py-3 font-bold">
                  {def.label}
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>{renderRows(confirmed)}</tbody>
        </table>
      </div>

      {isPriceMode && confirmed.length === 0 && (
        <p className="mt-3 text-xs text-brand-inkSoft">
          指定した条件に一致する、現在価格を確認できた商品はありませんでした。
        </p>
      )}

      {isPriceMode && unconfirmed.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-bold text-brand-inkSoft">
            現在価格が未確認の商品（{unconfirmed.length}件）
          </p>
          <p className="mb-2 text-xs text-brand-inkSoft">
            現在価格を確認できていないため、予算内かどうかは判断していません。参考価格（変動しにくい基準価格）を参考として表示しています。
          </p>
          <div className="overflow-x-auto rounded-lg border border-dashed border-brand-line">
            <table className="w-full min-w-[760px] border-collapse bg-brand-card text-sm opacity-90">
              <thead>
                <tr className="bg-brand-bgRaised text-left text-brand-inkSoft">
                  <th className="px-4 py-3 font-bold">商品名</th>
                  <th className="px-4 py-3 font-bold">価格</th>
                  <th className="px-4 py-3 font-bold">AXIS SCORE™</th>
                  {axisDefinitions.map((def) => (
                    <th key={def.axisKey} className="whitespace-nowrap px-4 py-3 font-bold">
                      {def.label}
                    </th>
                  ))}
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>{renderRows(unconfirmed)}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
