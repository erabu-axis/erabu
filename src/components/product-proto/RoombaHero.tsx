import type { RecommendedForItem, ConsiderAlternativeItem } from "@/types/productEditorial";
import type { Product } from "@/types/product";
import { ProductImage } from "@/components/ProductImage";
import { RakutenProductImageLink } from "@/components/RakutenProductImageLink";
import { PriceDisplay } from "@/components/PriceDisplay";
import { CanvasAxisScoreBadge } from "@/components/product-proto/CanvasAxisScoreBadge";
import { getValidRakutenImageHtml } from "@/lib/rakutenSnippet";
import type { ScoreDisplayStatus } from "@/types/axis";

const REVIEW_NOTE = "メーカー公表情報に基づく評価です。編集部による実機検証は行っていません。";

/** md未満（スマホ）専用の短縮表示。products.jsonの値は変更せず、表示専用の短縮テキストとして使う。 */
const MOBILE_SHORT_NAME = "Roomba Plus 515 Combo";
const MOBILE_SUBTITLE_SUFFIX = "AutoWash充電ステーション付き";

function ProductPhoto({
  product,
  rakutenImageHtml,
  className = "",
}: {
  product: Product;
  rakutenImageHtml: string | null;
  className?: string;
}) {
  return rakutenImageHtml ? (
    <RakutenProductImageLink
      product={product}
      html={rakutenImageHtml}
      pageType="product_detail"
      placement="hero_image"
      aspect="aspect-square"
      className={`rounded-xl ${className}`}
    />
  ) : (
    <ProductImage
      product={product}
      aspect="aspect-square"
      className={`rounded-xl ${className}`}
      sizes="(min-width: 768px) 300px, 60vw"
      priority
    />
  );
}

/**
 * 合う条件・注意点。根拠（reason）まで含めて全件表示することで、後段のAXIS区画に
 * 「こんな人におすすめ」「他の商品も比較したい人」を重ねて置かなくても、独自の根拠・注意事項を失わない
 * （このページ内でここだけに表示する）。
 */
