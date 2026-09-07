import { products } from "@/lib/data";
import type { AffiliateProvider, Product } from "@/types/product";

/** 商品単体が、指定providerの有効なアフィリエイトリンク（linkType==="affiliate"）を持つか */
export function hasEnabledAffiliateProvider(product: Product, provider: AffiliateProvider): boolean {
  return product.affiliateLinks.some((l) => l.enabled && l.provider === provider && l.linkType === "affiliate");
}

/** 複数商品（記事に登場する商品群など）の中に、指定providerの有効なアフィリエイトリンクが1件でもあるか */
export function hasAnyEnabledAffiliateProvider(
  items: { product: Product }[],
  provider: AffiliateProvider
): boolean {
  return items.some((item) => hasEnabledAffiliateProvider(item.product, provider));
}

/** サイト全体で、指定providerの有効なアフィリエイトリンクが1件でもあるか */
export function hasAnySiteEnabledAffiliateProvider(provider: AffiliateProvider): boolean {
  return products.some((p) => hasEnabledAffiliateProvider(p, provider));
}

/** 複数商品の中に、providerを問わず有効なアフィリエイトリンクが1件でもあるか（記事フッター注記の切り替えに使う） */
export function hasAnyEnabledAffiliateLink(items: { product: Product }[]): boolean {
  return items.some((item) => item.product.affiliateLinks.some((l) => l.enabled && l.linkType === "affiliate"));
}

/** サイト全体で、providerを問わず有効なアフィリエイトリンクが1件でもあるか（広告ポリシーページの文言切り替えに使う） */
export function hasAnySiteEnabledAffiliateLink(): boolean {
  return products.some((p) => p.affiliateLinks.some((l) => l.enabled && l.linkType === "affiliate"));
}
