import Link from "next/link";
import { getOverallScoreInfo, type ProductWithScore } from "@/lib/data";
import type { AxisKey } from "@/types/axis";
import { PriceDisplay } from "./PriceDisplay";
import { ProductImage } from "./ProductImage";
import { AxisScoreRing } from "./AxisScoreRing";
import { AxisMiniBreakdown } from "./AxisMiniBreakdown";

const LABEL_BY_STATUS: Record<"none" | "insufficient" | "provisional" | "confirmed", string> = {
  none: "採点準備中",
  insufficient: "評価情報不足",
  provisional: "AXIS SCORE™（参考）",
  confirmed: "AXIS SCORE™",
};

export function ProductCard({
  item,
  reason,
  highlightAxis,
}: {
  item: ProductWithScore;
  /** 「あなたに合う理由」の1行説明。ペルソナ未選択時は undefined。 */
  reason?: string;
  highlightAxis?: AxisKey | null;
}) {
  const { product, axisScoreResult, displayAwareResult } = item;
  const { score, status } = getOverallScoreInfo(item);
  const label = LABEL_BY_STATUS[status ?? "none"];

  return (
    <div className="flex flex-col rounded-lg border border-brand-line bg-brand-card p-5 shadow-sm">
      <ProductImage
        product={product}
        aspect="aspect-[4/3]"
        className="mb-4 w-full"
        sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
      />
      <div className="mb-2 text-xs font-bold uppercase tracking-wide text-brand-accent2">
        {product.brand}
      </div>
      <h3 className="mb-4 text-lg font-bold text-brand-ink">{product.name}</h3>

      <div className="mb-3 flex flex-col items-center text-center">
        <AxisScoreRing score={score} displayStatus={status ?? undefined} />
        <div
          className={`mt-1.5 text-[11px] font-bold uppercase tracking-wide ${
            status === "confirmed"
              ? "text-brand-accent"
              : status === "provisional"
                ? "text-brand-accent2"
                : "text-brand-inkSoft"
          }`}
        >
          {label}
        </div>
      </div>
      <PriceDisplay product={product} className="mb-4 text-center text-sm" />

      {displayAwareResult ? (
        <AxisMiniBreakdown breakdown={displayAwareResult.breakdown} highlightAxis={highlightAxis} />
      ) : axisScoreResult ? (
        <AxisMiniBreakdown breakdown={axisScoreResult.breakdown} highlightAxis={highlightAxis} />
      ) : (
        <p className="text-center text-xs text-brand-inkSoft">
          スペック情報を確認済み。AXIS SCORE™の採点は準備中です。
        </p>
      )}

      {reason && (
        <p className="mt-4 truncate rounded-md bg-brand-accentSoft px-3 py-2 text-xs text-brand-accent" title={reason}>
          <span className="font-bold">あなたに合う理由：</span>
          {reason}
        </p>
      )}

      <Link
        href={`/robot-vacuums/${product.id}`}
        className="mt-4 inline-block text-sm font-bold text-brand-accent underline"
      >
        商品詳細を見る →
      </Link>
    </div>
  );
}
