import Link from "next/link";
import { getOverallScoreInfo, getProductEditorial, type ProductWithScore } from "@/lib/data";
import { groupComparableRankings } from "@/lib/ranking";
import type { AxisDefinition, AxisKey } from "@/types/axis";
import { AxisMiniBreakdown } from "@/components/AxisMiniBreakdown";
import { AxisScoreBadge } from "@/components/AxisScoreBadge";
import { PriceDisplay } from "@/components/PriceDisplay";
import { ProductImage } from "@/components/ProductImage";

function EvaluationCard({
  item,
  highlightAxis,
  rank,
}: {
  item: ProductWithScore;
  highlightAxis?: AxisKey | null;
  /** 表示する順位。undefinedなら「N位」を表示しない（グループ化できない・順位を付けない場合）。 */
  rank?: number;
}) {
  const { score, status } = getOverallScoreInfo(item);
  const editorial = getProductEditorial(item.product.id);
  // 記事のテーマAXIS（highlightAxis）に対応する理由だけを優先表示する。
  // 該当するreasonForItem/considerAlternativesIfがなければ、無関係な理由を代用せず省略する
  // （例：コスパ記事でprice_value関連の理由がない商品は、強み・注意点とも空欄になる）。
  const strength = highlightAxis
    ? editorial?.recommendedFor.find((r) => r.axisKey === highlightAxis)
    : undefined;
  const caution = highlightAxis
    ? editorial?.considerAlternativesIf.find((c) => c.axisKey === highlightAxis)
    : undefined;

  return (
    <div className="rounded-lg border border-brand-line bg-brand-card p-5">
      <div className="mb-3 flex flex-wrap items-start gap-4">
        <ProductImage product={item.product} aspect="aspect-square" className="w-20 sm:w-24" sizes="96px" />
        <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brand-accent2">
              {rank !== undefined ? `${rank}位 ／ ` : ""}
              {item.product.brand}
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
        <Link href={`/robot-vacuums/${item.product.id}`} className="text-sm font-bold text-brand-accent underline">
          商品詳細を見る →
        </Link>
      </div>
    </div>
  );
}

/**
 * 比較記事テンプレートv1.0の⑤「商品別評価」。
 * 文章はproductEditorial.json（oneLineConclusion・recommendedFor・considerAlternativesIf）のみを使い、
 * 内部rationaleは表示しない。
 *
 * axisDefinitionsを渡すと、除外AXISの集合が同じ商品同士だけをグループ化し、グループごとに
 * 「N位」を振り直す（confirmed・参考・評価情報不足をまたいだ通し番号にしない）。
 * axisDefinitionsを省略した場合は、itemsを渡された順のまま「N位」なしで並べる
 * （そのAXIS SCORE™の並び順自体が記事のテーマの順位だと誤解されうる記事向け。
 * 例：段差乗り越え性能単体を扱う記事で、住宅適合性の総合評価を参考として示す場合）。
 */
export function ArticleProductEvaluationCards({
  items,
  highlightAxis,
  axisDefinitions,
}: {
  items: ProductWithScore[];
  highlightAxis?: AxisKey | null;
  axisDefinitions?: AxisDefinition[];
}) {
  if (!axisDefinitions) {
    return (
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-bold">商品別評価</h2>
        <div className="space-y-5">
          {items.map((item) => (
            <EvaluationCard key={item.product.id} item={item} highlightAxis={highlightAxis} />
          ))}
        </div>
      </section>
    );
  }

  const { groups, unranked } = groupComparableRankings(items);
  const axisLabel = (key: string) => axisDefinitions.find((d) => d.axisKey === key)?.label ?? key;

  return (
    <section className="mb-10">
      <h2 className="mb-4 text-lg font-bold">商品別評価</h2>

      {groups.map((group) => {
        const groupKey = group.excludedAxisKeys.join(",") || "all";
        const isFull = group.excludedAxisKeys.length === 0;
        return (
          <div key={groupKey} className="mb-6">
            {groups.length > 1 && (
              <p className="mb-3 text-xs font-bold text-brand-inkSoft">
                {isFull
                  ? "5つのAXISすべてにもとづく評価"
                  : `参考評価（${group.excludedAxisKeys.map(axisLabel).join("・")}の評価情報が不足しているため、それ以外のAXISで算出。確定評価より内容が劣るという意味ではありません）`}
              </p>
            )}
            <div className="space-y-5">
              {group.items.map((item, index) => (
                <EvaluationCard key={item.product.id} item={item} highlightAxis={highlightAxis} rank={index + 1} />
              ))}
            </div>
          </div>
        );
      })}

      {unranked.length > 0 && (
        <div>
          {groups.length > 0 && (
            <p className="mb-3 text-xs font-bold text-brand-inkSoft">評価情報不足の商品（順位はつけていません）</p>
          )}
          <div className="space-y-5">
            {unranked.map((item) => (
              <EvaluationCard key={item.product.id} item={item} highlightAxis={highlightAxis} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
