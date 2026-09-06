import Link from "next/link";
import { getOverallScoreInfo, getProductEditorial, type ProductWithScore } from "@/lib/data";
import type { AxisKey } from "@/types/axis";
import { AxisMiniBreakdown } from "@/components/AxisMiniBreakdown";
import { AxisScoreBadge } from "@/components/AxisScoreBadge";
import { PriceDisplay } from "@/components/PriceDisplay";
import { ProductImage } from "@/components/ProductImage";

/**
 * 比較記事テンプレートv1.0の⑤「商品別評価」。
 * 文章はproductEditorial.json（oneLineConclusion・recommendedFor・considerAlternativesIf）のみを使い、
 * 内部rationaleは表示しない。itemsは呼び出し側で並び替え済みのランキング順を前提とする。
 */
export function ArticleProductEvaluationCards({
  items,
  highlightAxis,
}: {
  items: ProductWithScore[];
  highlightAxis?: AxisKey | null;
}) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-lg font-bold">商品別評価</h2>
      <div className="space-y-5">
        {items.map((item, index) => {
          const { score, status } = getOverallScoreInfo(item);
          const editorial = getProductEditorial(item.product.id);
          const strength = editorial?.recommendedFor[0];
          const caution = editorial?.considerAlternativesIf[0];

          return (
            <div key={item.product.id} className="rounded-lg border border-brand-line bg-brand-card p-5">
              <div className="mb-3 flex flex-wrap items-start gap-4">
                <ProductImage product={item.product} aspect="aspect-square" className="w-20 sm:w-24" sizes="96px" />
                <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-brand-accent2">
                      {index + 1}位 ／ {item.product.brand}
                    </p>
                    <h3 className="text-xl font-bold text-brand-ink">{item.product.name}</h3>
                    {editorial?.oneLineConclusion && (
                      <p className="mt-1 text-sm font-bold text-brand-ink">{editorial.oneLineConclusion}</p>
                    )}
                  </div>
                  <AxisScoreBadge score={score} displayStatus={status ?? undefined} />
                </div>
              </div>

              {item.displayAwareResult && (
                <AxisMiniBreakdown breakdown={item.displayAwareResult.breakdown} highlightAxis={highlightAxis} />
              )}

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {strength && (
                  <div className="rounded-lg bg-brand-accentSoft p-3">
                    <p className="text-xs font-bold text-brand-accent">この商品の強み</p>
                    <p className="mt-1 text-sm font-bold text-brand-ink">{strength.label}</p>
                    <p className="mt-1 text-xs text-brand-inkSoft">{strength.reason}</p>
                  </div>
                )}
                {caution && (
                  <div className="rounded-lg border border-dashed border-brand-line p-3">
                    <p className="text-xs font-bold text-brand-inkSoft">注意したい点</p>
                    <p className="mt-1 text-sm font-bold text-brand-ink">{caution.label}</p>
                    <p className="mt-1 text-xs text-brand-inkSoft">{caution.reason}</p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <PriceDisplay product={item.product} />
                <Link
                  href={`/robot-vacuums/${item.product.id}`}
                  className="text-sm font-bold text-brand-accent underline"
                >
                  商品詳細を見る →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
