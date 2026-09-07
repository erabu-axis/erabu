/**
 * 価格の絞り込み・並び替えは「確認済み価格（currentPrice）」だけを基準にする。
 * referencePrice（変動しにくい基準価格。AXIS SCORE™ price_valueの採点にはこちらを使い続ける）を
 * 混ぜて順位づけすると、現在価格が確認できている商品だけが不当に安く／高く見えてしまうため。
 * currentPriceが未確認の商品は、絞り込み・並び替えの対象外として別枠に返す
 * （除外はしない。呼び出し側で「価格未確認」と分かる形で表示する）。
 *
 * ComparisonTable.tsxから切り出した純粋関数。UIを持たないため、
 * 実商品データを書き換えずに合成テストデータで境界値を検証できる。
 */

export type PriceSortKey = "score_desc" | "price_asc" | "price_desc";

export interface PriceGrouped<T> {
  /** 確認済み価格（currentPrice）を持つ商品。maxPriceが指定されていればそれ以下のみ。ソート済み。 */
  confirmed: T[];
  /** currentPriceが未確認の商品。maxPriceによる除外はしない（予算内かどうか判断できないため）。referencePrice昇順の参考並び。 */
  unconfirmed: T[];
}

export function groupByConfirmedPrice<T>(
  items: T[],
  getPrices: (item: T) => { currentPrice: number | null; referencePrice: number | null },
  getSortScore: (item: T) => number,
  options: { maxPrice: number | null; sortKey: PriceSortKey }
): PriceGrouped<T> {
  const { maxPrice, sortKey } = options;

  const withPrice = items.filter((item) => getPrices(item).currentPrice !== null);
  const withoutPrice = items.filter((item) => getPrices(item).currentPrice === null);

  let confirmed =
    maxPrice === null ? withPrice : withPrice.filter((item) => (getPrices(item).currentPrice as number) <= maxPrice);

  confirmed = [...confirmed].sort((a, b) => {
    const priceA = getPrices(a).currentPrice as number;
    const priceB = getPrices(b).currentPrice as number;
    if (sortKey === "price_asc") return priceA - priceB;
    if (sortKey === "price_desc") return priceB - priceA;
    return getSortScore(b) - getSortScore(a);
  });

  const unconfirmed = [...withoutPrice].sort(
    (a, b) => (getPrices(a).referencePrice ?? Infinity) - (getPrices(b).referencePrice ?? Infinity)
  );

  return { confirmed, unconfirmed };
}
