import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReviewStatus } from "@/types/product";
import {
  axisDefinitions,
  axisScoreProfiles,
  getAxisLeaders,
  getOverallScoreInfo,
  getProductAxisScores,
  getProductEditorial,
  getProductWithScore,
  products,
} from "@/lib/data";
import { DisplayAwareAxisScoreBreakdown } from "@/components/DisplayAwareAxisScoreBreakdown";
import { ProductHero } from "@/components/product-detail/ProductHero";
import { ProductVerdict } from "@/components/product-detail/ProductVerdict";
import { PersonaScoreSwitcher } from "@/components/product-detail/PersonaScoreSwitcher";
import { RecommendedFor } from "@/components/product-detail/RecommendedFor";
import { ConsiderAlternatives } from "@/components/product-detail/ConsiderAlternatives";
import { CompareWithOthers } from "@/components/product-detail/CompareWithOthers";
import { ProductSpecTable } from "@/components/product-detail/ProductSpecTable";
import { PurchaseCTA } from "@/components/product-detail/PurchaseCTA";
import { AxisScoreMethodologyTeaser } from "@/components/product-detail/AxisScoreMethodologyTeaser";
import { AmazonAssociatesDisclosure } from "@/components/AmazonAssociatesDisclosure";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { buildPageMetadata } from "@/lib/site-config";
import { hasEnabledAffiliateProvider } from "@/lib/affiliateStatus";

/** 公開する商品詳細ページはdataType==="real"のみ。sample（開発・回帰テスト用データ）は
 *  products.json自体からは削除しないが、静的生成の対象外にする。 */
export function generateStaticParams() {
  return products.filter((p) => p.dataType === "real").map((p) => ({ productId: p.id }));
}

/** generateStaticParamsが返さないproductId（sample商品を含む）はnotFoundとして扱う。 */
export const dynamicParams = false;

const COMPARE_AXES = ["cleaning_power", "maintainability", "price_value"] as const;

/** reviewStatusの内部区分名をそのまま出さず、読者向けの自然な言い回しに置き換える。 */
const REVIEW_STATUS_LABEL: Record<ReviewStatus, string> = {
  未検証: "確認作業前",
  実機検証済: "編集部による実機検証済み",
  情報のみ: "メーカー公表情報の確認のみ（実機未検証）",
};

export function generateMetadata({ params }: { params: { productId: string } }): Metadata {
  const item = getProductWithScore(params.productId);
  if (!item) return {};
  const { product } = item;
  const editorial = getProductEditorial(product.id);

  const title = `${product.name}のAXIS SCORE™評価 | えらぶ。`;
  const description = editorial?.oneLineConclusion
    ? `${editorial.oneLineConclusion}清掃性能・静音性・メンテナンス性・住宅適合性・価格対効果の5つのAXIS SCORE™で評価しています。`
    : `${product.name}を、清掃性能・静音性・メンテナンス性・住宅適合性・価格対効果の5つのAXIS SCORE™で評価しています。`;

  return buildPageMetadata({ title, description, path: `/robot-vacuums/${product.id}` });
}

export default function ProductDetailPage({ params }: { params: { productId: string } }) {
  const item = getProductWithScore(params.productId);
  if (!item || item.product.dataType !== "real" || !item.displayAwareResult) notFound();

  const { product, displayAwareResult } = item;
  const scores = getProductAxisScores(product.id);
  const { score, status } = getOverallScoreInfo(item);
  const editorial = getProductEditorial(product.id);
  const axisLeaders = getAxisLeaders(product.id, [...COMPARE_AXES]);

  return (
    <div className="max-w-3xl">
      <Breadcrumbs
        items={[
          { label: "ホーム", href: "/" },
          { label: "商品を比較", href: "/robot-vacuums" },
          { label: product.name },
        ]}
      />
      {hasEnabledAffiliateProvider(product, "amazon") && <AmazonAssociatesDisclosure />}
      <ProductHero
        product={product}
        score={score}
        status={status}
        oneLineConclusion={editorial?.oneLineConclusion}
        recommendedFor={editorial?.recommendedFor ?? []}
      />

      {editorial && <ProductVerdict paragraphs={editorial.verdictParagraphs} />}

      {scores && (
        <PersonaScoreSwitcher productScores={scores} axisDefinitions={axisDefinitions} profiles={axisScoreProfiles} />
      )}

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-bold">AXIS SCORE™ 内訳</h2>
        {scores && <DisplayAwareAxisScoreBreakdown result={displayAwareResult} axisDefinitions={axisDefinitions} scores={scores} />}
      </section>

      {editorial && <RecommendedFor items={editorial.recommendedFor} />}

      {editorial && <ConsiderAlternatives items={editorial.considerAlternativesIf} />}

      <CompareWithOthers leaders={axisLeaders} axisDefinitions={axisDefinitions} />

      <ProductSpecTable product={product} />

      {product.features && product.features.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-lg font-bold">その他の公表情報</h2>
          <ul className="list-inside list-disc space-y-1 text-sm text-brand-inkSoft">
            {product.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>
      )}

      <PurchaseCTA product={product} />

      <AxisScoreMethodologyTeaser />

      <section className="text-xs text-brand-inkSoft">
        <p>
          検証方法：{REVIEW_STATUS_LABEL[product.reviewStatus]} ／ 情報源：{product.sourceType} ／ 最終確認日：
          {product.verifiedAt}
          {product.sourceUrl && (
            <>
              {" "}
              ／{" "}
              <a href={product.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
                一次情報を見る
              </a>
            </>
          )}
        </p>
      </section>
    </div>
  );
}
