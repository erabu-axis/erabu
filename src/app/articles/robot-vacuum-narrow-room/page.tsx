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
import { AmazonAssociatesDisclosure } from "@/components/AmazonAssociatesDisclosure";
import { ArticleAffiliateFooterNote } from "@/components/article/ArticleAffiliateFooterNote";
import { hasAnyEnabledAffiliateLink, hasAnyEnabledAffiliateProvider } from "@/lib/affiliateStatus";

const SLUG = "robot-vacuum-narrow-room";

/** 「狭い家で使いたい」既存persona（axisScoreProfiles.json: id="narrow-home"）をそのまま使う。新しいweightは作らない。 */
const PROFILE_ID = "narrow-home";

/** ⑥「条件別に選ぶなら」で見せるAXIS。quietnessは今回対象5商品中で未公表の商品が多くconfirmedなリーダーが出にくいため対象外。 */
const LEADER_AXES: AxisKey[] = ["cleaning_power", "maintainability", "price_value", "space_fit"];

/**
 * 実寸比較表の表示ルール。products.jsonのwidth/depthの値自体は変更しないが、
 * メーカー公式情報で「幅」「奥行き」が個別に明示されているかどうかは商品ごとに異なるため、
 * 明示されていない商品については「幅×奥行き」と断定せず、公式サイトに書かれている順序の
 * まま表示する（2026-09-07の追加監査結果にもとづく編集部の確認情報）。
 * - confirmed: メーカー公式ページに「幅」「奥行き」の個別ラベルがあり、それがそのまま
 *   products.jsonのbodyWidthMm/bodyDepthMm（stationも同様）の並びと一致することを確認済み。
 * - official-order: 公式ページに個別ラベルはなく「A×B×Cmm」の羅列のみ。読者の誤解を避けるため
 *   「幅×奥行き」と決めつけず「公式表記順」として、公式ページに書かれた順序で表示する。
 * swapFirstTwoForDisplay: trueの場合、表示時のみ1・2番目の数値を入れ替える
 *   （products.jsonのwidth/depthの値そのものは変更しない。表示順を公式ページの表記順に
 *   合わせるためだけの表示専用フラグ）。
 */
type DimensionLabelStatus = "confirmed" | "official-order";
interface DimensionMeta {
  status: DimensionLabelStatus;
  swapFirstTwoForDisplay?: boolean;
  /** 表示に添える注記。例："幅×奥行×高さ" "公式表記順" "日本公式表記順" */
  noteLabel: string;
}
const BODY_DIMENSION_META: Record<string, DimensionMeta> = {
  "irobot-roomba-plus-515-combo": { status: "confirmed", noteLabel: "幅×奥行×高さ" },
  "roborock-saros-20-sonic": { status: "official-order", swapFirstTwoForDisplay: true, noteLabel: "公式表記順" },
  "ecovacs-deebot-t80s-omni": { status: "confirmed", noteLabel: "幅×奥行×高さ" },
  "switchbot-s20": { status: "official-order", noteLabel: "公式表記順" },
  "eufy-robot-vacuum-omni-e25": { status: "official-order", noteLabel: "公式表記順" },
};
const STATION_DIMENSION_META: Record<string, DimensionMeta> = {
  "irobot-roomba-plus-515-combo": { status: "confirmed", noteLabel: "幅×奥行×高さ" },
  "roborock-saros-20-sonic": { status: "official-order", swapFirstTwoForDisplay: true, noteLabel: "日本公式表記順" },
  "ecovacs-deebot-t80s-omni": { status: "confirmed", noteLabel: "幅×奥行×高さ" },
  "switchbot-s20": { status: "official-order", noteLabel: "公式表記順" },
  "eufy-robot-vacuum-omni-e25": { status: "official-order", noteLabel: "公式表記順" },
};

