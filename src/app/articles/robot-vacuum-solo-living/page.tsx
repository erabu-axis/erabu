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
import { ArticleProductEvaluationCards } from "@/components/article/ArticleProductEvaluationCards";
import { ArticleRelatedArticles } from "@/components/article/ArticleRelatedArticles";
import { CompareWithOthers } from "@/components/product-detail/CompareWithOthers";
import { AxisScoreMethodologyTeaser } from "@/components/product-detail/AxisScoreMethodologyTeaser";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { buildPageMetadata } from "@/lib/site-config";

const SLUG = "robot-vacuum-solo-living";

/** 「一人暮らしで使いたい」既存persona（axisScoreProfiles.json: id="solo-living"）をそのまま使う。新しいweightは作らない。 */
const PROFILE_ID = "solo-living";

/** 「条件別に選ぶなら」で見せるAXIS。quietnessは今回対象5商品中で未公表の商品が多くconfirmedなリーダーが出にくいため対象外（既存記事と同じ基準）。 */
const LEADER_AXES: AxisKey[] = ["cleaning_power", "maintainability", "price_value", "space_fit"];

/**
 * 一人暮らし向けに特に確認したい既存criteria。新しいcriterionは作らず、
 * axisDefinitions.jsonに実在するidだけを参照する。ラベルもaxisDefinitions.jsonから動的取得する。
 * 「狭い家」記事（家具下の高さ・マッピング中心）とは異なり、価格と日々の手入れ負担を中心に据える。
 */
const SOLO_RELEVANT_CRITERIA: { axisKey: AxisKey; id: string }[] = [
  { axisKey: "price_value", id: "product_price" },
  { axisKey: "maintainability", id: "auto_dust_collection" },
  { axisKey: "maintainability", id: "auto_mop_washing" },
  { axisKey: "space_fit", id: "station_footprint" },
];

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "一人暮らし向けロボット掃除機5選｜狭い部屋・価格・手入れで比較 | えらぶ。",
    description:
      "一人暮らしでロボット掃除機を選ぶときは、部屋の狭さだけでなく価格と日々の手入れの手間も重要な判断材料です。「えらぶ。」では価格対効果とメンテナンス性の重みを高くしたAXIS SCORE™で5商品を比較しました。",
    path: `/articles/${SLUG}`,
  });
}

