import type { Metadata } from "next";
import Link from "next/link";
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

/**
 * 「お手入れ自動化 比較表」の表示用メタ情報。
 * ○/確認済み情報なしの判定はproducts.jsonのautoEmptying/autoMopWashing/autoMopDryingの
 * boolean値をそのまま使う。カッコ内の頻度・温度等の補足、毛絡み対策の文言は、
 * productAxisScores.json（maintainability軸のcriteria・publicRationale）で確認済みの内容のみを
 * 転記している。未確認の項目は「確認済み情報なし」と事実どおりに表現し、推測では補わない
 * （2026-09-07のメンテナンス機能監査結果にもとづく）。
 * manualTaskTextは「購入後にユーザー自身が行う具体的な作業」だけを書く欄であり、
 * 「情報が確認できていないこと」自体を作業内容のように書かない（2026-09-07の追加修正）。
 * 具体的な作業頻度が確認できる場合のみその内容を記載し、確認できない商品は
 * 「具体的な作業頻度は確認できず」という定型文にとどめ、「作業不要」「手入れ不要」等は書かない。
 */
interface MaintenanceMeta {
  dustCollectionDetail: string | null;
  mopWashingDetail: string | null;
  mopDryingDetail: string | null;
  tangleCareText: string;
  manualTaskText: string;
}
const MAINTENANCE_META: Record<string, MaintenanceMeta> = {
  "irobot-roomba-plus-515-combo": {
    dustCollectionDetail: "最大3か月分",
    mopWashingDetail: "75℃温水",
    mopDryingDetail: "45℃温風",
    tangleCareText: "「切り取る必要なし」と明記（除去の仕組みまでは確認できず）",
    manualTaskText: "具体的な作業頻度は確認できず",
  },
  "roborock-saros-20-sonic": {
    dustCollectionDetail: "最大65日間",
    mopWashingDetail: "100℃温水",
    mopDryingDetail: "55℃温風",
    tangleCareText: "「絡まり率0%」と明記（除去のしやすさは確認できず）",
    manualTaskText: "具体的な作業頻度は確認できず",
  },
  "ecovacs-deebot-t80s-omni": {
    dustCollectionDetail: null,
    mopWashingDetail: "75℃熱水",
    mopDryingDetail: "63℃・2時間",
    tangleCareText: "「絡まり率ほぼ0%」と明記（除去のしやすさは確認できず）",
    manualTaskText: "具体的な作業頻度は確認できず",
  },
  "switchbot-s20": {
    dustCollectionDetail: "ゴミ捨ては年4回",
    mopWashingDetail: "加温有無は未確認",
    mopDryingDetail: "50℃温風",
    tangleCareText: "工具不要で着脱可能（自動除去機構ではありません）",
    manualTaskText: "ステーションの給水・排水タンクを週に1回、手動で管理する必要があります。",
  },
  "eufy-robot-vacuum-omni-e25": {
    dustCollectionDetail: null,
    mopWashingDetail: "加温有無は未確認",
    mopDryingDetail: "温風、温度は非公表",
    tangleCareText: "自動で毛を除去する機構あり（DuoSpiralブラシ）",
    manualTaskText: "具体的な作業頻度は確認できず",
  },
};

