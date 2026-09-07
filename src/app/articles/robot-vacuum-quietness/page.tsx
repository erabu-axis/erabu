import type { Metadata } from "next";
import Link from "next/link";
import {
  axisDefinitions,
  getAxisLeaders,
  getComparison,
  getProductAxisScores,
  getProductsWithScores,
} from "@/lib/data";
import { AxisScoreValue } from "@/components/AxisScoreValue";
import { ProductImage } from "@/components/ProductImage";
import { PurchaseButtons } from "@/components/PurchaseButtons";
import type { AxisKey } from "@/types/axis";
import { ComparisonTable } from "@/components/ComparisonTable";
import { ArticleRelatedArticles } from "@/components/article/ArticleRelatedArticles";
import { CompareWithOthers } from "@/components/product-detail/CompareWithOthers";
import { AxisScoreMethodologyTeaser } from "@/components/product-detail/AxisScoreMethodologyTeaser";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { buildPageMetadata } from "@/lib/site-config";

const SLUG = "robot-vacuum-quietness";

/** 「子どもが寝ている間に使いたい」既存persona（axisScoreProfiles.json: id="sleeping-kids"）をそのまま使う。新しいweightは作らない。 */
const PROFILE_ID = "sleeping-kids";

/** 「条件別に選ぶなら」で見せるAXIS。quietnessは今回対象5商品中でconfirmedが2商品にとどまり、残り3商品は評価情報不足のため対象外のまま（既存記事と同じ基準）。 */
const LEADER_AXES: AxisKey[] = ["cleaning_power", "maintainability", "price_value", "space_fit"];

function QuietnessProductCard({ item }: { item: ReturnType<typeof getProductsWithScores>[number] }) {
  const breakdown = item.displayAwareResult?.breakdown.find((b) => b.axisKey === "quietness");
  const scores = getProductAxisScores(item.product.id);
  const quietnessEntry = scores?.scores.find((s) => s.axisKey === "quietness");
  if (!breakdown || !quietnessEntry) return null;
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-brand-line bg-brand-card p-4 sm:flex-row sm:items-start sm:gap-4">
      <div className="flex items-center gap-3 sm:w-56 sm:flex-none">
        <ProductImage product={item.product} aspect="aspect-square" className="w-12" sizes="48px" />
        <div className="min-w-0">
          <p className="truncate text-xs font-bold uppercase tracking-wide text-brand-accent2">{item.product.brand}</p>
          <Link
            href={`/robot-vacuums/${item.product.id}`}
            className="font-bold text-brand-ink hover:text-brand-accent hover:underline"
          >
            {item.product.name}
          </Link>
        </div>
      </div>
      <div className="flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-xs font-bold text-brand-inkSoft">静音性AXIS：</span>
          <AxisScoreValue normalizedScore={breakdown.normalizedScore} scoreDisplayStatus={breakdown.scoreDisplayStatus} />
        </div>
        {quietnessEntry.publicRationale && <p className="text-sm text-brand-inkSoft">{quietnessEntry.publicRationale}</p>}
        <div className="mt-3">
          <PurchaseButtons product={item.product} pageType="article" articleId={SLUG} placement="article_card" />
        </div>
      </div>
    </div>
  );
}

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "静かなロボット掃除機を選ぶには｜運転音データの公表状況で比較 | えらぶ。",
    description:
      "ロボット掃除機の運転音（dB）は、メーカーによって公表状況が大きく異なります。「えらぶ。」では公式に確認できる運転音・静音モードのデータを商品ごとに整理しました。数値が非公表の商品を「静音性が低い」と判断することはしていません。",
    path: `/articles/${SLUG}`,
  });
}

