import type { Product } from "@/types/product";

type PriceProduct = Pick<Product, "currentPrice" | "referencePrice" | "priceCheckedAt">;

/**
 * 価格表示。currentPrice（現在価格）とreferencePrice（参考価格）が両方存在し、
 * かつ異なる場合、ユーザーが両者を混同しないよう区別して表示する。
 * どちらか一方のみ、または同額の場合は単一の価格のみ表示する。
 * AXIS SCORE™の算出には使わない（表示専用）。
 */
export function PriceDisplay({
  product,
  variant = "compact",
  className = "",
}: {
  product: PriceProduct;
  /** compact: 一覧・カード等の限られたスペース向け。detailed: 購入導線向けの強調表示。 */
  variant?: "compact" | "detailed";
  className?: string;
}) {
  const { currentPrice, referencePrice, priceCheckedAt } = product;

  if (currentPrice === null && referencePrice === null) {
    return <div className={`tabular-nums text-brand-inkSoft ${className}`}>価格未確認</div>;
  }

  const hasBoth = currentPrice !== null && referencePrice !== null && currentPrice !== referencePrice;

  if (!hasBoth) {
    const price = (currentPrice ?? referencePrice) as number;
    const label = currentPrice === null ? "参考価格 " : "";
    return (
      <div className={`tabular-nums text-brand-inkSoft ${className}`}>
        {label}
        {price.toLocaleString()}円
      </div>
    );
  }

  if (variant === "detailed") {
    return (
      <div className={className}>
        <p className="text-xs text-brand-inkSoft">現在価格</p>
        <p className="text-2xl font-bold tabular-nums text-brand-ink">{currentPrice.toLocaleString()}円</p>
        <p className="mt-1 tabular-nums text-xs text-brand-inkSoft">参考価格 {referencePrice.toLocaleString()}円</p>
        {priceCheckedAt && <p className="mt-0.5 text-xs text-brand-inkSoft">{priceCheckedAt}確認</p>}
      </div>
    );
  }

  return (
    <div className={`tabular-nums text-brand-inkSoft ${className}`}>
      {currentPrice.toLocaleString()}円
      <span className="ml-1.5 block text-xs text-brand-inkSoft/70 sm:inline sm:ml-2">
        参考価格 {referencePrice.toLocaleString()}円
      </span>
    </div>
  );
}
