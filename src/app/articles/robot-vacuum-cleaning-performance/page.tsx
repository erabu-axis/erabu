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

const SLUG = "robot-vacuum-cleaning-performance";

/** 「とにかく性能重視」既存persona（axisScoreProfiles.json: id="performance-first"）をそのまま使う。新しいweightは作らない。 */
const PROFILE_ID = "performance-first";

/** ⑥「条件別に選ぶなら」で見せるAXIS。quietnessは今回対象5商品中で未公表の商品が多くconfirmedなリーダーが出にくいため対象外（既存2記事と同じ基準）。 */
const LEADER_AXES: AxisKey[] = ["cleaning_power", "maintainability", "price_value", "space_fit"];

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "清掃性能で選ぶロボット掃除機5選｜吸引・水拭き・絡まり対策まで比較 | えらぶ。",
    description:
      "吸引力だけでなく、水拭き、壁際・角、カーペット、髪の毛の絡まり対策なども含めて、清掃性能を重視してロボット掃除機5商品を比較しました。多少価格が高くても性能を優先したい人向けの比較です。",
    path: `/articles/${SLUG}`,
  });
}

export default function CleaningPerformanceArticlePage() {
  const comparison = getComparison(SLUG);
  const profile = getProfile(PROFILE_ID);
  const highlightAxis = getHighlightAxis(profile);

  // 既存のcalculateDisplayAwareAxisScore・getSortableScoreをそのまま使い、
  // 「とにかく性能重視」persona weightでリアル5商品を再計算・並び替える。数値のハードコードはしない。
  const items = [...getProductsWithScores(PROFILE_ID)].sort(
    (a, b) => getSortableScore(b) - getSortableScore(a)
  );

  // 「他の候補と迷ったら」と同じgetAxisLeadersを、除外商品なし（全商品が候補）で呼ぶだけ。新しい推薦ロジックは作らない。
  const axisLeaders = getAxisLeaders("", LEADER_AXES);

  const cleaningPowerDef = axisDefinitions.find((d) => d.axisKey === "cleaning_power");
  const cleaningPowerWeightPct = formatWeightPct(profile.weights.cleaning_power);
  const otherAxisWeightPct = formatWeightPct(profile.weights.maintainability);
  // 清掃性能の評価項目は、axisDefinitions.jsonのcriteriaラベルから組み立てる（本文への手入力はしない）。
  const cleaningPowerCriteriaLabels = cleaningPowerDef?.criteria.map((c) => c.label).join("・") ?? "";

  return (
    <article className="max-w-3xl">
      <Breadcrumbs
        items={[
          { label: "ホーム", href: "/" },
          { label: "比較記事", href: "/articles" },
          { label: comparison?.title ?? "清掃性能で選ぶロボット掃除機5選" },
        ]}
      />
      {hasAnyEnabledAffiliateProvider(items, "amazon") && <AmazonAssociatesDisclosure />}
      {/* ① ファーストビュー */}
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-accent">比較記事</p>
      <h1 className="mb-4 text-3xl font-bold">
        {comparison?.title ?? "清掃性能で選ぶロボット掃除機5選｜吸引・水拭き・絡まり対策まで比較"}
      </h1>
      <div className="mb-10 space-y-3 text-brand-inkSoft">
        <p>
          吸引力の数値（Pa値）だけでは、ロボット掃除機の清掃性能を判断できません。メーカーによっては吸引力の絶対値を公表していない場合もありますが、それだけを理由に清掃性能が低いとは限らないためです。
        </p>
        <p>
          「えらぶ。」では清掃性能について、{cleaningPowerCriteriaLabels}
          という複数の観点から、公式情報をもとに評価しています。今回はAXIS SCORE™の5軸のうち「清掃性能」の重みを高くした比較を行い、価格より性能を優先したい人向けに5商品を比較しました。
        </p>
      </div>

      {/* ② 先に結論 */}
      <ArticleRankingGroups
        items={items}
        heading="先に結論：清掃性能を重視した順ランキング"
        personaName="とにかく性能重視"
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
        primaryAxisLabel={cleaningPowerDef?.label ?? "清掃性能"}
        primaryAxisWeightPct={cleaningPowerWeightPct}
        otherAxisWeightPct={otherAxisWeightPct}
        reasonSentence="清掃性能は、実際にどれだけゴミを取り切れるかを直接左右するため、この軸を特に重視しています。"
        axisDetailSentence={
          cleaningPowerCriteriaLabels
            ? `清掃性能では、${cleaningPowerCriteriaLabels}を、公式に確認できた範囲で評価しています。吸引力の絶対値（Pa値）が非公表であること自体は、低評価の理由にはしていません。`
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

      {/* ⑦ 清掃性能で選ぶときのポイント */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">清掃性能で選ぶときのポイント</h2>
        <ul className="list-inside list-disc space-y-2 text-sm text-brand-inkSoft">
          <li>吸引力（Pa値）だけで決めない。測定条件がメーカーごとに異なるうえ、Pa値を公表していない商品もあり、単純比較はできません。水拭きや壁際清掃など他の要素もあわせて確認しましょう。</li>
          <li>水拭き方式を見る。加圧しながら拭けるか、モップを連続的に洗浄する機構があるかで、床の汚れの落ちやすさが変わります。</li>
          <li>壁際や角への対応を見る。可動式サイドブラシに限らず、メーカーが公表する壁際・隅清掃のための機構を確認しましょう。</li>
          <li>カーペット対応を見る。カーペットやラグの上でどのような機構が働くか、公式情報で確認できるかがポイントです。</li>
          <li>髪の毛やペットの毛への絡まり対策を見る。清掃中にブラシへ毛が絡みにくい構造かどうかは、公式情報で確認できる場合に限り評価対象としています。</li>
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
