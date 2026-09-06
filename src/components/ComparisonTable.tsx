"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getOverallScoreInfo, getSortableScore, type ProductWithScore } from "@/lib/data";
import type { AxisDefinition, AxisKey } from "@/types/axis";
import { comparablePrice } from "@/lib/format";
import { AxisScoreBadge } from "./AxisScoreBadge";
import { PriceDisplay } from "./PriceDisplay";
import { ProductImage } from "./ProductImage";

type SortKey = "score_desc" | "price_asc" | "price_desc";

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

  const filtered = useMemo(() => {
    const list =
      maxPrice === null
        ? items
        : items.filter((i) => comparablePrice(i.product) <= maxPrice);

    const sorted = [...list];
    switch (sortKey) {
      case "score_desc":
        sorted.sort((a, b) => getSortableScore(b) - getSortableScore(a));
        break;
      case "price_asc":
        sorted.sort((a, b) => comparablePrice(a.product) - comparablePrice(b.product));
        break;
      case "price_desc":
        sorted.sort((a, b) => comparablePrice(b.product) - comparablePrice(a.product));
        break;
    }
    return sorted;
  }, [items, maxPrice, sortKey]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          価格上限
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
            <option value="price_asc">価格が安い順</option>
            <option value="price_desc">価格が高い順</option>
          </select>
        </label>
      </div>

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
          <tbody>
            {filtered.map((item) => {
              const { product, axisScoreResult, displayAwareResult } = item;
              const { score, status } = getOverallScoreInfo(item);
              const axisMap = new Map<
                AxisKey,
                { normalizedScore: number | null; scoreDisplayStatus?: string }
              >();
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
                      <td
                        key={def.axisKey}
                        className={`px-4 py-3 tabular-nums ${isProvisional ? "text-brand-accent2" : ""}`}
                      >
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
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
