import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedComparisons } from "@/lib/data";
import { HomeAxisExperience } from "@/components/HomeAxisExperience";
import { ArticleCard } from "@/components/ArticleCard";
import { AxisScoreMethodologyTeaser } from "@/components/product-detail/AxisScoreMethodologyTeaser";

// title/descriptionはlayout.tsxのサイト共通メタデータをそのまま使う。canonicalのみ明示する。
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  // 「比較記事で選ぶ」の説明文は「AXIS SCORE™で商品を比較した記事」と明言しているため、
  // ranking記事のみを対象にする（guide記事はランキングを持たないため、この文言と矛盾してしまう）。
  // ranking記事が9本まで増えたため、トップページはあくまで導線として先頭6件までに絞り、
  // 全件は/articlesで見てもらう（表示件数のみの調整。グリッド自体のレイアウトは変更しない）。
  const articles = getPublishedComparisons()
    .filter((c) => c.articleType === "ranking")
    .slice(0, 6);

  return (
    <div className="space-y-16">
      <section>
        <p className="mb-5 text-xs font-bold uppercase tracking-widest text-brand-accent">
          比較特化型メディア
        </p>
        <h1 className="mb-3 text-5xl font-bold leading-none text-brand-ink">
          えらぶ<span className="text-brand-accent">。</span>
        </h1>
        <p className="mb-8 text-lg font-bold text-brand-accent">くらべて、自分の軸でえらぶ。</p>
        <p className="mb-4 max-w-2xl text-2xl font-bold leading-snug text-brand-ink">
          「結局どっちを選べばいいか」を、比較の軸（AXIS）で答える。
        </p>
        <p className="mb-6 max-w-xl text-brand-inkSoft">
          えらぶ。は、感想やランキングの順位ではなく、清掃性能・静音性・メンテナンス性・住宅適合性・価格対効果という5つの比較軸のAXIS
          SCORE™で、商品選びの結論を出す比較サイトです。現在はロボット掃除機クラスターを展開しています。
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/robot-vacuums"
            className="rounded-full bg-brand-accent px-6 py-3 text-sm font-bold text-brand-bgRaised"
          >
            ロボット掃除機の比較表を見る
          </Link>
          <Link
            href="/articles"
            className="rounded-full border border-brand-line px-6 py-3 text-sm font-bold text-brand-ink"
          >
            比較記事を読む
          </Link>
        </div>
      </section>

      <HomeAxisExperience />

      {articles.length > 0 && (
        <section>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-bold">比較記事で選ぶ</h2>
            <Link href="/articles" className="text-sm font-bold text-brand-accent underline">
              すべての比較記事へ →
            </Link>
          </div>
          <p className="mb-5 text-sm text-brand-inkSoft">
            重視したいポイント別に、AXIS SCORE™で商品を比較した記事です。
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {articles.map((comparison) => (
              <ArticleCard key={comparison.slug} comparison={comparison} />
            ))}
          </div>
        </section>
      )}

      <AxisScoreMethodologyTeaser />
    </div>
  );
}
