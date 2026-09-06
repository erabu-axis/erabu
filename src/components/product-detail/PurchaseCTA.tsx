import type { Product } from "@/types/product";
import { PriceDisplay } from "@/components/PriceDisplay";

/**
 * 価格・購入先。affiliateLinksが空の場合、Amazon等のURLを推測して作らず、
 * 確認済みのsourceUrl（メーカー公式サイト）のみをフォールバック表示する。
 * 将来affiliateLinksが追加されたら、このコンポーネントの変更なしでボタンが増える。
 */
export function PurchaseCTA({ product }: { product: Product }) {
  return (
    <section id="purchase" className="mb-10 scroll-mt-24">
      <h2 className="mb-3 text-lg font-bold">価格・購入先</h2>
      <PriceDisplay product={product} variant="detailed" className="mb-4" />

      {product.affiliateLinks.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {product.affiliateLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="rounded-full border border-brand-line px-5 py-2 text-sm font-bold text-brand-ink hover:border-brand-accent hover:text-brand-accent"
            >
              {link.label}
            </a>
          ))}
        </div>
      ) : product.sourceUrl ? (
        <>
          <a
            href={product.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full border border-brand-line px-5 py-2 text-sm font-bold text-brand-ink hover:border-brand-accent hover:text-brand-accent"
          >
            メーカー公式サイトで詳細を見る
          </a>
          <p className="mt-2 text-xs text-brand-inkSoft">
            購入先リンクは準備中です。現時点ではメーカー公式サイトでご確認ください。
          </p>
        </>
      ) : (
        <p className="text-sm text-brand-inkSoft">購入先情報は準備中です。</p>
      )}
    </section>
  );
}