/** boolean値がtrueのときだけ「○」を表示し、補足があればカッコで添える。未確認（false/null）は断定せず「確認済み情報なし」とする。 */
function formatAutoFeatureCell(hasFeature: boolean | null, detail: string | null): string {
  if (hasFeature !== true) return "確認済み情報なし";
  return detail ? `○（${detail}）` : "○";
}

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
          「お手入れが簡単」とうたわれるロボット掃除機でも、自動ゴミ収集があるからといって、手入れがまったく不要になるわけではありません。ゴミ捨ての手間を減らせるかどうか、モップが自動で洗浄・乾燥されるかどうかは商品によって差があり、ブラシの毛絡み対策やステーション自体の手入れのしやすさまで含めると、購入後も人の手で行う作業が残る商品と、大きく減らせる商品があります。
        </p>
        <p>
          「えらぶ。」では今回、「結局、自分は何をしなくて済み、何を自分でやる必要があるのか」を判断できるよう、AXIS SCORE™の5軸のうち「メンテナンス性」の重みを高くした比較に加えて、5商品の自動化機能と確認できた「人が行う主な作業」をまとめた比較表を用意しました。家事の手入れが面倒だと感じている人、共働き・子育てなどで手間を減らしたい人向けの内容です。
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

      {/* ③.5 お手入れ自動化 比較表 */}
      <section className="mb-10">
        <h2 className="mb-2 text-lg font-bold">お手入れ自動化 比較表</h2>
        <p className="mb-4 text-sm text-brand-inkSoft">
          AXIS SCORE™の「メンテナンス性」は、自動ゴミ収集・モップ自動洗浄・モップ自動乾燥・毛絡みのお手入れ・ステーション自体のお手入れの5項目を評価した総合値です。ここでは、採点の元になっている確認済み情報を5商品分そのまま並べました。実際に必要になる給水・排水・消耗品交換などの作業は、右端の「人が行う主な作業」列や商品ごとの確認済み情報もあわせてご確認ください。
        </p>
        <div className="overflow-x-auto rounded-lg border border-brand-line">
          <table className="w-full min-w-[760px] border-collapse bg-brand-card text-sm">
            <thead>
              <tr className="bg-brand-bgRaised text-left text-brand-inkSoft">
                <th className="px-4 py-3 font-bold">商品名</th>
                <th className="px-4 py-3 font-bold">自動ゴミ収集</th>
                <th className="px-4 py-3 font-bold">モップ自動洗浄</th>
                <th className="px-4 py-3 font-bold">モップ自動乾燥</th>
                <th className="px-4 py-3 font-bold">毛絡み対策</th>
                <th className="whitespace-nowrap px-4 py-3 font-bold">人が行う主な作業</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const p = item.product;
                const meta = MAINTENANCE_META[p.id];
                return (
                  <tr key={p.id} className="border-t border-brand-line align-top">
                    <td className="px-4 py-3">
                      <Link href={`/robot-vacuums/${p.id}`} className="font-bold text-brand-accent underline">
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-brand-inkSoft">
                      {formatAutoFeatureCell(p.autoEmptying, meta?.dustCollectionDetail ?? null)}
                    </td>
                    <td className="px-4 py-3 text-brand-inkSoft">
                      {formatAutoFeatureCell(p.autoMopWashing, meta?.mopWashingDetail ?? null)}
                    </td>
                    <td className="px-4 py-3 text-brand-inkSoft">
                      {formatAutoFeatureCell(p.autoMopDrying, meta?.mopDryingDetail ?? null)}
                    </td>
                    <td className="px-4 py-3 text-brand-inkSoft">{meta?.tangleCareText ?? "確認済み情報なし"}</td>
                    <td className="px-4 py-3 text-brand-inkSoft">{meta?.manualTaskText ?? "確認済み情報なし"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-brand-inkSoft">
          「確認済み情報なし」は作業が不要という意味ではなく、公式情報で確認できていないことを示します。「人が行う主な作業」欄で具体的な作業頻度を確認できない商品についても、消耗品交換や給水・排水、各部の清掃などが不要という意味ではありません。購入前にメーカー公式の取扱説明書等もあわせてご確認ください。
        </p>
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

      {/*
        SwitchBot S20 補足：productEditorial.jsonにmaintainability軸タグの強み・注意点が
        登録されていないため、上の商品別評価カードではSwitchBotだけ「強み」「注意したい点」の
        枠が表示されない。productAxisScores.jsonで確認済みのpublicRationale（変更していない）を
        記事側の補足としてそのまま案内する。
      */}
      <div className="mb-10 rounded-lg border border-dashed border-brand-line bg-brand-card p-4 text-sm text-brand-inkSoft">
        <p className="mb-1 text-xs font-bold text-brand-inkSoft">SwitchBot S20の手入れについて（補足）</p>
        <p>
          自動ゴミ収集（ゴミ捨ては年4回）、50℃の温風によるモップ自動乾燥、工具不要でのブラシお手入れなど、手入れの手間を減らす機能が確認できています。一方、ステーションの給水・排水タンクは週に一度の手動管理が必要であることも公式情報で確認できています。
        </p>
      </div>

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
        <p className="mt-4 text-sm text-brand-inkSoft">
          今回の5商品以外もあわせて比較したい場合は、
          <Link href="/robot-vacuums" className="mx-1 font-bold text-brand-accent underline">
            ロボット掃除機の比較一覧
          </Link>
          からAXIS SCORE™とあわせて確認できます。
        </p>
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
