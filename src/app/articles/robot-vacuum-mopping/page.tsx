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
import { formatWeightPct } from "@/lib/article";
import type { AxisKey } from "@/types/axis";
import { ComparisonTable } from "@/components/ComparisonTable";
import { ArticleRankingList } from "@/components/article/ArticleRankingList";
import { ArticleProductEvaluationCards } from "@/components/article/ArticleProductEvaluationCards";
import { ArticleRelatedArticles } from "@/components/article/ArticleRelatedArticles";
import { CompareWithOthers } from "@/components/product-detail/CompareWithOthers";
import { AxisScoreMethodologyTeaser } from "@/components/product-detail/AxisScoreMethodologyTeaser";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { buildPageMetadata } from "@/lib/site-config";

const SLUG = "robot-vacuum-mopping";

/** 「水拭きを重視したい」既存persona（axisScoreProfiles.json: id="mopping-focus"）をそのまま使う。新しいweightは作らない。 */
const PROFILE_ID = "mopping-focus";

/** 「条件別に選ぶなら」で見せるAXIS。quietnessは今回対象5商品中で未公表の商品が多くconfirmedなリーダーが出にくいため対象外（既存記事と同じ基準）。 */
const LEADER_AXES: AxisKey[] = ["cleaning_power", "maintainability", "price_value", "space_fit"];

/**
 * 水拭き性能を評価するうえで特に確認したい既存criteria。新しいcriterionは作らず、
 * axisDefinitions.jsonに実在するidだけを参照する。ラベルもaxisDefinitions.jsonから動的取得する。
 * 吸引力（suction_performance）とは別項目であることを明確にするため、水拭きに関する3項目に絞る。
 */
const MOPPING_RELEVANT_CRITERIA: { axisKey: AxisKey; id: string }[] = [
  { axisKey: "cleaning_power", id: "mopping_performance" },
  { axisKey: "maintainability", id: "auto_mop_washing" },
  { axisKey: "maintainability", id: "auto_mop_drying" },
];

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "水拭きに強いロボット掃除機5選｜モップ洗浄・乾燥まで比較 | えらぶ。",
    description:
      "水拭きに強いロボット掃除機を選ぶときは、吸引力とは別に、水拭き性能・モップの自動洗浄・自動乾燥までを確認する必要があります。「えらぶ。」では清掃性能とメンテナンス性の重みを高くしたAXIS SCORE™で5商品を比較しました。",
    path: `/articles/${SLUG}`,
  });
}