export default function QuietnessArticlePage() {
  const comparison = getComparison(SLUG);

  // 「静音性を重視した総合スコア」自体は既存のcalculateDisplayAwareAxisScoreで算出するが、
  // 数値のハードコードはしない。quietness AXIS単体のscoreDisplayStatusで2グループに分ける：
  // confirmed（運転音データを比較できる商品）と、それ以外（情報不足の商品）。
  // 前者はconfirmed同士の実データなのでnormalizedScore順に並べてよいが、
  // 後者は横並び比較ができないため、products.jsonの並び順のまま示す（順位があるという誤った印象を避ける）。
  const items = getProductsWithScores(PROFILE_ID);
  const confirmedItems = items
    .filter((item) => item.displayAwareResult?.breakdown.find((b) => b.axisKey === "quietness")?.scoreDisplayStatus === "confirmed")
    .sort((a, b) => {
      const scoreA = a.displayAwareResult?.breakdown.find((x) => x.axisKey === "quietness")?.normalizedScore ?? 0;
      const scoreB = b.displayAwareResult?.breakdown.find((x) => x.axisKey === "quietness")?.normalizedScore ?? 0;
      return scoreB - scoreA;
    });
  const otherItems = items.filter(
    (item) => item.displayAwareResult?.breakdown.find((b) => b.axisKey === "quietness")?.scoreDisplayStatus !== "confirmed"
  );

  const axisLeaders = getAxisLeaders("", LEADER_AXES);

  const quietnessDef = axisDefinitions.find((d) => d.axisKey === "quietness");

  return (
    <article className="max-w-3xl">
      <Breadcrumbs
        items={[
          { label: "ホーム", href: "/" },
          { label: "比較記事", href: "/articles" },
          { label: comparison?.title ?? "静かなロボット掃除機を選ぶには" },
        ]}
      />

      {/* ① ファーストビュー */}
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-accent">比較記事</p>
      <h1 className="mb-4 text-3xl font-bold">
        {comparison?.title ?? "静かなロボット掃除機を選ぶには｜運転音データの公表状況で比較"}
      </h1>
      <div className="mb-10 space-y-3 text-brand-inkSoft">
        <p>
          夜間や在宅ワーク中に使いたい場合、運転音は気になるポイントです。ただし、ロボット掃除機の運転音（dB）は、メーカーによって公表状況が大きく異なります。今回比較した5商品のうち、本体清掃音の具体的な数値を公式に確認できたのは2商品でした。
        </p>
        <p>
          このページは「静かな順にならべた5選ランキング」ではありません。数値が非公表の商品を推測で「静か」または「うるさい」と判断することはせず、公式情報で確認できる範囲を商品ごとに整理したうえで、参考としてAXIS SCORE™の静音性重視の総合評価もあわせて紹介します。
        </p>
      </div>

      {/* ② 商品別に見る運転音データ */}
      <section className="mb-10">
        <h2 className="mb-1 text-xl font-bold">商品別に見る運転音データ</h2>
        <p className="mb-4 text-sm text-brand-inkSoft">
          {quietnessDef?.label ?? "静音性"}
          AXISの評価は、本体清掃音（配点60、必須項目）を含む3つの項目で構成されています。本体清掃音の数値が公式に確認できない商品は、この項目が「評価情報不足」として扱われ、静音性の総合評価には含めていません。
        </p>

        <h3 className="mb-3 text-sm font-bold text-brand-ink">運転音データを比較できる商品</h3>
        <p className="mb-3 text-xs text-brand-inkSoft">
          いずれも本体清掃音の公表値は60dB以上の帯にあり、採点基準上「静音性が高い」とされる水準（50dB未満）には届いていません。2商品を比べると、ステーション動作音まで具体的な数値が確認できる分、静音性AXISのスコアはSwitchBot お掃除ロボットS20の方が高くなっています。
        </p>
        <div className="mb-6 space-y-4">
          {confirmedItems.map((item) => (
            <QuietnessProductCard key={item.product.id} item={item} />
          ))}
        </div>

        <h3 className="mb-3 text-sm font-bold text-brand-ink">本体清掃音が非公表で情報不足の商品</h3>
        <div className="space-y-4">
          {otherItems.map((item) => (
            <QuietnessProductCard key={item.product.id} item={item} />
          ))}
        </div>
      </section>

      {/* ③ 参考：静音性を重視したAXIS SCORE™比較表 */}
      <section className="mb-10">
        <h2 className="mb-2 text-lg font-bold">参考：静音性を重視したAXIS SCORE™比較表</h2>
        <p className="mb-4 text-sm text-brand-inkSoft">
          「子どもが寝ている間に使いたい」persona（静音性の重みを50%）で算出したAXIS SCORE™です。静音性AXISの評価情報が総合スコアに占める割合が大きいため、本体清掃音を公式に確認できた2商品は総合スコアも「確定」として表示される一方、非公表の3商品は総合スコア自体も「評価情報不足」として扱われます。これは静音性が低いという判定ではなく、評価に必要な情報が確認できていないことを意味します。
        </p>
        <ComparisonTable items={items} axisDefinitions={axisDefinitions} />
      </section>

      {/* ④ 条件別に選ぶなら */}
      <CompareWithOthers
        leaders={axisLeaders}
        axisDefinitions={axisDefinitions}
        heading="条件別に選ぶなら"
        labelSuffix="を最優先するなら"
      />

      {/* ⑤ 静音性を確認する際の注意点 */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">静音性を確認する際の注意点</h2>
        <ul className="list-inside list-disc space-y-2 text-sm text-brand-inkSoft">
          <li>運転音の数値が非公表だからといって、その商品が「うるさい」とは限りません。公式情報で確認できていないだけの場合があります。</li>
          <li>
            「静音モード」という名称が明記されていても、独立した専用モードなのか、通常運転の一部を言い換えているだけなのかを、記載だけでは判断できない場合があります。名称だけで判断せず、モードの内容が具体的に説明されているかを確認しましょう。
          </li>
          <li>
            本体の清掃音と、ステーション（自動ゴミ収集・モップ洗浄乾燥）の動作音は別の項目です。ステーションは深夜に自動で動作することもあるため、両方を分けて確認しておくと安心です。
          </li>
          <li>メーカーが公表しているdB値であっても、測定条件（距離・モードなど）が記載されているかまで確認すると、より正確に比較できます。</li>
        </ul>
        <p className="mt-4 text-sm text-brand-inkSoft">
          5つのAXIS全体の考え方や、購入前に確認しておきたい基本的なポイントは、
          <Link href="/articles/robot-vacuum-how-to-choose" className="mx-1 font-bold text-brand-accent underline">
            ロボット掃除機で後悔しない選び方
          </Link>
          でも解説しています。
        </p>
      </section>

      {/* ⑥ AXIS SCORE™について */}
      <AxisScoreMethodologyTeaser />

      {/* 関連記事 */}
      <ArticleRelatedArticles slugs={comparison?.relatedSlugs ?? []} />

      {/* ⑦ 情報について */}
      <section className="mb-4 text-xs text-brand-inkSoft">
        <p>最終確認日：{comparison?.updatedAt ?? "-"}（本記事の比較対象・本文の確認日）</p>
        <p className="mt-1">価格は各商品の確認日時点のものです。商品仕様はメーカー公式情報を優先して掲載しています。</p>
        <p className="mt-1">価格・仕様は今後変更される可能性があります。最新情報は各商品の詳細ページ、またはメーカー公式サイトでご確認ください。</p>
        <p className="mt-1">現時点でアフィリエイトリンクは設定していません。購入先は各商品詳細ページのメーカー公式サイトリンクをご利用ください。</p>
      </section>
    </article>
  );
}
