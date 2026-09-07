/** persona weight（0-1の小数）を記事本文向けのパーセント文字列にする。小数は12.5%のように残し、整数は50のように出す。 */
export function formatWeightPct(weight: number | undefined): string {
  const pct = (weight ?? 0) * 100;
  return Number.isInteger(pct) ? `${pct}` : pct.toFixed(1);
}

/**
 * axisDefinitions.jsonのdescriptionは公開に適した短い説明が中心だが、price_valueのみ
 * 内部rubricの用語（criterion ID・tier名）を含む監査寄りの文章のため、読者向け画面では
 * この置き換え済みの文言を使う。about-axis-score・商品詳細のAXIS内訳など、
 * axisDefinitions由来のdescriptionを表示するすべての箇所で共通して使うための一元管理。
 */
const AXIS_DESCRIPTION_OVERRIDES: Partial<Record<string, string>> = {
  price_value: "支払う価格に対して、清掃性能・自動化機能・住宅適合性の面でどれだけ価値ある内容を得られるかを評価する。",
};

/** axisDefinitions.jsonのdescriptionを、読者向け画面で表示してよい文言に変換する。 */
export function getAxisDisplayDescription(def: { axisKey: string; description: string }): string {
  return AXIS_DESCRIPTION_OVERRIDES[def.axisKey] ?? def.description;
}

/**
 * 記事内の「チェックポイント」表で1criterionを1セルにまとめる際の共通ロジック。
 * statusが3種類（verified/unpublished/pending-review）あるうち、
 * pending-review（公表値はあるが測定条件が他商品と異なる等）をunpublished（非公表）と
 * 同じ「未確認」に一律でまとめないようにする。該当criterion自体が対象商品に存在しない場合も
 * 「未確認」とする（＝確認できていないという意味では同じ扱いでよい）。
 */
export function formatCriterionCell(
  criterion: { status: "verified" | "unpublished" | "pending-review"; score: number | null; weight: number } | undefined
): string {
  if (!criterion) return "未確認";
  if (criterion.status === "verified" && criterion.score !== null) return `${criterion.score}/${criterion.weight}`;
  if (criterion.status === "pending-review") return "条件により比較不可";
  return "未確認";
}
