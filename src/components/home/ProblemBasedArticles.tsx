import Link from "next/link";
import { getComparison } from "@/lib/data";

/**
 * 「悩みから選ぶ」の入口。存在しない記事・未公開の2機種比較記事は作らず、
 * 現在公開済みのslugだけを対象にする。タイトル・確認日はcomparisons.jsonから取得し、
 * 本文への二重ハードコードはしない（悩みラベルだけがこのコンポーネント固有の文言）。
 */
const PROBLEM_LINKS: { label: string; slug: string }[] = [
  { label: "置き場所", slug: "robot-vacuum-narrow-room" },
  { label: "手入れ", slug: "robot-vacuum-low-maintenance" },
  { label: "予算", slug: "robot-vacuum-cost-value" },
  { label: "水拭き", slug: "robot-vacuum-mopping" },
  { label: "静音性", slug: "robot-vacuum-quietness" },
  { label: "清掃性能", slug: "robot-vacuum-cleaning-performance" },
];

export function ProblemBasedArticles() {
  const items = PROBLEM_LINKS.map(({ label, slug }) => ({ label, comparison: getComparison(slug) })).filter(
    (i): i is { label: string; comparison: NonNullable<ReturnType<typeof getComparison>> } => !!i.comparison
  );

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="problem-articles-heading">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="problem-articles-heading" className="text-xl font-bold text-canvas-ink">
          悩みから選ぶ
        </h2>
        <Link
          href="/articles"
          className="text-sm font-bold text-canvas-primary underline decoration-canvas-primary/40 underline-offset-2 hover:text-canvas-primaryHover"
        >
          すべての比較記事へ →
        </Link>
      </div>
      {/* スマホ（sm未満）は2列カードではなく1列のコンパクトなリストにし、タイトルの横幅を確保する。 */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
        {items.map(({ label, comparison }) => (
          <Link
            key={comparison.slug}
            href={`/articles/${comparison.slug}`}
            className="group rounded-xl border border-canvas-line bg-canvas-card p-3 transition-colors duration-150 hover:border-canvas-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas-primary sm:p-4"
          >
            <p className="mb-1.5 inline-block rounded-full bg-canvas-accentSoft px-2.5 py-1 text-[11px] font-bold text-canvas-ink">
              {label}で悩んでいる人へ
            </p>
            <p className="text-sm font-bold leading-snug text-canvas-ink group-hover:text-canvas-primary">
              {comparison.title}
            </p>
            <p className="mt-2 text-[11px] text-canvas-inkSoft">最終確認日：{comparison.updatedAt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
