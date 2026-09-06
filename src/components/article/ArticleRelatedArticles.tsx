import Link from "next/link";
import { getComparison } from "@/lib/data";

/**
 * 比較記事テンプレートv1.0の関連記事欄。comparisons.jsonのrelatedSlugsに登録された
 * 他記事へのリンクを表示する。status!=="published"の記事や存在しないslugは除外する。
 */
export function ArticleRelatedArticles({ slugs }: { slugs: string[] }) {
  const related = slugs
    .map((slug) => getComparison(slug))
    .filter((c): c is NonNullable<typeof c> => !!c && c.status === "published");

  if (related.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="mb-3 text-lg font-bold">関連記事</h2>
      <ul className="space-y-2">
        {related.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/articles/${c.slug}`}
              className="block rounded-lg border border-brand-line bg-brand-card px-4 py-3 font-bold text-brand-accent underline hover:no-underline"
            >
              {c.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
