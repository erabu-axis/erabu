import type { ScoreDisplayStatus } from "@/types/axis";
import type { Product } from "@/types/product";
import type { ProductAxisScores } from "@/types/axis";
import type { DisplayAwareAxisScoreResult } from "@/lib/axisScore";
import type { ProductEditorial } from "@/types/productEditorial";
import type { AxisLeader } from "@/lib/data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AmazonAssociatesDisclosure } from "@/components/AmazonAssociatesDisclosure";
import { ProductSpecTable } from "@/components/product-detail/ProductSpecTable";
import { AxisScoreMethodologyTeaser } from "@/components/product-detail/AxisScoreMethodologyTeaser";
import { hasEnabledAffiliateProvider } from "@/lib/affiliateStatus";
import { RoombaHero } from "./RoombaHero";
import { RoombaPurchasePanel } from "./RoombaPurchasePanel";
import { RoombaFootprintSection } from "./RoombaFootprintSection";
import { RoombaMaintenanceSection } from "./RoombaMaintenanceSection";
import { RoombaAxisSection } from "./RoombaAxisSection";

const REVIEW_STATUS_LABEL: Record<string, string> = {
  未検証: "確認作業前",
  実機検証済: "編集部による実機検証済み",
  情報のみ: "メーカー公表情報の確認のみ（実機未検証）",
};

/**
 * Roomba Plus 515 Combo（irobot-roomba-plus-515-combo）専用の商品詳細ページ試作。
 * [productId]/page.tsxからこの商品のときだけ呼ばれ、他4商品は従来のJSX（変更なし）を使う。
 * 情報の並び順：商品名→短い結論→合う条件・注意点→価格→購入先→設置サイズ→
 * できることと残る手入れ→AXIS SCORE™・評価根拠→詳細仕様、の順（11.の指定どおり）。
 */
export function RoombaDetailPage({
  product,
  score,
  status,
  editorial,
  scores,
  displayAwareResult,
  axisLeaders,
}: {
  product: Product;
  score: number | null;
  status: ScoreDisplayStatus | null;
  editorial?: ProductEditorial;
  scores?: ProductAxisScores;
  displayAwareResult: DisplayAwareAxisScoreResult;
  axisLeaders: AxisLeader[];
}) {
  return (
    <div className="-mx-6 -my-10 max-w-4xl bg-canvas-bg px-6 py-10">
      <Breadcrumbs
        items={[
          { label: "ホーム", href: "/" },
          { label: "ロボット掃除機", href: "/robot-vacuums" },
          {
            label: (
              <>
                <span className="md:hidden">Roomba Plus 515 Combo</span>
                <span className="hidden md:inline">{product.name}</span>
              </>
            ),
          },
        ]}
      />
      {hasEnabledAffiliateProvider(product, "amazon") && <AmazonAssociatesDisclosure />}

      <RoombaHero
        product={product}
        score={score}
        status={status}
        oneLineConclusion={editorial?.oneLineConclusion}
        recommendedFor={editorial?.recommendedFor ?? []}
        considerAlternativesIf={editorial?.considerAlternativesIf ?? []}
      />

      <RoombaPurchasePanel product={product} />

      <RoombaFootprintSection product={product} />

      <RoombaMaintenanceSection />

      {scores && (
        <RoombaAxisSection scores={scores} displayAwareResult={displayAwareResult} axisLeaders={axisLeaders} />
      )}

      <ProductSpecTable product={product} />

      {product.features && product.features.length > 0 && (
        <section className="mb-10 rounded-2xl border border-canvas-line bg-canvas-card p-5 sm:p-6">
          <h2 className="mb-3 text-lg font-bold text-canvas-ink">その他の公表情報</h2>
          <ul className="list-inside list-disc space-y-1 text-sm text-canvas-inkSoft">
            {product.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>
      )}

      <AxisScoreMethodologyTeaser />

      <section className="text-xs text-canvas-inkSoft">
        <p>
          検証方法：{REVIEW_STATUS_LABEL[product.reviewStatus] ?? product.reviewStatus} ／ 情報源：{product.sourceType}
          ／ 最終確認日：{product.verifiedAt}
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
