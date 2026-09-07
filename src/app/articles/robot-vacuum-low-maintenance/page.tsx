import type { Metadata } from "next";
import {
  axisDefinitions,
  getAxisLeaders,
  getComparison,
  getProductsWithScores,
  getProfile,
  getSortableScore,
} from "@/lib/data";
import { getHighlightAxis } from "@/lib/axisScore";
import { formatWeightPct } from "@/lib/article";
import type { AxisKey } from "@/types/axis";
import { ComparisonTable } from "@/components/ComparisonTable";
import { ArticleRankingGroups } from "@/components/article/ArticleRankingGroups";
import { ArticleWhyThisRanking } from "@/components/article/ArticleWhyThisRanking";
import { ArticleProductEvaluationCards } from "@/components/article/ArticleProductEvaluationCards";
import { CompareWithOthers } from "@/components/product-detail/CompareWithOthers";
import { AxisScoreMethodologyTeaser } from "@/components/product-detail/AxisScoreMethodologyTeaser";
import { ArticleRelatedArticles } from "@/components/article/ArticleRelatedArticles";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { buildPageMetadata } from "@/lib/site-config";
import { AmazonAssociatesDisclosure } from "@/components/AmazonAssociatesDisclosure";
import { ArticleAffiliateFooterNote } from "@/components/article/ArticleAffiliateFooterNote";
import { hasAnyEnabledAffiliateLink, hasAnyEnabledAffiliateProvider } from "@/lib/affiliateStatus";

const SLUG = "robot-vacuum-low-maintenance";

/** 「手入れをなるべくしたくない」既存persona（axisScoreProfiles.json: id="low-maintenance"）をそのまま使う。新しいweightは作らない。 */
const PROFILE_ID = "low-maintenance";

/** ⑥「条件別に選ぶなら」で見せるAXIS。quietnessは今回対象5商品中で未公表の商品が多くconfirmedなリーダーが出にくいため対象外（1本目と同じ基準）。 */
const LEADER_AXES: AxisKey[] = ["cleaning_power", "maintainability", "price_value", "space_fit"];

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "手入れが楽なロボット掃除機5選｜ゴミ収集・モップ洗浄まで比較 | えらぶ。",
    description:
      "自動ゴミ収集、モップの自動洗浄・自動乾燥、髪の毛の絡まり対策などを含め、手入れのしやすさを重視してロボット掃除機5商品を比較しました。ステーション自体の手入れのしやすさまで確認できる商品を中心に紹介します。",
    path: `/articles/${SLUG}`,
  });
}

