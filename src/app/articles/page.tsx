import type { Metadata } from "next";
import { getPublishedComparisons } from "@/lib/data";
import { ArticleCard } from "@/components/ArticleCard";
import { buildPageMetadata } from "@/lib/site-config";

export const metadata: Metadata = buildPageMetadata({
  title: "比較記事一覧 | えらぶ。",
  description:
    "「えらぶ。」の比較記事一覧です。狭い家向け、手入れのしやすさ重視、清掃性能重視など、重視したいポイント別にロボット掃除機をAXIS SCORE™で比較しています。",
  path: "/articles",
});

export default function ArticlesIndexPage() {
  const articles = getPublishedComparisons();

  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-accent">比較記事</p>
      <h1 className="mb-4 text-3xl font-bold">比較記事一覧</h1>
      <p className="mb-10 max-w-2xl text-brand-inkSoft">
        「結局どっちを選べばいいか」を、重視したいポイント別にAXIS SCORE™で比較しています。まず自分の状況に近い記事から読むと、比較表だけでは分かりにくい「なぜその順位なのか」まで理解しやすくなります。
      </p>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((comparison) => (
            <ArticleCard key={comparison.slug} comparison={comparison} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-brand-inkSoft">現在公開中の比較記事はありません。</p>
      )}
    </div>
  );
}
