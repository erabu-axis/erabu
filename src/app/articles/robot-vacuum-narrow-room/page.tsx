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
import { ArticleRankingGroups } from "@/components/article/ArticleRankingGroups";
import { ArticleWhyThisRanking } from "@/components/article/ArticleWhyThisRanking";
import { ArticleProductEvaluationCards } from "@/components/article/ArticleProductEvaluationCards";
import { CompareWithOthers } from "@/components/product-detail/CompareWithOthers";
import { AxisScoreMethodologyTeaser } from "@/components/product-detail/AxisScoreMethodologyTeaser";
import { ArticleRelatedArticles } from "@/components/article/ArticleRelatedArticles";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { buildPageMetadata } from "@/lib/site-config";

const SLUG = "robot-vacuum-narrow-room";

/** 「狭い家で使いたい」既存persona（axisScoreProfiles.json: id="narrow-home"）をそのまま使う。新しいweightは作らない。 */
const PROFILE_ID = "narrow-home";

/** ⑥「条件別に選ぶなら」で見せるAXIS。quietnessは今回対象5商品中で未公表の商品が多くconfirmedなリーダーが出にくいため対象外。 */
const LEADER_AXES: AxisKey[] = ["cleaning_power", "maintainability", "price_value", "space_fit"];

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "狭い家・マンション向けロボット掃除機5選｜5つの軸で比較 | えらぶ。",
    description:
      "マンション・1LDK〜3LDK程度の狭い家向けに、ロボット掃除機を清掃性能・静音性・メンテナンス性・住宅適合性・価格対効果の5つの軸で比較しました。本体サイズやステーションの設置スペースまで確認できる商品を中心に紹介します。",
    path: `/articles/${SLUG}`,
  });
}

