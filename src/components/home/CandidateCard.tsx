import Link from "next/link";
import { getOverallScoreInfo, getProductEditorial, type ProductWithScore } from "@/lib/data";
import { PriceDisplay } from "@/components/PriceDisplay";
import { ProductImage } from "@/components/ProductImage";
import { CanvasAxisScoreBadge } from "@/components/product-proto/CanvasAxisScoreBadge";

/**
 * 正規に利用できる画像（imageUrl）が無い商品では、「画像準備中」の枠を並べるのではなく
 * 画像領域そのものを省略する。無断転載・AI生成画像は使わず、利用許諾のある画像が
 * 登録された時点で自動的に表示されるようにする（products.jsonのimageUrlのみを判定に使う）。
 */
function hasLicensedImage(imageUrl: string | null): boolean {
  return imageUrl !== null;
}

/**
 * 選んだ条件（persona）が重視するAXISについて、この商品の評価情報がどちらの性質かを表す。
 * 新しい合否閾値は作らず、既存のscoreDisplayStatus・productEditorial.jsonの確認済み理由の
 * 有無だけで判定する（HomeAxisExperience.tsxのgetReasonInfoと同じ考え方を踏襲）。
 */
export type ReasonInfo = { kind: "fit" | "caution" | "unknown"; text: string };

const REASON_LABEL: Record<ReasonInfo["kind"], string> = {
  fit: "合う点",
  caution: "注意点",
  unknown: "判断できない点",
};

const REASON_STYLE: Record<ReasonInfo["kind"], string> = {
  fit: "bg-canvas-primarySoft text-canvas-primary",
  caution: "border border-dashed border-canvas-line text-canvas-inkSoft",
  unknown: "border border-dashed border-canvas-line text-canvas-inkSoft",
};

export function CandidateCard({
  item,
  reasonInfo,
}: {
  item: ProductWithScore;
  reasonInfo?: ReasonInfo;
}) {
  const { product } = item;
  const { score, status } = getOverallScoreInfo(item);
  const editorial = getProductEditorial(product.id);
  const showImage = hasLicensedImage(product.imageUrl);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-canvas-line bg-canvas-card shadow-sm transition-shadow duration-200 hover:shadow-md">
      {showImage && (
        <ProductImage
          product={product}
          aspect="aspect-[4/3]"
          className="w-full rounded-none border-0 border-b border-canvas-line"
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
        />
      )}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wide text-canvas-inkSoft">{product.brand}</p>
            <h3 className="line-clamp-2 text-base font-bold leading-snug text-canvas-ink">{product.name}</h3>
          </div>
          <div className="shrink-0">
            <CanvasAxisScoreBadge score={score} displayStatus={status ?? undefined} />
          </div>
        </div>

        {editorial?.oneLineConclusion && (
          <p className="mb-3 mt-1 text-sm text-canvas-inkSoft">{editorial.oneLineConclusion}</p>
        )}

        {reasonInfo && (
          <p
            className={`mb-3 rounded-md px-3 py-2 text-xs ${REASON_STYLE[reasonInfo.kind]}`}
          >
            <span className="font-bold">{REASON_LABEL[reasonInfo.kind]}：</span>
            {reasonInfo.text}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-canvas-line pt-3">
          <div>
            <PriceDisplay product={product} className="text-sm font-bold text-canvas-ink" />
            {product.priceCheckedAt ? (
              <p className="mt-0.5 text-[11px] text-canvas-inkSoft">
                編集部確認・{product.priceCheckedAt}時点
              </p>
            ) : (
              <p className="mt-0.5 text-[11px] text-canvas-inkSoft">価格未確認</p>
            )}
          </div>
          <Link
            href={`/robot-vacuums/${product.id}`}
            className="whitespace-nowrap text-sm font-bold text-canvas-primary underline decoration-canvas-primary/40 underline-offset-2 hover:text-canvas-primaryHover"
          >
            詳細を見る →
          </Link>
        </div>
      </div>
    </div>
  );
}