export default function LowMaintenanceArticlePage() {
  const comparison = getComparison(SLUG);
  const profile = getProfile(PROFILE_ID);
  const highlightAxis = getHighlightAxis(profile);

  // 既存のcalculateDisplayAwareAxisScore・getSortableScoreをそのまま使い、
  // 「手入れをなるべくしたくない」persona weightでリアル5商品を再計算・並び替える。数値のハードコードはしない。
  const items = [...getProductsWithScores(PROFILE_ID)].sort(
    (a, b) => getSortableScore(b) - getSortableScore(a)
  );

  // 「他の候補と迷ったら」と同じgetAxisLeadersを、除外商品なし（全商品が候補）で呼ぶだけ。新しい推薦ロジックは作らない。
  const axisLeaders = getAxisLeaders("", LEADER_AXES);

  const maintainabilityDef = axisDefinitions.find((d) => d.axisKey === "maintainability");
  const maintainabilityWeightPct = formatWeightPct(profile.weights.maintainability);
  const otherAxisWeightPct = formatWeightPct(profile.weights.cleaning_power);
  // メンテナンス性の評価項目は、axisDefinitions.jsonのcriteriaラベルから組み立てる（本文への手入力はしない）。
  const maintainabilityCriteriaLabels = maintainabilityDef?.criteria.map((c) => c.label).join("・") ?? "";

  return (
    <article className="max-w-3xl">
      <Breadcrumbs
        items={[
          { label: "ホーム", href: "/" },
          { label: "比較記事", href: "/articles" },
          { label: comparison?.title ?? "手入れが楽なロボット掃除機5選" },
        ]}
      />
      {hasAnyEnabledAffiliateProvider(items, "amazon") && <AmazonAssociatesDisclosure />}
      {/* ① ファーストビュー */}
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-accent">比較記事</p>
      <h1 className="mb-4 text-3xl font-bold">
        {comparison?.title ?? "手入れが楽なロボット掃除機5選｜ゴミ収集・モップ洗浄まで比較"}
      </h1>
      <div className="mb-10 space-y-3 text-brand-inkSoft">
        <p>
          ロボット掃除機を買っても、本体やステーションの手入れに時間がかかってしまうと、家事の負担は十分に減りません。特に自動ゴミ収集の有無、モップの自動洗浄・自動乾燥、ブラシに絡まった髪の毛への対策、ステーション自体の手入れのしやすさは、日々の使い勝手を大きく左右するポイントです。
        </p>
        <p>
          「えらぶ。」では今回、AXIS SCORE™の5軸のうち「メンテナンス性」の重みを高くした比較を行い、共働き・子育てなどで家事時間を減らしたい人向けに、手入れの手間の少なさを重視して5商品を比較しました。
        </p>
      </div>

      {/* ② 先に結論 */}
      <ArticleRankingGroups
        items={items}
        heading="先に結論：手入れが楽な順ランキング"
        personaName="手入れをなるべくしたくない"
        axisDefinitions={axisDefinitions}
      />

      {/* ③ 比較表 */}
      <section className="mb-10">
        <h2 className="mb-2 text-lg font-bold">比較表</h2>
        {comparison?.selectionCriteria && (
          <p className="mb-4 text-xs text-brand-inkSoft">{comparison.selectionCriteria}</p>
        )}
        <ComparisonTable items={items} axisDefinitions={axisDefinitions} />
      </section>

      {/* ④ なぜこの順位？ */}
      <ArticleWhyThisRanking
        primaryAxisLabel={maintainabilityDef?.label ?? "メンテナンス性"}
        primaryAxisWeightPct={maintainabilityWeightPct}
        otherAxisWeightPct={otherAxisWeightPct}
        reasonSentence="手入れの手間は日々の家事負担に直結するため、この軸を特に重視しています。"
        axisDetailSentence={
          maintainabilityCriteriaLabels
            ? `メンテナンス性では、${maintainabilityCriteriaLabels}を、公式に確認できた範囲で評価しています。`
            : undefined
        }
      />

      {/* ⑤ 商品別評価 */}
      <ArticleProductEvaluationCards items={items} highlightAxis={highlightAxis} axisDefinitions={axisDefinitions} articleId={SLUG} />

      {/* ⑥ 条件別に選ぶなら */}
      <CompareWithOthers
        leaders={axisLeaders}
        axisDefinitions={axisDefinitions}
        heading="条件別に選ぶなら"
        labelSuffix="を最優先するなら"
      />

      {/* ⑦ 手入れが楽なロボット掃除機の選び方 */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">手入れが楽なロボット掃除機の選び方</h2>
        <ul className="list-inside list-disc space-y-2 text-sm text-brand-inkSoft">
          <li>自動ゴミ収集の有無を確認する。ステーションが本体のゴミを吸い上げてくれるかで、ゴミ捨ての頻度が大きく変わります。</li>
          <li>モップ自動洗浄の有無・方式を確認する。水拭きモードを使う場合、モップを毎回手洗いしなくて済むかがポイントです。</li>
          <li>モップ自動乾燥の有無を確認する。生乾きのまま放置すると匂いの原因になりやすいため、自動乾燥機能があると手間が減ります。</li>
          <li>ブラシへの毛絡み対策を確認する。髪の毛やペットの毛が気になる家庭では、絡まりにくい構造かどうかで手入れ頻度が変わります。</li>
          <li>ステーション自体の手入れのしやすさも確認する。給水タンクの補充やダストパックの交換、ステーション内部の清掃頻度も含めて考えましょう。</li>
        </ul>
      </section>

      {/* ⑧ AXIS SCORE™について */}
      <AxisScoreMethodologyTeaser />

      {/* 関連記事 */}
      <ArticleRelatedArticles slugs={comparison?.relatedSlugs ?? []} />

      {/* ⑨ 情報について */}
      <section className="mb-4 text-xs text-brand-inkSoft">
        <p>最終確認日：{comparison?.updatedAt ?? "-"}（本記事の比較対象・本文の確認日）</p>
        <p className="mt-1">価格は各商品の確認日時点のものです。商品仕様はメーカー公式情報を優先して掲載しています。</p>
        <p className="mt-1">価格・仕様は今後変更される可能性があります。最新情報は各商品の詳細ページ、またはメーカー公式サイトでご確認ください。</p>
        <ArticleAffiliateFooterNote hasAffiliateLink={hasAnyEnabledAffiliateLink(items)} />
      </section>
    </article>
  );
}
