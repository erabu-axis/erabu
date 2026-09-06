/** persona weight（0-1の小数）を記事本文向けのパーセント文字列にする。小数は12.5%のように残し、整数は50のように出す。 */
export function formatWeightPct(weight: number | undefined): string {
  const pct = (weight ?? 0) * 100;
  return Number.isInteger(pct) ? `${pct}` : pct.toFixed(1);
}