/** 3辺（幅相当・奥行相当・高さ）を、公式の確からしさに応じた注記つきで1セル分の文字列にする。 */
function formatDimensionCell(
  a: number | null,
  b: number | null,
  h: number | null,
  meta: DimensionMeta | undefined
): string {
  if (a === null || b === null || h === null || !meta) return "非公表";
  const [first, second] = meta.swapFirstTwoForDisplay ? [b, a] : [a, b];
  return `${first} × ${second} × ${h} mm（${meta.noteLabel}）`;
}

/** 「今回比較した5商品では」の設置面積ハイライト用。幅×奥行きの2辺のみを同じ注記ルールで表示する。 */
function formatFootprintPair(w: number | null, d: number | null, meta: DimensionMeta | undefined): string {
  if (w === null || d === null || !meta) return "非公表";
  const [first, second] = meta.swapFirstTwoForDisplay ? [d, w] : [w, d];
  const label = meta.status === "confirmed" ? "幅×奥行" : "公式表記順";
  return `${first}mm × ${second}mm（${label}）`;
}

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "狭い家・1LDK向けロボット掃除機5選｜置きやすさ・本体サイズまで比較 | えらぶ。",
    description:
      "マンション・1LDK〜3LDKなど狭い家向けに、ロボット掃除機を清掃性能・静音性・メンテナンス性・住宅適合性・価格対効果の5つの軸で比較しました。本体・ステーションの実寸（幅・奥行き・高さ）と段差対応を5商品横並びで確認できます。",
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
          { label: comparison?.title ?? "狭い家・1LDK向けロボット掃除機5選" },
        ]}
      />
      {hasAnyEnabledAffiliateProvider(items, "amazon") && <AmazonAssociatesDisclosure />}
      {/* ① ファーストビュー */}
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-accent">比較記事</p>
      <h1 className="mb-4 text-3xl font-bold">{comparison?.title ?? "狭い家・1LDK向けロボット掃除機5選｜置きやすさ・本体サイズまで比較"}</h1>
      <div className="mb-10 space-y-3 text-brand-inkSoft">
        <p>
          狭い家・1LDKやマンションでロボット掃除機を選ぶときは、吸引力などの清掃性能だけでなく、本体とステーションが実際に部屋に収まるかどうかが重要です。家具が多い部屋では家具下に本体が入らなかったり、ステーションの置き場所を確保できなかったりすることがあり、購入後に気づいて後悔しやすいポイントだからです。本体の高さ・本体サイズ・ステーションの設置スペース・段差への対応・障害物回避性能まで、購入前に公式情報で確認しておくと安心です。
        </p>
        <p>
          「えらぶ。」では今回、AXIS SCORE™の5軸のうち「住宅適合性」の重みを高くした比較を行い、狭い家での置きやすさ・使いやすさを重視して5商品を比較しました。あわせて、本体・ステーションの実寸も5商品横並びで確認できるようにまとめています。
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

      {/* ③.5 狭い家向け 実寸比較 */}
      <section className="mb-10">
        <h2 className="mb-2 text-lg font-bold">狭い家向け 実寸比較</h2>
        <p className="mb-4 text-sm text-brand-inkSoft">
          AXIS SCORE™の住宅適合性は複数の項目を採点した総合値のため、そのままでは「実際に部屋に収まるか」を判断しづらい場合があります。ここでは、採点の元になっているメーカー公表の実寸データを、5商品分そのまま並べました。
        </p>
        <div className="overflow-x-auto rounded-lg border border-brand-line">
          <table className="w-full min-w-[640px] border-collapse bg-brand-card text-sm">
            <thead>
              <tr className="bg-brand-bgRaised text-left text-brand-inkSoft">
                <th className="px-4 py-3 font-bold">商品名</th>
                <th className="px-4 py-3 font-bold">本体サイズ</th>
                <th className="px-4 py-3 font-bold">ステーションサイズ</th>
                <th className="whitespace-nowrap px-4 py-3 font-bold">段差対応</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const p = item.product;
                return (
                  <tr key={p.id} className="border-t border-brand-line align-top">
                    <td className="px-4 py-3">
                      <Link href={`/robot-vacuums/${p.id}`} className="font-bold text-brand-accent underline">
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 tabular-nums text-brand-inkSoft">
                      {formatDimensionCell(p.bodyWidthMm, p.bodyDepthMm, p.bodyHeightMm, BODY_DIMENSION_META[p.id])}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-brand-inkSoft">
                      {formatDimensionCell(
                        p.stationWidthMm,
                        p.stationDepthMm,
                        p.stationHeightMm,
                        STATION_DIMENSION_META[p.id]
                      )}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-brand-inkSoft">
                      {p.stepClimbingMm !== null ? `${p.stepClimbingMm}mm` : "非公表"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-brand-inkSoft">
          寸法の幅・奥行き・高さは、メーカーが各方向を明示している場合のみその表記を使用しています。方向の明示がない商品はメーカー公式サイトの表記順で掲載しています。設置前はメーカー公式情報もあわせてご確認ください。
        </p>
        <p className="mt-1 text-xs text-brand-inkSoft">
          Saros 20 Sonicの充電ドックの寸法は日本公式サイトの表記順です。公式サイト間で寸法の並び順が異なるため、幅・奥行きの断定はしていません。
        </p>
        <p className="mt-1 text-xs text-brand-inkSoft">
          「非公表」は性能が低いという意味ではなく、公式に数値が確認できていないことを示します。
        </p>

        <div className="mt-5 space-y-2 text-sm text-brand-inkSoft">
          <p className="font-bold text-brand-ink">この数字から分かること</p>
          <ul className="list-inside list-disc space-y-1.5">
            <li>家具下に入れるか → 本体の高さと、家具下の実寸（家具の脚の高さなど）を見比べます。</li>
            <li>ステーションを置けるか → 幅だけでなく奥行きも確認します。自動ゴミ収集・自動洗浄付きは奥行きが大きくなりがちです。</li>
            <li>
              設置スペースは、本体・ステーションの寸法ぴったりではなく、出入りや給水タンクの補充・ゴミパックの交換など、メンテナンスのための余白も必要です。必要な余白の目安はメーカーごとに異なり、公式情報で確認できていない商品もあるため、購入前に各商品の設置説明・メーカー公式サイトで確認することをおすすめします。
            </li>
            <li>段差がある家 → 公表されている乗り越え高さを確認します。「非公表」は乗り越えられないという意味ではなく、確認できていないだけです。</li>
          </ul>
        </div>
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
          <li>本体の「幅」だけでなく「高さ」も確認する。家具の下に入り込ませたい場合は、家具下の実寸を先に測り、上の実寸比較表の本体高さと見比べておくと確実です。</li>
          <li>ステーションの設置面積（幅×奥行き）を確認する。自動ゴミ収集・自動洗浄機能付きは本体よりステーションが大きくなりがちです。</li>
          <li>家具や障害物が多い部屋では、障害物回避やマッピングの方式も確認しておくと安心です。</li>
          <li>椅子やテーブルの脚の間隔も確認しておきましょう。脚の間隔が本体の幅より狭いと、その場所だけ清掃できずに残ることがあります。</li>
          <li>玄関の段差やラグの厚みが気になる場合は、段差乗り越え性能を確認しましょう。</li>
          <li>ステーションの周囲や前方にも、給水タンクの補充やゴミパックの交換、本体の出入りのためのスペースが必要です。</li>
        </ul>
        <p className="mt-4 text-sm text-brand-inkSoft">
          今回の5商品以外もあわせて比較したい場合は、
          <Link href="/robot-vacuums" className="mx-1 font-bold text-brand-accent underline">
            ロボット掃除機の比較一覧
          </Link>
          からAXIS SCORE™とあわせて確認できます。
        </p>
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
                （
                {formatFootprintPair(
                  smallestStationProduct.stationWidthMm,
                  smallestStationProduct.stationDepthMm,
                  STATION_DIMENSION_META[smallestStationProduct.id]
                )}
                ）でした。
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
        <ArticleAffiliateFooterNote hasAffiliateLink={hasAnyEnabledAffiliateLink(items)} />
      </section>
    </article>
  );
}