export default function SoloLivingArticlePage() {
  const comparison = getComparison(SLUG);
  const profile = getProfile(PROFILE_ID);
  const highlightAxis = getHighlightAxis(profile);

  // 既存のcalculateDisplayAwareAxisScore・getSortableScoreをそのまま使い、
  // 「一人暮らしで使いたい」persona weightでリアル5商品を再計算・並び替える。数値のハードコードはしない。
  const items = [...getProductsWithScores(PROFILE_ID)].sort(
    (a, b) => getSortableScore(b) - getSortableScore(a)
  );

  const axisLeaders = getAxisLeaders("", LEADER_AXES);

  // persona weightは軸ごとに異なるため、既存のArticleWhyThisRanking（1軸50%・残り4軸均等の前提）は使わず、
  // 実際の重みをそのまま文章にする（pet-household記事と同じ方針）。
  const weightLabels = (["price_value", "maintainability", "space_fit", "cleaning_power", "quietness"] as const).map(
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
          { label: comparison?.title ?? "一人暮らし向けロボット掃除機5選" },
        ]}
      />

      {/* ① ファーストビュー */}
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-accent">比較記事</p>
      <h1 className="mb-4 text-3xl font-bold">
        {comparison?.title ?? "一人暮らし向けロボット掃除機5選｜狭い部屋・価格・手入れで比較"}
      </h1>
      <div className="mb-10 space-y-3 text-brand-inkSoft">
        <p>
          一人暮らしだから何かが特別に必要になる、というわけではありません。ただ、家事にかけられる時間や予算は人によって異なり、購入・設置・日々の手入れをすべて自分で担うことになる点は一人暮らし特有の事情です。部屋の広さだけでなく、価格と日々の手入れの手間まで含めて考えることが大切です。
        </p>
        <p>
          「えらぶ。」では今回、AXIS SCORE™の5軸のうち「価格対効果」と「メンテナンス性」の重みを高くした比較を行い、コストと手入れの手間のバランスを重視して5商品を比較しました。
        </p>
      </div>

      {/* ② 先に結論 */}
      <ArticleRankingGroups
        items={items}
        heading="先に結論：一人暮らしで使いたい人向けランキング"
        personaName="一人暮らしで使いたい"
        axisDefinitions={axisDefinitions}
      />

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
            今回のランキングは、{weightLabels.map((w) => `${w.label}を${w.pct}%`).join("、")}として比較した結果です。価格に対してどれだけの機能が得られるか、そして自動ゴミ収集やモップ自動洗浄など日々の手入れの手間を減らせるかを重視しています。住宅適合性にも一定の比重を持たせていますが、「狭い家で使いたい」persona（本体高さ・マッピングなど家具まわりの置きやすさを重視）とは異なり、ここではステーションの設置に必要な収納スペースの観点を中心に見ています。
          </p>
          <p>
            評価情報が不足しているAXISは0点として扱っているわけではありません。確認できているAXISだけで計算し、不足分は「参考」または「評価情報不足」として区別して表示しています。特定のAXISの評価情報が総合スコアに占める割合が大きい場合は、総合スコア自体を「評価情報不足」として扱うこともあります。
          </p>
        </div>
      </section>

      {/* ⑤ 一人暮らし目線で見る4つのポイント */}
      <section className="mb-10">
        <h2 className="mb-2 text-lg font-bold">一人暮らし目線で見る4つのポイント</h2>
        <p className="mb-4 text-sm text-brand-inkSoft">
          一人暮らし＝とにかく小さければよい、というわけではありません。価格、日々の手入れの手間、設置スペースを総合して見る必要があります。今回比較した5商品について、公式情報で確認できているスコア（獲得点／配点）をまとめました。
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
              {SOLO_RELEVANT_CRITERIA.map((target) => {
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
          自動ゴミ収集はいずれの商品も確認できましたが、モップ自動洗浄の加温の有無や、ステーションの設置面積には商品ごとに差があります。価格は参考価格ベースで比較しており、セール等による現在価格の変動は含めていません。
        </p>
      </section>

      {/* ⑥ 商品別評価 */}
      <ArticleProductEvaluationCards items={items} highlightAxis={highlightAxis} axisDefinitions={axisDefinitions} articleId={SLUG} />

      {/* ⑦ 条件別に選ぶなら */}
      <CompareWithOthers
        leaders={axisLeaders}
        axisDefinitions={axisDefinitions}
        heading="条件別に選ぶなら"
        labelSuffix="を最優先するなら"
      />

      {/* ⑧ 一人暮らしでの選び方 */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">一人暮らしでの選び方</h2>
        <ul className="list-inside list-disc space-y-2 text-sm text-brand-inkSoft">
          <li>
            価格は、参考価格と現在価格（セール等での実勢価格）を分けて確認しましょう。「安ければコスパが良い」とは限らず、価格に対して得られる機能や住宅適合性まで含めて考えることが大切です。
          </li>
          <li>
            自動ゴミ収集やモップ自動洗浄・自動乾燥があれば、日々の手入れの手間を減らせます。手入れの手間全体については
            <Link href="/articles/robot-vacuum-low-maintenance" className="mx-1 font-bold text-brand-accent underline">
              手入れが楽なロボット掃除機5選
            </Link>
            でも詳しく比較しています。
          </li>
          <li>
            ステーションの設置に必要な収納スペース（幅・奥行き）を確認しましょう。玄関やクローゼット脇など、置き場所が限られる住まいでは特に重要です。
          </li>
          <li>
            段差の多い物件に住んでいる場合は、
            <Link href="/articles/robot-vacuum-step-climbing" className="mx-1 font-bold text-brand-accent underline">
              ロボット掃除機の段差対応を比較
            </Link>
            もあわせてご覧ください。
          </li>
        </ul>
        <p className="mt-4 text-sm text-brand-inkSoft">
          5つのAXIS全体の考え方や、購入前に確認しておきたい基本的なポイントは、
          <Link href="/articles/robot-vacuum-how-to-choose" className="mx-1 font-bold text-brand-accent underline">
            ロボット掃除機で後悔しない選び方
          </Link>
          でも解説しています。
        </p>
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
