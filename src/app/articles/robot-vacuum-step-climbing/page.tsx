import type { Metadata } from "next";
import Link from "next/link";
import {
  axisDefinitions,
  getAxisLeaders,
  getComparison,
  getProductsWithScores,
  getProfile,
  getSortableScore,
  products,
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

const SLUG = "robot-vacuum-step-climbing";

/** 「段差が多い家で使いたい」既存persona（axisScoreProfiles.json: id="step-climbing"）をそのまま使う。新しいweightは作らない。 */
const PROFILE_ID = "step-climbing";

/** 「条件別に選ぶなら」で見せるAXIS。quietnessは今回対象5商品中で未公表の商品が多くconfirmedなリーダーが出にくいため対象外（既存記事と同じ基準）。 */
const LEADER_AXES: AxisKey[] = ["cleaning_power", "maintainability", "price_value", "space_fit"];

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "段差に強いロボット掃除機5選｜段差乗り越え性能を比較 | えらぶ。",
    description:
      "玄関の上がり框やラグの厚みなど、段差の多い家でロボット掃除機を選ぶときに確認したいポイントを比較しました。段差乗り越え性能は、メーカーごとに測定条件が異なるため単純な数値比較はできません。公式に確認できる情報の範囲で、住宅適合性を軸に5商品を比較します。",
    path: `/articles/${SLUG}`,
  });
}

