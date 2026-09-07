import type { ScoreDisplayStatus } from "@/types/axis";
import type { Product } from "@/types/product";
import type { RecommendedForItem } from "@/types/productEditorial";
import { AxisScoreBadge } from "@/components/AxisScoreBadge";
import { PriceDisplay } from "@/components/PriceDisplay";
import { ProductImage } from "@/components/ProductImage";
import { PurchaseButtons } from "@/components/PurchaseButtons";

/**
 * 商品詳細ページのファーストビュー。「この商品は自分に関係ありそう」と
 * 一目で判断できることを目的とする。
 * reviewStatusが「実機検証済」以外（今回対象の実在5商品はすべて「情報のみ」）の場合、
 * 「メーカー公表情報の確認」と「編集部による実機検証」を混同されないよう、冒頭で明示する。
 */
export function ProductHero({
  product,
  score,
  status,
  oneLineConclusion,
  recommendedFor,
}: {
  product: Product;
  score: number | null;
  status: ScoreDisplayStatus | null;
  oneLineConclusion?: string;
  recommendedFor: RecommendedForItem[];
}) {
  return (
    <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr] md:items-start">
      <ProductImage
        product={product}
        aspect="aspect-square"
        className="w-full max-w-xs md:max-w-none"
        sizes="(min-width: 768px) 280px, 60vw"
        priority
      />

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-accent2">{product.brand}</p>
        <h1 className="mb-3 text-3xl font-bold">{product.name}</h1>

        {product.reviewStatus !== "実機検証済" && (
          <p className="mb-4 inline-block rounded-md border border-dashed border-brand-line px-3 py-2 text-xs text-brand-inkSoft">
            メーカー公表情報に基づく評価です。編集部による実機検証は行っていません。
          </p>
        )}

        {oneLineConclusion && <p className="mb-4 text-lg font-bold text-brand-ink">{oneLineConclusion}</p>}

        <div className="mb-5 flex flex-wrap items-center gap-4">
          <AxisScoreBadge score={score} trademark displayStatus={status ?? undefined} />
          <PriceDisplay product={product} />
        </div>

        {recommendedFor.length > 0 && (
          <div className="mb-5">
            <p className="mb-2 text-xs font-bold text-brand-inkSoft">こんな人におすすめ</p>
            <div className="flex flex-wrap gap-2">
              {recommendedFor.slice(0, 3).map((item) => (
                <span
                  key={item.label}
                  className="rounded-full bg-brand-accentSoft px-3 py-1 text-xs font-bold text-brand-accent"
                >
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        )}

        <PurchaseButtons product={product} pageType="product_detail" placement="hero" />
        <a
          href="#purchase"
          className="mt-3 inline-block text-sm font-bold text-brand-accent underline"
        >
          価格・購入先の詳細を見る →
        </a>
      </div>
    </section>
  );
}
