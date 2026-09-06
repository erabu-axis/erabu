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

const SLUG = "robot-vacuum-for-pets";

/** 「ペットがいる家庭で使いたい」既存persona（axisScoreProfiles.json: id="pet-household"）をそのまま使う。新しいweightは作らない。 */
const PROFILE_ID = "pet-household";

/** ⑦「条件別に選ぶなら」で見せるAXIS。quietnessは今回対象5商品中で未公表の商品が多くconfirmedなリーダーが出にくいため対象外（既存記事と同じ基準）。 */
const LEADER_AXES: AxisKey[] = ["cleaning_power", "maintainability", "price_value", "space_fit"];

/**
 * ペットがいる家庭で特に確認したい既存criteria。新しいcriterionは作らず、
 * axisDefinitions.jsonに実在するidだけを参照する。ラベルもaxisDefinitions.jsonから動的取得する。
 */
const PET_RELEVANT_CRITERIA: { axisKey: AxisKey; id: string }[] = [
  { axisKey: "cleaning_power", id: "suction_performance" },
  { axisKey: "cleaning_power", id: "carpet_performance" },
  { axisKey: "cleaning_power", id: "brush_tangle_prevention" },
  { axisKey: "maintainability", id: "tangle_maintenance" },
  { axisKey: "maintainability", id: "auto_dust_collection" },
  { axisKey: "space_fit", id: "obstacle_avoidance" },
];

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "ペットがいる家庭向けロボット掃除機5選｜毛絡み・吸引・手入れで比較 | えらぶ。",
    description:
      "ペットがいる家庭向けに、毛絡み対策・吸引力・自動ゴミ収集・カーペット対応などを軸にロボット掃除機5商品を比較しました。吸引力だけでなく、絡んだ毛の処理のしやすさや日々の手入れの手間まで確認できます。",
    path: `/articles/${SLUG}`,
  });
}

