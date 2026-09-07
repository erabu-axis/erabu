import type { Metadata } from "next";
import Link from "next/link";
import {
  axisDefinitions,
  getAxisLeaders,
  getComparison,
  getProductAxisScores,
  getProductsWithScores,
  getProfile,
  getSortableScore,
} from "@/lib/data";
import { getHighlightAxis } from "@/lib/axisScore";
import { formatCriterionCell, formatWeightPct } from "@/lib/article";
import type { AxisKey } from "@/types/axis";
import { ComparisonTable } from "@/components/ComparisonTable";
import { ArticleRankingGroups } from "@/components/article/ArticleRankingGroups";
import { ArticleWhyThisRanking } from "@/components/article/ArticleWhyThisRanking";
import { ArticleProductEvaluationCards } from "@/components/article/ArticleProductEvaluationCards";
import { ArticleRelatedArticles } from "@/components/article/ArticleRelatedArticles";
import { CompareWithOthers } from "@/components/product-detail/CompareWithOthers";
import { AxisScoreMethodologyTeaser } from "@/components/product-detail/AxisScoreMethodologyTeaser";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { buildPageMetadata } from "@/lib/site-config";

const SLUG = "robot-vacuum-cost-value";

/** 「コスパ重視」既存persona（axisScoreProfiles.json: id="cost-value"）をそのまま使う。新しいweightは作らない。 */
const PROFILE_ID = "cost-value";

/** 「条件別に選ぶなら」で見せるAXIS。quietnessは今回対象5商品中で未公表の商品が多くconfirmedなリーダーが出にくいため対象外（既存記事と同じ基準）。 */
const LEADER_AXES: AxisKey[] = ["cleaning_power", "maintainability", "price_value", "space_fit"];

/**
 * 価格対効果を構成する既存criteria全体。新しいcriterionは作らず、
 * axisDefinitions.jsonのprice_value（rubricVersion 1.0）に実在するidだけを参照する。
 * price_valueの採点自体はreferencePriceベースであり、ここでの再算出は一切行わない。
 */
const COST_VALUE_CRITERIA: { axisKey: AxisKey; id: string }[] = [
  { axisKey: "price_value", id: "product_price" },
  { axisKey: "price_value", id: "cleaning_value" },
  { axisKey: "price_value", id: "automation_value" },
  { axisKey: "price_value", id: "fit_convenience_value" },
];

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "コスパで選ぶロボット掃除機5選｜価格と性能のバランスを比較 | えらぶ。",
    description:
      "コスパの良いロボット掃除機は「安い商品」とは限りません。「えらぶ。」では価格対効果（price_value）の重みを高くしたAXIS SCORE™で、価格に対して清掃性能・自動化機能・住宅適合性がどれだけ揃っているかを比較しました。",
    path: `/articles/${SLUG}`,
  });
}

