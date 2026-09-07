import type { Product } from "@/types/product";
import { PriceDisplay } from "@/components/PriceDisplay";
import { PurchaseButtons } from "@/components/PurchaseButtons";

/**
 * 価格・購入先。affiliateLinksが空の場合、Amazon等のURLを推測して作らず、
 * 確認済みのsourceUrl（メーカー公式サイト）のみをフォールバック表示する
 * （PurchaseButtons内のresolveLinksが担う）。
 * 将来affiliateLinksが追加されたら、このコンポーネントの変更なしでボタンが増える。
 */
export function PurchaseCTA({ product }: { product: Product }) {
  const hasAnyLink = product.affiliateLinks.some((l) => l.enabled) || !!product.sourceUrl;

  return (
    <section id="purchase" className="mb-10 scroll-mt-24">
      <h2 className="mb-3 text-lg font-bold">価格・購入先</h2>
      <PriceDisplay product={product} variant="detailed" className="mb-4" />

      {hasAnyLink ? (
        <>
          <PurchaseButtons product={product} pageType="product_detail" placement="purchase_section" variant="full" />
          {product.affiliateLinks.filter((l) => l.enabled).length === 0 && (
            <p className="mt-2 text-xs text-brand-inkSoft">
              販売店（Amazon・楽天市場等）の購入先リンクは準備中です。現時点ではメーカー公式サイトでご確認ください。
            </p>
          )}
        </>
      ) : (
        <p className="text-sm text-brand-inkSoft">購入先情報は準備中です。</p>
      )}
    </section>
  );
}