export default function ForPetsArticlePage() {
  const comparison = getComparison(SLUG);
  const profile = getProfile(PROFILE_ID);
  const highlightAxis = getHighlightAxis(profile);

  // 既存のcalculateDisplayAwareAxisScore・getSortableScoreをそのまま使い、
  // 「ペットがいる家庭で使いたい」persona weightでリアル5商品を再計算・並び替える。数値のハードコードはしない。
  const items = [...getProductsWithScores(PROFILE_ID)].sort(
    (a, b) => getSortableScore(b) - getSortableScore(a)
  );

  // 「他の候補と迷ったら」と同じgetAxisLeadersを、除外商品なし（全商品が候補）で呼ぶだけ。新しい推薦ロジックは作らない。
  const axisLeaders = getAxisLeaders("", LEADER_AXES);

  // persona weightは軸ごとに異なる（35/30/20/10/5）ため、既存のArticleWhyThisRanking
  // （「1軸を50%、残り4軸を均等に」という前提の文言）は今回は使わず、実際の重みをそのまま文章にする。
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
          { label: comparison?.title ?? "ペットがいる家庭向けロボット掃除機5選" },
        ]}
      />

      {/* ① ファーストビュー */}
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-accent">比較記事</p>
      <h1 className="mb-4 text-3xl font-bold">
        {comparison?.title ?? "ペットがいる家庭向けロボット掃除機5選｜毛絡み・吸引・手入れで比較"}
      </h1>
      <div className="mb-10 space-y-3 text-brand-inkSoft">
        <p>
          ペットがいる家庭でロボット掃除機を選ぶときは、吸引力だけを見ていると選び方を誤りやすくなります。毛を吸い取れるかだけでなく、ブラシに毛が絡みにくいか、絡んだ毛を取り除きやすいか、自動ゴミ収集があるか、カーペットに対応しているか、床の障害物にどう対応するかまで、あわせて確認することが大切です。
        </p>
        <p>
          「えらぶ。」では今回、AXIS SCORE™の5軸のうち「清掃性能」と「メンテナンス性」の重みを高くした比較を行い、ペットがいる家庭で気になりやすいポイントを重視して5商品を比較しました。
        </p>
      </div>

      {/* ② 先に結論 */}
      <ArticleRankingList
        items={items}
        heading="先に結論：ペットがいる家庭向けランキング"
        personaName="ペットがいる家庭で使いたい"
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
            今回のランキングは、{weightLabels.map((w) => `${w.label}を${w.pct}%`).join("、")}として比較した結果です。吸引力や毛絡み対策などの清掃性能に加えて、絡んだ毛の除去や自動ゴミ収集といった手入れのしやすさも、ペットがいる家庭では特に気になりやすいポイントのため、この2軸を重視しています。住宅適合性（障害物回避を含む）にも一定の比重を持たせる一方、静音性・価格対効果は相対的に軽くしています。
          </p>
          <p>
            評価情報が不足しているAXISは0点として扱っているわけではありません。確認できているAXISだけで計算し、不足分は「参考」または「評価情報不足」として区別して表示しています。特定のAXISの評価情報が総合スコアに占める割合が大きい場合は、総合スコア自体を「評価情報不足」として扱うこともあります。
          </p>
        </div>
      </section>

      {/* ⑤ ペット目線で見る6つのポイント */}
      <section className="mb-10">
        <h2 className="mb-2 text-lg font-bold">ペット目線で見る6つのポイント</h2>
        <p className="mb-4 text-sm text-brand-inkSoft">
          ペット向け＝吸引力だけではなく、毛絡み対策、絡んだ毛の処理のしやすさ、自動ゴミ収集、カーペット対応、床上の障害物への対応などを総合して見る必要があります。今回比較した5商品について、公式情報で確認できているスコア（獲得点／配点）をまとめました。
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
              {PET_RELEVANT_CRITERIA.map((target) => {
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
          今回比較した5商品では、ブラシの毛絡み対策と自動ゴミ収集はいずれの商品も高い評価でした。一方で差が大きく出たのは「絡んだ毛を取り除く手入れのしやすさ」です。絡んだ毛を自動で除去する機構を公式に確認できたのはEufy Robot Vacuum Omni E25のみで、他の商品は清掃中に絡みにくいことは確認できても、除去のしやすさまでは確認できていませんでした。
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

      {/* ⑧ ペットがいる家庭での選び方 */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">ペットがいる家庭での選び方</h2>
        <ul className="list-inside list-disc space-y-2 text-sm text-brand-inkSoft">
          <li>
            毛絡み対策は「清掃中にブラシへ絡みにくいか」と「絡んだ毛を取り除きやすいか」を分けて確認しましょう。この2つは別の評価項目です。
          </li>
          <li>
            自動ゴミ収集の有無を確認しましょう。自動ゴミ収集があれば、本体のダストボックスを毎回手作業で空にする頻度を減らせます。手入れの手間については
            <Link href="/articles/robot-vacuum-low-maintenance" className="mx-1 font-bold text-brand-accent underline">
              手入れが楽なロボット掃除機5選
            </Link>
            でも詳しく比較しています。
          </li>
          <li>カーペット対応を確認しましょう。カーペットやラグは毛や汚れが入り込みやすい場所です。</li>
          <li>
            障害物回避の方式を確認しておきましょう。床にペット用品などが置かれていることが多い家庭では、公式に確認できる障害物回避の方式をチェックしておくと安心です。ただし、一般的な障害物回避性能からペットの排泄物まで回避できるとは判断していません。
          </li>
          <li>
            吸引力だけで判断しないようにしましょう。清掃性能全体については
            <Link
              href="/articles/robot-vacuum-cleaning-performance"
              className="mx-1 font-bold text-brand-accent underline"
            >
              清掃性能で選ぶロボット掃除機5選
            </Link>
            で詳しく解説しています。
          </li>
          <li>静音性を重視したい場合は、今回のランキングでは重みを軽くしているため、各商品ページで公式の運転音情報を個別に確認してください。</li>
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
