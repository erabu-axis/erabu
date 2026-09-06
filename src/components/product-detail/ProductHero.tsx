import type { ScoreDisplayStatus } from "@/types/axis";
import type { Product } from "@/types/product";
import type { RecommendedForItem } from "@/types/productEditorial";
import { AxisScoreBadge } from "@/components/AxisScoreBadge";
import { PriceDisplay } from "@/components/PriceDisplay";
import { ProductImage } from "@/components/ProductImage";

/**
 * 商品詳細ページのファーストビュー。「この商品は自分に関係ありそう」と
 * 一目で判断できることを目的とする。
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

        <a
          href="#purchase"
          className="inline-block rounded-full bg-brand-accent px-6 py-3 text-sm font-bold text-brand-bgRaised hover:opacity-90"
        >
          価格・購入先を見る
        </a>
      </div>
    </section>
  );
}
