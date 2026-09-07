import Link from "next/link";
import { getOverallScoreInfo, type ProductWithScore } from "@/lib/data";
import { groupComparableRankings } from "@/lib/ranking";
import type { AxisDefinition } from "@/types/axis";
import { AxisScoreBadge } from "@/components/AxisScoreBadge";
import { ProductImage } from "@/components/ProductImage";

/**
 * 比較記事テンプレートv1.0の②「先に結論」。ArticleRankingListの後継。
 * confirmed・参考（provisional）・評価情報不足をまたいだ通しの1位〜◯位は作らない。
 * 除外AXISの集合が同じ商品同士（＝同じ重み配分で算出された総合点）だけをグループ化し、
 * グループごとに連番を振り直す。評価情報不足の商品は別枠にまとめ、順位を付けない。
 */
export function ArticleRankingGroups({
  items,
  heading,
  personaName,
  axisDefinitions,
}: {
  items: ProductWithScore[];
  heading: string;
  /** 説明文中で使うpersona名（例："狭い家で使いたい"） */
  personaName: string;
  axisDefinitions: AxisDefinition[];
}) {
  const { groups, unranked } = groupComparableRankings(items);

  const axisLabel = (key: string) => axisDefinitions.find((d) => d.axisKey === key)?.label ?? key;

  return (
    <section className="mb-10">
      <h2 className="mb-1 text-xl font-bold">{heading}</h2>
      <p className="mb-5 text-sm text-brand-inkSoft">
        「{personaName}」を優先したAXIS SCORE™にもとづく評価です。総合点の計算に使ったAXISの組み合わせが異なる商品同士は、同じ条件で比較できないため、グループを分けて表示しています。
      </p>

      {groups.map((group) => {
        const groupKey = group.excludedAxisKeys.join(",") || "all";
        const isFull = group.excludedAxisKeys.length === 0;
        return (
          <div key={groupKey} className="mb-6">
            <h3 className="mb-1 text-sm font-bold text-brand-ink">
              {isFull
                ? "5つのAXISすべてにもとづく総合評価"
                : `参考評価（${group.excludedAxisKeys.map(axisLabel).join("・")}の評価情報が不足しているため、それ以外のAXISで算出）`}
            </h3>
            {!isFull && (
              <p className="mb-3 text-xs text-brand-inkSoft">
                一部の評価情報にもとづく参考評価です。上のグループより確定度は低くなりますが、確定評価より内容が劣るという意味ではありません。順位はこのグループ内の商品同士でのみ比較できます。
              </p>
            )}
            <ol className="space-y-3">
              {group.items.map((item, index) => {
                const { score, status } = getOverallScoreInfo(item);
                return (
                  <li
                    key={item.product.id}
                    className="flex flex-col gap-3 rounded-lg border border-brand-line bg-brand-card p-4 sm:flex-row sm:items-center sm:gap-4"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <span className="font-heading text-2xl font-bold text-brand-accent">{index + 1}</span>
                      <ProductImage product={item.product} aspect="aspect-square" className="w-14" sizes="56px" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold uppercase tracking-wide text-brand-accent2">
                          {item.product.brand}
                        </p>
                        <Link
                          href={`/robot-vacuums/${item.product.id}`}
                          className="font-bold text-brand-ink hover:text-brand-accent hover:underline"
                        >
                          {item.product.name}
                        </Link>
                      </div>
                    </div>
                    <AxisScoreBadge score={score} displayStatus={status ?? undefined} />
                  </li>
                );
              })}
            </ol>
          </div>
        );
      })}

      {unranked.length > 0 && (
        <div>
          <h3 className="mb-1 text-sm font-bold text-brand-ink">評価情報不足の商品</h3>
          <p className="mb-3 text-xs text-brand-inkSoft">
            「{personaName}」で重視するAXISの評価情報が大きく不足しているため、総合スコアを算出できていません。順位はつけていません。
          </p>
          <ul className="space-y-3">
            {unranked.map((item) => (
              <li
                key={item.product.id}
                className="flex flex-col gap-3 rounded-lg border border-dashed border-brand-line bg-brand-card p-4 sm:flex-row sm:items-center sm:gap-4"
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <ProductImage product={item.product} aspect="aspect-square" className="w-14" sizes="56px" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold uppercase tracking-wide text-brand-accent2">
                      {item.product.brand}
                    </p>
                    <Link
                      href={`/robot-vacuums/${item.product.id}`}
                      className="font-bold text-brand-ink hover:text-brand-accent hover:underline"
                    >
                      {item.product.name}
                    </Link>
                  </div>
                </div>
                <AxisScoreBadge score={null} displayStatus="insufficient" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