function ReasonsList({
  recommendedFor,
  considerAlternativesIf,
}: {
  recommendedFor: RecommendedForItem[];
  considerAlternativesIf: ConsiderAlternativeItem[];
}) {
  return (
    <>
      {recommendedFor.length > 0 && (
        <div className="mb-3">
          <p className="mb-1.5 text-xs font-bold text-canvas-inkSoft">どんな人に合うか</p>
          <ul className="space-y-1.5">
            {recommendedFor.map((item) => (
              <li key={item.label} className="rounded-md bg-canvas-primarySoft px-3 py-2">
                <p className="text-sm font-bold text-canvas-primary">{item.label}</p>
                <p className="mt-0.5 text-xs text-canvas-ink/80">{item.reason}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {considerAlternativesIf.length > 0 && (
        <div className="mb-5">
          <p className="mb-1.5 text-xs font-bold text-canvas-inkSoft">購入前の注意点</p>
          <ul className="space-y-1.5">
            {considerAlternativesIf.map((item) => (
              <li key={item.label} className="rounded-md border border-dashed border-canvas-line px-3 py-2">
                <p className="text-sm font-bold text-canvas-ink">{item.label}</p>
                <p className="mt-0.5 text-xs text-canvas-inkSoft">{item.reason}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

function PurchaseCta({ className = "" }: { className?: string }) {
  return (
    <a
      href="#purchase"
      className={`inline-block rounded-lg bg-canvas-primary px-6 py-3 text-sm font-bold text-white transition-colors duration-150 hover:bg-canvas-primaryHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canvas-primary ${className}`}
    >
      価格・購入先を見る →
    </a>
  );
}

/**
 * ページ上部。
 * brand・h1（見出しはページに1つだけ。テキストだけmd未満/md以上でCSS切り替え。
 * 正式なフルネームproduct.nameはmd以上側のspanとしてDOMに常に存在するため、
 * ページから失われることはない）は共通で1回だけ描画する。
 * それ以外（結論・実機未検証の明示・価格・CTA・画像・合う条件と注意点）は、
 * md未満とmd以上で並び順そのものが異なるため、ブロックごと出し分ける
 * （非表示側はdisplay:noneでアクセシビリティツリー・タブ移動には現れない）。
 * PC（md以上）は既存構成をそのまま維持：画像｜（reviewnote→結論→価格バッジ→
 * 合う条件・注意点→購入先CTA）の2カラム。
 * スマホ（md未満）は指定の順序：結論→実機未検証の明示→価格・出典・確認日→
 * 購入先CTA→商品写真→合う条件・注意点。
 * 楽天の画像リンクHTML自体（ProductPhoto経由）はどちらの構成でも無改変で使う。
 */
export function RoombaHero({
  product,
  score,
  status,
  oneLineConclusion,
  recommendedFor,
  considerAlternativesIf,
}: {
  product: Product;
  score: number | null;
  status: ScoreDisplayStatus | null;
  oneLineConclusion?: string;
  recommendedFor: RecommendedForItem[];
  considerAlternativesIf: ConsiderAlternativeItem[];
}) {
  const rakutenImageHtml = getValidRakutenImageHtml(product);
  const reviewNote = product.reviewStatus !== "実機検証済" ? REVIEW_NOTE : null;

  return (
    <section className="mb-10">
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-canvas-primary">{product.brand}</p>
      <h1 className="mb-1 text-3xl font-bold leading-tight text-canvas-ink md:mb-3">
        <span className="md:hidden">{MOBILE_SHORT_NAME}</span>
        <span className="hidden md:inline">{product.name}</span>
      </h1>
      <p className="mb-3 text-sm text-canvas-inkSoft md:hidden">
        {MOBILE_SUBTITLE_SUFFIX}／型番{product.modelNumber}
      </p>

      {/* スマホ（md未満）専用の順序 */}
      <div className="md:hidden">
        {oneLineConclusion && <p className="mb-3 text-lg font-bold text-canvas-ink">{oneLineConclusion}</p>}

        {reviewNote && (
          <p className="mb-4 inline-block rounded-md border border-dashed border-canvas-line px-3 py-2 text-xs text-canvas-inkSoft">
            {reviewNote}
          </p>
        )}

        <div className="mb-2 flex flex-wrap items-center gap-3">
          <CanvasAxisScoreBadge score={score} trademark displayStatus={status ?? undefined} />
        </div>
        <div className="mb-1">
          <PriceDisplay product={product} className="text-base font-bold text-canvas-ink" />
        </div>
        <p className="mb-5 text-xs text-canvas-inkSoft">
          出典：{product.sourceType}
          {product.priceCheckedAt && `／確認日：${product.priceCheckedAt}`}
        </p>

        <PurchaseCta className="mb-6 block text-center" />

        <ProductPhoto product={product} rakutenImageHtml={rakutenImageHtml} className="mb-6 w-full" />

        <ReasonsList recommendedFor={recommendedFor} considerAlternativesIf={considerAlternativesIf} />
      </div>

      {/* PC（md以上）：既存構成のまま */}
      <div className="hidden md:grid md:grid-cols-[300px_1fr] md:items-start md:gap-6">
        <ProductPhoto product={product} rakutenImageHtml={rakutenImageHtml} className="w-full" />

        <div>
          {reviewNote && (
            <p className="mb-4 inline-block rounded-md border border-dashed border-canvas-line px-3 py-2 text-xs text-canvas-inkSoft">
              {reviewNote}
            </p>
          )}

          {oneLineConclusion && <p className="mb-4 text-lg font-bold text-canvas-ink">{oneLineConclusion}</p>}

          <div className="mb-5 flex flex-wrap items-center gap-4">
            <CanvasAxisScoreBadge score={score} trademark displayStatus={status ?? undefined} />
            <PriceDisplay product={product} className="text-sm font-bold text-canvas-ink" />
          </div>

          <ReasonsList recommendedFor={recommendedFor} considerAlternativesIf={considerAlternativesIf} />

          <PurchaseCta />
        </div>
      </div>
    </section>
  );
}