export default function NarrowRoomArticlePage() {
  const comparison = getComparison(SLUG);
  const profile = getProfile(PROFILE_ID);
  const highlightAxis = getHighlightAxis(profile);

  // 既存のcalculateDisplayAwareAxisScore・getSortableScoreをそのまま使い、
  // 「狭い家で使いたい」persona weightでリアル5商品を再計算・並び替える。数値のハードコードはしない。
  const items = [...getProductsWithScores(PROFILE_ID)].sort(
    (a, b) => getSortableScore(b) - getSortableScore(a)
  );

  // 「他の候補と迷ったら」と同じgetAxisLeadersを、除外商品なし（全商品が候補）で呼ぶだけ。新しい推薦ロジックは作らない。
  const axisLeaders = getAxisLeaders("", LEADER_AXES);

  const spaceFitDef = axisDefinitions.find((d) => d.axisKey === "space_fit");
  const spaceFitWeightPct = formatWeightPct(profile.weights.space_fit);
  const otherAxisWeightPct = formatWeightPct(profile.weights.cleaning_power);

  // 商品固有の事実はproducts.jsonの値だけを使い、その場で計算する（本文への手入力はしない）。
  const realProducts = products.filter((p) => p.dataType === "real");
  const productsWithBodyHeight = realProducts.filter(
    (p): p is typeof p & { bodyHeightMm: number } => p.bodyHeightMm !== null
  );
  const shortestBodyProduct =
    productsWithBodyHeight.length > 0
      ? productsWithBodyHeight.reduce((min, p) => (p.bodyHeightMm < min.bodyHeightMm ? p : min))
      : null;
  const productsWithStationFootprint = realProducts.filter(
    (p): p is typeof p & { stationWidthMm: number; stationDepthMm: number } =>
      p.stationWidthMm !== null && p.stationDepthMm !== null
  );
  const smallestStationProduct =
    productsWithStationFootprint.length > 0
      ? productsWithStationFootprint.reduce((min, p) =>
          p.stationWidthMm * p.stationDepthMm < min.stationWidthMm * min.stationDepthMm ? p : min
        )
      : null;

  return (
    <article className="max-w-3xl">
      <Breadcrumbs
        items={[
          { label: "ホーム", href: "/" },
          { label: "比較記事", href: "/articles" },
          { label: comparison?.title ?? "狭い家・マンション向けロボット掃除機5選" },
        ]}
      />
      {/* ① ファーストビュー */}
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-accent">比較記事</p>
      <h1 className="mb-4 text-3xl font-bold">{comparison?.title ?? "狭い家・マンション向けロボット掃除機5選｜置きやすさまで比較"}</h1>
      <div className="mb-10 space-y-3 text-brand-inkSoft">
        <p>
          狭い家・マンションでロボット掃除機を選ぶときは、吸引力などの清掃性能だけでなく、本体サイズ・本体の高さ・ステーションの設置スペース・段差への対応・障害物回避・マッピング性能も同じくらい重要です。家具の下に入るか、玄関の段差を越えられるか、ステーションを置くスペースが確保できるかは、実際に使い始めてから気づきやすいポイントだからです。
        </p>
        <p>
          「えらぶ。」では今回、AXIS SCORE™の5軸のうち「住宅適合性」の重みを高くした比較を行い、狭い家での置きやすさ・使いやすさを重視して5商品を比較しました。
        </p>
      </div>

      {/* ② 先に結論 */}
      <ArticleRankingGroups
        items={items}
        heading="先に結論：狭い家で使いたい人向けランキング"
        personaName="狭い家で使いたい"
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
        primaryAxisLabel={spaceFitDef?.label ?? "住宅適合性"}
        primaryAxisWeightPct={spaceFitWeightPct}
        otherAxisWeightPct={otherAxisWeightPct}
        reasonSentence="狭い家では本体・ステーションの置きやすさが使い勝手を大きく左右するため、この軸を特に重視しています。"
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

      {/* ⑦ 狭い家での選び方 */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">狭い家での選び方</h2>
        <ul className="list-inside list-disc space-y-2 text-sm text-brand-inkSoft">
          <li>本体の「幅」だけでなく「高さ」も確認する。家具の下に入り込めるかは高さで決まります。</li>
          <li>ステーションの設置面積（幅×奥行き）を確認する。自動ゴミ収集・自動洗浄機能付きは本体よりステーションが大きくなりがちです。</li>
          <li>家具や障害物が多い部屋では、障害物回避やマッピングの方式も確認しておくと安心です。</li>
          <li>玄関の段差やラグの厚みが気になる場合は、段差乗り越え性能を確認しましょう。</li>
          <li>ステーションの周囲にも、給水タンクの補充やゴミパックの交換などメンテナンス用のスペースが必要です。</li>
        </ul>
        {(shortestBodyProduct || smallestStationProduct) && (
          <div className="mt-4 rounded-lg border border-brand-line bg-brand-card p-4 text-sm text-brand-inkSoft">
            <p className="mb-1 font-bold text-brand-ink">今回比較した5商品では</p>
            {shortestBodyProduct && (
              <p>
                本体の高さが最も低いのは
                <Link href={`/robot-vacuums/${shortestBodyProduct.id}`} className="mx-1 font-bold text-brand-accent underline">
                  {shortestBodyProduct.name}
                </Link>
                （{shortestBodyProduct.bodyHeightMm}mm）でした。
              </p>
            )}
            {smallestStationProduct && (
              <p>
                ステーションの設置面積が最も小さいのは
                <Link href={`/robot-vacuums/${smallestStationProduct.id}`} className="mx-1 font-bold text-brand-accent underline">
                  {smallestStationProduct.name}
                </Link>
                （{smallestStationProduct.stationWidthMm}mm × {smallestStationProduct.stationDepthMm}mm）でした。
              </p>
            )}
          </div>
        )}
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
        <p className="mt-1">現時点でアフィリエイトリンクは設定していません。購入先は各商品詳細ページのメーカー公式サイトリンクをご利用ください。</p>
      </section>
    </article>
  );
}