export default function MoppingArticlePage() {
  const comparison = getComparison(SLUG);
  const profile = getProfile(PROFILE_ID);
  const highlightAxis = getHighlightAxis(profile);

  // 既存のcalculateDisplayAwareAxisScore・getSortableScoreをそのまま使い、
  // 「水拭きを重視したい」persona weightでリアル5商品を再計算・並び替える。数値のハードコードはしない。
  const items = [...getProductsWithScores(PROFILE_ID)].sort(
    (a, b) => getSortableScore(b) - getSortableScore(a)
  );

  const axisLeaders = getAxisLeaders("", LEADER_AXES);

  // persona weightは軸ごとに異なるため、既存のArticleWhyThisRanking（1軸50%・残り4軸均等の前提）は使わず、
  // 実際の重みをそのまま文章にする（pet-household記事と同じ方針）。
  const weightLabels = (["cleaning_power", "maintainability", "space_fit", "quietness", "price_value"] as const).map(
    (axisKey) => ({
      label: axisDefinitions.find((d) => d.axisKey === axisKey)?.label ?? axisKey,
      pct: formatWeightPct(profile.weights[axisKey]),
    })
  );

  return (
    <article className="max-w-3xl">
      <Breadcrumbs
        items={[
          { label: "ホーム", href: "/" },
          { label: "比較記事", href: "/articles" },
          { label: comparison?.title ?? "水拭きに強いロボット掃除機5選" },
        ]}
      />

      {/* ① ファーストビュー */}
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-accent">比較記事</p>
      <h1 className="mb-4 text-3xl font-bold">
        {comparison?.title ?? "水拭きに強いロボット掃除機5選｜モップ洗浄・乾燥まで比較"}
      </h1>
      <div className="mb-10 space-y-3 text-brand-inkSoft">
        <p>
          水拭き性能は、吸引力とは別の評価項目です。水拭きが強い商品を選ぶには、モップの加圧・振動・回転などの清掃方式に加えて、使ったモップを自動で洗浄・乾燥してくれるかまで確認しておくと、購入後のギャップが少なくなります。
        </p>
        <p>
          「えらぶ。」では今回、AXIS SCORE™の5軸のうち「清掃性能」と「メンテナンス性」の重みを高くした比較を行い、水拭き性能とモップの手入れのしやすさを重視して5商品を比較しました。
        </p>
      </div>

      {/* ② 先に結論 */}
      <ArticleRankingList items={items} heading="先に結論：水拭きを重視したい人向けランキング" personaName="水拭きを重視したい" />

      {/* ③ 比較表 */}
      <section className="mb-10">
        <h2 className="mb-2 text-lg font-bold">比較表</h2>
        <ComparisonTable items={items} axisDefinitions={axisDefinitions} />
      </section>

      {/* ④ なぜこの順位？ */}
      <section className="mb-10 rounded-lg border border-brand-line bg-brand-card p-5">
        <h2 className="mb-2 text-lg font-bold">なぜこの順位？</h2>
        <div className="space-y-3 text-sm text-brand-inkSoft">
          <p>
            今回のランキングは、{weightLabels.map((w) => `${w.label}を${w.pct}%`).join("、")}として比較した結果です。水拭き性能そのもの（清掃性能AXISの一部）に加えて、モップの自動洗浄・自動乾燥（メンテナンス性AXISの一部）も同じくらい重視しています。水拭きは「掃除中の清掃力」と「掃除後の手入れのしやすさ」の両方で評価が分かれるためです。
          </p>
          <p>
            評価情報が不足しているAXISは0点として扱っているわけではありません。確認できているAXISだけで計算し、不足分は「参考」または「評価情報不足」として区別して表示しています。特定のAXISの評価情報が総合スコアに占める割合が大きい場合は、総合スコア自体を「評価情報不足」として扱うこともあります。
          </p>
        </div>
      </section>

      {/* ⑤ 水拭き目線で見る3つのポイント */}
      <section className="mb-10">
        <h2 className="mb-2 text-lg font-bold">水拭き目線で見る3つのポイント</h2>
        <p className="mb-4 text-sm text-brand-inkSoft">
          水拭きに強い＝吸引力ではなく、水拭き性能そのものと、モップの自動洗浄・自動乾燥を見る必要があります。今回比較した5商品について、公式情報で確認できているスコア（獲得点／配点）をまとめました。
        </p>
        <div className="overflow-x-auto rounded-lg border border-brand-line bg-brand-card">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="bg-brand-bgRaised text-left text-brand-inkSoft">
                <th className="px-4 py-3 font-bold">チェックポイント</th>
                {items.map((item) => (
                  <th key={item.product.id} className="whitespace-nowrap px-4 py-3 font-bold">
                    {item.product.brand}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOPPING_RELEVANT_CRITERIA.map((target) => {
                const axisDef = axisDefinitions.find((d) => d.axisKey === target.axisKey);
                const criterionDef = axisDef?.criteria.find((c) => c.id === target.id);
                return (
                  <tr key={`${target.axisKey}-${target.id}`} className="border-t border-brand-line align-top">
                    <td className="px-4 py-3 font-bold text-brand-ink">
                      {criterionDef?.label ?? target.id}
                      <span className="block text-xs font-normal text-brand-inkSoft">（{axisDef?.label}）</span>
                    </td>
                    {items.map((item) => {
                      const scores = getProductAxisScores(item.product.id);
                      const axisEntry = scores?.scores.find((s) => s.axisKey === target.axisKey);
                      const criterion = axisEntry?.criteria.find((c) => c.id === target.id);
                      const display =
                        criterion && criterion.status === "verified" && criterion.score !== null
                          ? `${criterion.score}/${criterion.weight}`
                          : "未確認";
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
          今回比較した5商品はいずれも、水拭き性能・モップ自動乾燥について公式に高い評価を確認できました。差が出たのはモップ自動洗浄で、加温（温水洗浄）の有無まで公式に確認できたのは3商品で、残る2商品は洗浄機構自体はあるものの加温の有無までは確認できませんでした。
        </p>
      </section>

      {/* ⑥ 商品別評価 */}
      <ArticleProductEvaluationCards items={items} highlightAxis={highlightAxis} />

      {/* ⑦ 条件別に選ぶなら */}
      <CompareWithOthers
        leaders={axisLeaders}
        axisDefinitions={axisDefinitions}
        heading="条件別に選ぶなら"
        labelSuffix="を最優先するなら"
      />

      {/* ⑧ 水拭きを重視した選び方 */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">水拭きを重視した選び方</h2>
        <ul className="list-inside list-disc space-y-2 text-sm text-brand-inkSoft">
          <li>水拭き性能は吸引力とは別の評価項目です。吸引力の数値だけで水拭きの強さを判断しないようにしましょう。</li>
          <li>モップの加圧方式（加圧・振動・回転など）は商品によって異なります。方式の違いによる仕上がりの差は、公式情報だけでは判断しきれない場合があります。</li>
          <li>モップの自動洗浄に温水（加温）を使うかどうかは、商品によって異なります。加温の有無にかかわらず、自動洗浄そのものがあれば手入れの手間は大きく減ります。</li>
          <li>
            清掃性能全体で比較したい場合は、
            <Link href="/articles/robot-vacuum-cleaning-performance" className="mx-1 font-bold text-brand-accent underline">
              清掃性能で選ぶロボット掃除機5選
            </Link>
            もあわせてご覧ください。
          </li>
          <li>
            モップの手入れ以外の日々のメンテナンス性まで含めて比較したい場合は、
            <Link href="/articles/robot-vacuum-low-maintenance" className="mx-1 font-bold text-brand-accent underline">
              手入れが楽なロボット掃除機5選
            </Link>
            で詳しく比較しています。
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
