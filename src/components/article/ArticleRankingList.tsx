import Link from "next/link";
import { getOverallScoreInfo, type ProductWithScore } from "@/lib/data";
import { AxisScoreBadge } from "@/components/AxisScoreBadge";
import { ProductImage } from "@/components/ProductImage";

/**
 * 比較記事テンプレートv1.0の②「先に結論」ランキング。
 * itemsは呼び出し側で既存のgetProductsWithScores・getSortableScoeによって
 * 並び替え済みであることを前提とし、ここでは表示のみを担当する（新しい順位計算はしない）。
 */
export function ArticleRankingList({
  items,
  heading,
  personaName,
}: {
  items: ProductWithScore[];
  heading: string;
  /** 説明文中で使うpersona名（例："狭い家で使いたい"） */
  personaName: string;
}) {
  return (
    <section className="mb-10">
      <h2 className="mb-1 text-xl font-bold">{heading}</h2>
      <p className="mb-4 text-sm text-brand-inkSoft">
        「{personaName}」を優先したAXIS SCORE™の高い順です。
        <span className="font-bold text-brand-accent2">参考</span>
        が付いたスコアは一部AXISの評価情報が不足しているため確認できている情報のみで算出した参考値、
        <span className="font-bold">評価情報不足</span>
        は総合スコアを算出できるだけの情報が揃っていないことを意味します。いずれもconfirmed（確定）のスコアと同列には扱っていません。
      </p>
      <ol className="space-y-3">
        {items.map((item, index) => {
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
    </section>
  );
}
