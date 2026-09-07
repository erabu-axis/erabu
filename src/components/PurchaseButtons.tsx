"use client";

import type { AffiliateLink, AffiliateProvider, Product } from "@/types/product";
import { trackPurchaseLinkClick, type PurchaseLinkPageType } from "@/lib/analytics";
import { checkRakutenSnippet } from "@/lib/rakutenSnippet";
import { RakutenSnippet } from "@/components/RakutenSnippet";

/** 販売店ごとの表示ラベル。遷移先と行動が分かる文言にする。 */
const PROVIDER_LABEL: Record<AffiliateProvider, string> = {
  rakuten: "楽天市場で価格を確認",
  amazon: "Amazonで価格を確認",
  yahoo: "Yahoo!ショッピングで価格を確認",
  official: "メーカー公式で確認",
  other: "販売サイトで価格を確認",
};

interface StandardResolvedLink {
  kind: "standard";
  id: string;
  provider: AffiliateProvider;
  label: string;
  url: string;
  linkType: "affiliate" | "official";
  price: number | null;
  priceCheckedAt: string | null;
}

interface RakutenResolvedLink {
  kind: "rakuten-html";
  id: string;
  html: string;
  price: number | null;
  priceCheckedAt: string | null;
}

type ResolvedLink = StandardResolvedLink | RakutenResolvedLink;

/**
 * 表示するリンク一覧を組み立てる。
 * - product.affiliateLinksのうちenabled===trueのものだけを対象にする（掲載可否）。
 * - provider==="rakuten"は、共通の<a href>方式にせず、楽天アフィリエイトツールが生成した
 *   rawHtml（rakutenHtml）をそのまま表示する専用の扱いにする（公式ガイドライン準拠）。
 *   rakutenHtmlが未設定、または安全性チェック（checkRakutenSnippet）に通らない場合は、
 *   URLだけを使った代替表示は行わず、そのリンク自体を一覧から除外する（コンソールに理由を出力）。
 * - officialタイプのリンクが1件もない場合のみ、確認済みのsourceUrl（メーカー公式サイト）を
 *   通常リンクとして補う（アフィリエイトリンクが無くても公式リンクは出してよい、という既存方針）。
 * - アフィリエイトIDやURLを推測で生成することはしない。
 */
function resolveLinks(product: Product): ResolvedLink[] {
  const enabled = product.affiliateLinks.filter((l): l is AffiliateLink => l.enabled);
  const hasOfficial = enabled.some((l) => l.provider === "official");

  const resolved: ResolvedLink[] = [];

  for (const l of enabled) {
    if (l.provider === "rakuten") {
      const check = checkRakutenSnippet(l.rakutenHtml);
      if (!check.safe) {
        console.error(
          `[PurchaseButtons] product=${product.id} link=${l.id} の楽天リンクを表示から除外しました: ${check.reason}`
        );
        continue;
      }
      resolved.push({
        kind: "rakuten-html",
        id: l.id,
        html: l.rakutenHtml as string,
        price: l.price,
        priceCheckedAt: l.priceCheckedAt,
      });
      continue;
    }

    resolved.push({
      kind: "standard",
      id: l.id,
      provider: l.provider,
      label: l.label || PROVIDER_LABEL[l.provider],
      url: l.url,
      linkType: l.linkType,
      price: l.price,
      priceCheckedAt: l.priceCheckedAt,
    });
  }

  if (!hasOfficial && product.sourceUrl && product.sourceType === "メーカー公式サイト") {
    resolved.push({
      kind: "standard",
      id: "official-fallback",
      provider: "official",
      label: PROVIDER_LABEL.official,
      url: product.sourceUrl,
      linkType: "official",
      // 公式サイトのfallbackリンクには、メーカー公式で確認済みのreferencePrice/currentPriceを
      // 別途PriceDisplayで表示するため、ここではリンク単体の価格は持たせない（二重表示を避ける）。
      price: null,
      priceCheckedAt: null,
    });
  }

  return resolved;
}

export function PurchaseButtons({
  product,
  pageType,
  placement,
  articleId,
  variant = "compact",
}: {
  product: Product;
  pageType: PurchaseLinkPageType;
  /** 冒頭／商品カード／購入先欄など、計測用の配置識別子 */
  placement: string;
  /** pageType==="article"のときの記事slug */
  articleId?: string;
  /** compact: ボタンのみ。full: 販売店固有の価格があれば併記する。 */
  variant?: "compact" | "full";
}) {
  const links = resolveLinks(product);
  if (links.length === 0) return null;
  const hasAffiliateLink = links.some(
    (l) => (l.kind === "standard" && l.linkType === "affiliate") || l.kind === "rakuten-html"
  );

  return (
    <div>
      {hasAffiliateLink && (
        <p className="mb-1.5 text-xs font-bold text-brand-inkSoft">
          PR：一部のリンクはアフィリエイトプログラムによる広告を含みます
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        {links.map((link) => {
          if (link.kind === "rakuten-html") {
            return (
              <div
                key={link.id}
                className="inline-flex flex-col items-start rounded-full border border-brand-line px-5 py-2 text-sm font-bold text-brand-ink hover:border-brand-accent hover:text-brand-accent"
              >
                <RakutenSnippet
                  html={link.html}
                  productId={product.id}
                  pageType={pageType}
                  articleId={articleId}
                  placement={placement}
                />
                {variant === "full" && link.price !== null && (
                  <span className="text-xs font-normal tabular-nums text-brand-inkSoft">
                    {link.price.toLocaleString()}円{link.priceCheckedAt ? `（${link.priceCheckedAt}確認）` : ""}
                  </span>
                )}
              </div>
            );
          }

          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel={link.linkType === "affiliate" ? "noopener noreferrer sponsored" : "noopener noreferrer"}
              onClick={() =>
                trackPurchaseLinkClick({
                  product_id: product.id,
                  merchant: link.provider,
                  page_type: pageType,
                  article_id: articleId,
                  placement,
                  link_type: link.linkType,
                })
              }
              className="inline-flex flex-col items-start rounded-full border border-brand-line px-5 py-2 text-sm font-bold text-brand-ink hover:border-brand-accent hover:text-brand-accent"
            >
              <span>{link.label}</span>
              {variant === "full" && link.price !== null && (
                <span className="text-xs font-normal tabular-nums text-brand-inkSoft">
                  {link.price.toLocaleString()}円{link.priceCheckedAt ? `（${link.priceCheckedAt}確認）` : ""}
                </span>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}
