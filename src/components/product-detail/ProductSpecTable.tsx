import type { Product } from "@/types/product";

const NOT_DISCLOSED = "非公表";

function formatDimensions(w: number | null, d: number | null, h: number | null): string {
  const parts: string[] = [];
  if (w !== null && d !== null) parts.push(`${w}mm × ${d}mm`);
  else if (w !== null) parts.push(`幅${w}mm`);
  else if (d !== null) parts.push(`奥行き${d}mm`);
  if (h !== null) parts.push(`高さ${h}mm`);
  return parts.length > 0 ? parts.join("、") : NOT_DISCLOSED;
}

function formatBoolean(value: boolean | null): string {
  if (value === true) return "あり";
  if (value === false) return "なし";
  return NOT_DISCLOSED;
}

function formatNumber(value: number | null, unit: string): string {
  return value !== null ? `${value.toLocaleString()}${unit}` : NOT_DISCLOSED;
}

/**
 * メーカー公表スペック一覧。products.jsonをsource of truthとし、
 * nullは推測で補完せず「非公表」として扱う。
 */
export function ProductSpecTable({ product }: { product: Product }) {
  const rows: { label: string; value: string }[] = [
    {
      label: "参考価格",
      value: product.referencePrice !== null ? `${product.referencePrice.toLocaleString()}円` : NOT_DISCLOSED,
    },
    {
      label: "現在価格",
      value: product.currentPrice !== null ? `${product.currentPrice.toLocaleString()}円` : "現時点で確認できず",
    },
    { label: "本体サイズ", value: formatDimensions(product.bodyWidthMm, product.bodyDepthMm, product.bodyHeightMm) },
    {
      label: "ステーションサイズ",
      value: formatDimensions(product.stationWidthMm, product.stationDepthMm, product.stationHeightMm),
    },
    { label: "吸引力", value: formatNumber(product.suctionPowerPa, "Pa") },
    { label: "水拭き方式", value: product.moppingType ?? NOT_DISCLOSED },
    { label: "自動ゴミ収集", value: formatBoolean(product.autoEmptying) },
    { label: "モップ自動洗浄", value: formatBoolean(product.autoMopWashing) },
    { label: "モップ自動乾燥", value: formatBoolean(product.autoMopDrying) },
    { label: "絡まり対策", value: product.tangleReduction ?? NOT_DISCLOSED },
    { label: "障害物回避", value: product.obstacleAvoidance ?? NOT_DISCLOSED },
    { label: "マッピング", value: product.mappingType ?? NOT_DISCLOSED },
    { label: "段差乗り越え", value: formatNumber(product.stepClimbingMm, "mm") },
    { label: "最大稼働時間", value: formatNumber(product.maxRuntimeMinutes, "分") },
    {
      label: "運転音",
      value:
        product.noiseLevels && product.noiseLevels.length > 0
          ? product.noiseLevels.map((n) => `${n.mode}: ${n.decibel}dB`).join(" ／ ")
          : NOT_DISCLOSED,
    },
  ];

  return (
    <section className="mb-10">
      <h2 className="mb-3 text-lg font-bold">メーカー公表スペック</h2>
      <dl className="divide-y divide-brand-line rounded-lg border border-brand-line bg-brand-card">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3 text-sm">
            <dt className="text-brand-inkSoft">{row.label}</dt>
            <dd className="text-right font-bold text-brand-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 text-xs text-brand-inkSoft">
        メーカー公式情報で確認できた項目のみ掲載しています。「{NOT_DISCLOSED}」は推測せず未確認として扱っています。
      </p>
    </section>
  );
}
