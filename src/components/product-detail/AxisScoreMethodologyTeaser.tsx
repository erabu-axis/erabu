import Link from "next/link";

/** AXIS SCORE™の評価方法についての簡単な説明と、詳細な解説ページ（/about-axis-score）への導線。 */
export function AxisScoreMethodologyTeaser() {
  return (
    <section className="mb-4 rounded-lg border border-dashed border-brand-line p-5 text-xs text-brand-inkSoft">
      <h2 className="mb-1 text-sm font-bold text-brand-ink">AXIS SCORE™について</h2>
      <p>
        AXIS SCORE™は、清掃性能・静音性・メンテナンス性・住宅適合性・価格対効果の5つの軸を、編集部がメーカー公式情報など一次情報のみをもとに採点する独自指標です。評価情報が十分に確認できない軸は「評価情報不足」として区別し、確認できていない事実を推測で補うことはありません。
      </p>
      <Link href="/about-axis-score" className="mt-2 inline-block font-bold text-brand-accent underline">
        AXIS SCORE™の評価方法をくわしく見る →
      </Link>
    </section>
  );
}