export default function StepClimbingArticlePage() {
  const comparison = getComparison(SLUG);
  const profile = getProfile(PROFILE_ID);
  const highlightAxis = getHighlightAxis(profile);

  // 既存のcalculateDisplayAwareAxisScore・getSortableScoreをそのまま使い、
  // 「段差が多い家で使いたい」persona weightでリアル5商品を再計算・並び替える。数値のハードコードはしない。
  const items = [...getProductsWithScores(PROFILE_ID)].sort(
    (a, b) => getSortableScore(b) - getSortableScore(a)
  );

  const axisLeaders = getAxisLeaders("", LEADER_AXES);

  // persona weightは軸ごとに異なるため、既存のArticleWhyThisRanking（1軸50%・残り4軸均等の前提）は使わず、
  // 実際の重みをそのまま文章にする（pet-household記事と同じ方針）。
  const weightLabels = (["space_fit", "cleaning_power", "price_value", "maintainability", "quietness"] as const).map(
    (axisKey) => ({
      label: axisDefinitions.find((d) => d.axisKey === axisKey)?.label ?? axisKey,
      pct: formatWeightPct(profile.weights[axisKey]),
    })
  );

  // 段差乗り越え性能そのものはproducts.jsonのstepClimbingMm（メーカー公表の単一段差の数値のみ）を使う。
  // Roborock Saros 20 Sonicは公式情報はあるが「二重段差条件での合計値」であり単一段差の数値と単純比較できないため、
  // stepClimbingMmはnullのまま扱い、本文で個別に説明する（数値のハードコードや独自換算はしない）。
  const realProducts = products.filter((p) => p.dataType === "real");
  const stepClimbingRows = realProducts.map((p) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    stepClimbingMm: p.stepClimbingMm,
  }));

  return (
    <article className="max-w-3xl">
      <Breadcrumbs
        items={[
          { label: "ホーム", href: "/" },
          { label: "比較記事", href: "/articles" },
          { label: comparison?.title ?? "段差に強いロボット掃除機5選" },
        ]}
      />

      {/* ① ファーストビュー */}
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-accent">比較記事</p>
      <h1 className="mb-4 text-3xl font-bold">
        {comparison?.title ?? "段差に強いロボット掃除機5選｜段差乗り越え性能を比較"}
      </h1>
      <div className="mb-10 space-y-3 text-brand-inkSoft">
        <p>
          玄関の上がり框、部屋の間のわずかな段差、厚手のラグの縁など、住まいの中には様々な「段差」があります。段差への対応力は、本体の高さやステーションの設置スペースと同じく、住宅適合性の重要な要素です。ただし、段差乗り越え性能はメーカーごとに公表状況や測定条件が異なり、数値をそのまま横並びで比較できない場合があります。
        </p>
        <p>
          「えらぶ。」では今回、AXIS SCORE™の5軸のうち「住宅適合性」の重みを高くした比較を行い、段差への対応を含めた置きやすさを重視して5商品を比較しました。あわせて、段差乗り越え性能そのものについて、公式に確認できる情報の範囲を個別に整理しています。
        </p>
      </div>

      {/* ② 先に結論 */}
      <ArticleRankingList items={items} heading="先に結論：段差が多い家で使いたい人向けランキング" personaName="段差が多い家で使いたい" />

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
            今回のランキングは、{weightLabels.map((w) => `${w.label}を${w.pct}%`).join("、")}として比較した結果です。住宅適合性は、段差乗り越えだけでなく、本体の高さ、ステーションの設置面積、障害物回避、マッピング性能まで含めた総合的な軸のため、段差乗り越え性能単体の評価とランキングの順位は必ずしも一致しません。段差乗り越え性能そのものについては、次のセクションで個別に比較しています。
          </p>
          <p>
            評価情報が不足しているAXISは0点として扱っているわけではありません。確認できているAXISだけで計算し、不足分は「参考」または「評価情報不足」として区別して表示しています。特定のAXISの評価情報が総合スコアに占める割合が大きい場合は、総合スコア自体を「評価情報不足」として扱うこともあります。
          </p>
        </div>
      </section>

      {/* ⑤ 段差乗り越え性能を個別に比較 */}
      <section className="mb-10">
        <h2 className="mb-2 text-lg font-bold">段差乗り越え性能を個別に比較</h2>
        <p className="mb-4 text-sm text-brand-inkSoft">
          「段差に強い」を、住宅適合性AXISの総合スコアだけで判断すると、段差乗り越え性能そのものの違いが見えにくくなります。ここでは段差乗り越え性能について、メーカー公式情報で確認できる範囲を商品ごとに整理しました。
        </p>
        <div className="overflow-x-auto rounded-lg border border-brand-line bg-brand-card">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="bg-brand-bgRaised text-left text-brand-inkSoft">
                <th className="px-4 py-3 font-bold">商品</th>
                <th className="px-4 py-3 font-bold">段差乗り越え（公式公表値）</th>
              </tr>
            </thead>
            <tbody>
              {stepClimbingRows.map((row) => (
                <tr key={row.id} className="border-t border-brand-line align-top">
                  <td className="px-4 py-3">
                    <Link href={`/robot-vacuums/${row.id}`} className="font-bold text-brand-accent underline">
                      {row.brand} {row.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-brand-inkSoft">
                    {row.stepClimbingMm !== null ? `${row.stepClimbingMm}mm` : "非公表・比較不可"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 space-y-3 text-sm text-brand-inkSoft">
          <p>
            今回比較した5商品のうち、単一の段差についての乗り越え数値を公式に確認できたのは DEEBOT T80S OMNI と SwitchBot お掃除ロボットS20 の2商品（いずれも20mm）でした。Roomba Plus 515 Combo と Eufy Robot Vacuum Omni E25 は、公式情報から段差乗り越えの具体的な数値を確認できませんでした。
          </p>
          <p>
            Roborock Saros 20 Sonic は公式に段差性能の記載がありますが、単一の段差ではなく2段階の段差を合わせて乗り越えた条件での数値であり、測定条件が異なるため、他社の「単一の段差20mm」という数値とは単純に比較できません。そのため、この商品の段差乗り越え数値は上表では「非公表・比較不可」として扱っています。
          </p>
          <p>
            なお、本記事で扱っているのは段差を「乗り越える」性能です。段差やラグの縁から転落することを防ぐ、いわゆる落下防止センサーとは別の機能であり、今回比較した5商品のAXIS SCORE™データには落下防止に関する評価項目は含まれていません。段差乗り越え性能と落下防止性能を混同しないようご注意ください。
          </p>
        </div>
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

      {/* ⑧ 段差が多い家での選び方 */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">段差が多い家での選び方</h2>
        <ul className="list-inside list-disc space-y-2 text-sm text-brand-inkSoft">
          <li>
            段差乗り越えの数値は、メーカーによって「単一の段差」「複数段差の合計」など測定条件が異なる場合があります。数値だけで単純に比較せず、測定条件の記載があるかまで確認しましょう。
          </li>
          <li>数値が非公表だからといって、段差に弱いとは限りません。公式情報で確認できていないだけの場合もあります。</li>
          <li>
            段差乗り越えは、落下防止（段差からの転落を防ぐ機能）とは別の性能です。両方が気になる場合は、それぞれ別の項目として商品ページを確認しましょう。
          </li>
          <li>
            段差だけでなく、本体の高さやステーションの設置スペースも含めた住宅適合性全体については、
            <Link href="/articles/robot-vacuum-narrow-room" className="mx-1 font-bold text-brand-accent underline">
              狭い家・マンション向けロボット掃除機5選
            </Link>
            でも詳しく比較しています。
          </li>
          <li>
            一人暮らしなど、住宅適合性以外に価格や手入れの手間も気になる場合は、
            <Link href="/articles/robot-vacuum-solo-living" className="mx-1 font-bold text-brand-accent underline">
              一人暮らし向けロボット掃除機5選
            </Link>
            もあわせてご覧ください。
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