export default function CostValueArticlePage() {
  const comparison = getComparison(SLUG);
  const profile = getProfile(PROFILE_ID);
  const highlightAxis = getHighlightAxis(profile);

  // 既存のcalculateDisplayAwareAxisScore・getSortableScoreをそのまま使い、
  // 「コスパ重視」persona weightでリアル5商品を再計算・並び替える。数値のハードコードはしない。
  // price_value自体のスコアはreferencePriceベースのAXIS SCORE™公式採点基準（rubricVersion 1.0）のままで、
  // currentPrice（現在価格）を使った再計算は行わない。
  const items = [...getProductsWithScores(PROFILE_ID)].sort(
    (a, b) => getSortableScore(b) - getSortableScore(a)
  );

  const axisLeaders = getAxisLeaders("", LEADER_AXES);

  const priceValueDef = axisDefinitions.find((d) => d.axisKey === "price_value");
  const priceValueWeightPct = formatWeightPct(profile.weights.price_value);
  const otherAxisWeightPct = formatWeightPct(profile.weights.cleaning_power);

  return (
    <article className="max-w-3xl">
      <Breadcrumbs
        items={[
          { label: "ホーム", href: "/" },
          { label: "比較記事", href: "/articles" },
          { label: comparison?.title ?? "コスパで選ぶロボット掃除機5選" },
        ]}
      />

      {/* ① ファーストビュー */}
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-accent">比較記事</p>
      <h1 className="mb-4 text-3xl font-bold">
        {comparison?.title ?? "コスパで選ぶロボット掃除機5選｜価格と性能のバランスを比較"}
      </h1>
      <div className="mb-10 space-y-3 text-brand-inkSoft">
        <p>
          「コスパが良い」とは、単に価格が安いことではありません。支払う価格に対して、清掃性能・自動化機能・住宅適合性といった面でどれだけ価値のある内容を得られるかで考える必要があります。
        </p>
        <p>
          「えらぶ。」では今回、AXIS SCORE™の5軸のうち「価格対効果」の重みを高くした比較を行い、価格と性能のバランスを重視して5商品を比較しました。価格対効果のスコアは、参考価格をもとにしたAXIS SCORE™公式採点基準（rubricVersion 1.0）でそのまま算出しており、本記事のために計算方法を変えてはいません。
        </p>
      </div>

      {/* ② 先に結論 */}
      <ArticleRankingGroups
        items={items}
        heading="先に結論：コスパ重視の人向けランキング"
        personaName="コスパ重視"
        axisDefinitions={axisDefinitions}
      />

      {/* ③ 比較表 */}
      <section className="mb-10">
        <h2 className="mb-2 text-lg font-bold">比較表</h2>
        <ComparisonTable items={items} axisDefinitions={axisDefinitions} />
      </section>

      {/* ④ なぜこの順位？ */}
      <ArticleWhyThisRanking
        primaryAxisLabel={priceValueDef?.label ?? "価格対効果"}
        primaryAxisWeightPct={priceValueWeightPct}
        otherAxisWeightPct={otherAxisWeightPct}
        reasonSentence="コスパを重視する場合、価格に対してどれだけの性能・機能が揃っているかを特に重視しています。"
      />

      {/* ⑤ 価格対効果を構成する4つの項目 */}
      <section className="mb-10">
        <h2 className="mb-2 text-lg font-bold">価格対効果を構成する4つの項目</h2>
        <p className="mb-4 text-sm text-brand-inkSoft">
          {priceValueDef?.label ?? "価格対効果"}
          AXISは、価格そのものだけでなく、価格に対して清掃性能・自動化機能・住宅適合性がどれだけ揃っているかを含む4つの項目で構成されています。今回比較した5商品のスコア（獲得点／配点）をまとめました。
        </p>
        <div className="overflow-x-auto rounded-lg border border-brand-line bg-brand-card">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="bg-brand-bgRaised text-left text-brand-inkSoft">
                <th className="px-4 py-3 font-bold">項目</th>
                {items.map((item) => (
                  <th key={item.product.id} className="whitespace-nowrap px-4 py-3 font-bold">
                    {item.product.brand}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COST_VALUE_CRITERIA.map((target) => {
                const criterionDef = priceValueDef?.criteria.find((c) => c.id === target.id);
                return (
                  <tr key={target.id} className="border-t border-brand-line align-top">
                    <td className="px-4 py-3 font-bold text-brand-ink">{criterionDef?.label ?? target.id}</td>
                    {items.map((item) => {
                      const scores = getProductAxisScores(item.product.id);
                      const axisEntry = scores?.scores.find((s) => s.axisKey === "price_value");
                      const criterion = axisEntry?.criteria.find((c) => c.id === target.id);
                      const display = formatCriterionCell(criterion);
                      return (
                        <td key={item.product.id} className="px-4 py-3 tabular-nums text-brand-inkSoft">
                          {display}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-brand-inkSoft">
          「製品価格」は参考価格をもとに、価格帯が上がるほど得点が下がる形で採点しています。残る3項目は、その価格帯に対して清掃性能・自動化機能・住宅適合性がどれだけ揃っているかを見る項目で、価格が高い商品でも、揃っている機能が多ければ高い得点になります。
        </p>
      </section>

      {/* ⑥ 商品別評価 */}
      <ArticleProductEvaluationCards items={items} highlightAxis={highlightAxis} axisDefinitions={axisDefinitions} />

      {/* ⑦ 条件別に選ぶなら */}
      <CompareWithOthers
        leaders={axisLeaders}
        axisDefinitions={axisDefinitions}
        heading="条件別に選ぶなら"
        labelSuffix="を最優先するなら"
      />

      {/* ⑧ コスパで選ぶときの注意点 */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">コスパで選ぶときの注意点</h2>
        <ul className="list-inside list-disc space-y-2 text-sm text-brand-inkSoft">
          <li>「安い＝コスパが良い」ではありません。価格に対してどれだけの機能・性能が揃っているかで判断しましょう。</li>
          <li>
            商品ページの価格表記が、比較の基準にしている参考価格か、セール等で変動する現在価格かを確認しましょう。各商品の現在価格は、商品別評価のカードで参考情報として掲載しています。
          </li>
          <li>
            清掃性能や手入れの手間など、特定の軸を最優先したい場合は、
            <Link href="/articles/robot-vacuum-cleaning-performance" className="mx-1 font-bold text-brand-accent underline">
              清掃性能で選ぶロボット掃除機5選
            </Link>
            や
            <Link href="/articles/robot-vacuum-low-maintenance" className="mx-1 font-bold text-brand-accent underline">
              手入れが楽なロボット掃除機5選
            </Link>
            もあわせてご覧ください。
          </li>
          <li>
            予算と手入れの手間の両方が気になる一人暮らしの方は、
            <Link href="/articles/robot-vacuum-solo-living" className="mx-1 font-bold text-brand-accent underline">
              一人暮らし向けロボット掃除機5選
            </Link>
            も参考になります。
          </li>
        </ul>
      </section>

      {/* ⑨ AXIS SCORE™について */}
      <AxisScoreMethodologyTeaser />

      {/* 関連記事 */}
      <ArticleRelatedArticles slugs={comparison?.relatedSlugs ?? []} />

      {/* ⑩ 情報について */}
      <section className="mb-4 text-xs text-brand-inkSoft">
        <p>最終確認日：{comparison?.updatedAt ?? "-"}（本記事の比較対象・本文の確認日）</p>
        <p className="mt-1">価格は各商品の確認日時点のものです。商品仕様はメーカー公式情報を優先して掲載しています。</p>
        <p className="mt-1">価格・仕様は今後変更される可能性があります。最新情報は各商品の詳細ページ、またはメーカー公式サイトでご確認ください。</p>
        <p className="mt-1">現時点でアフィリエイトリンクは設定していません。購入先は各商品詳細ページのメーカー公式サイトリンクをご利用ください。</p>
      </section>
    </article>
  );
}
