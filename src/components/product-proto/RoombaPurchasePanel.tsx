"use client";

import type { Product } from "@/types/product";
import { resolveLinks } from "@/components/PurchaseButtons";
import { RakutenSnippet } from "@/components/RakutenSnippet";
import { PriceDisplay } from "@/components/PriceDisplay";
import { trackPurchaseLinkClick } from "@/lib/analytics";

const PROVIDER_PANEL_LABEL: Record<string, string> = {
  rakuten: "楽天市場",
  amazon: "Amazon",
  yahoo: "Yahoo!ショッピング",
  official: "メーカー公式",
  other: "販売サイト",
};

/**
 * 価格・購入先パネル。resolveLinks（PurchaseButtons.tsxからexport済み・ロジック無変更）で
 * 解決したリンク一覧を、丸い巨大CTAボタンではなく縦積みの購入先パネルとして見せる。
 * 楽天の生成HTML（URL・文言・属性・構造）はRakutenSnippetにそのまま渡し、一切改変しない。
 * Amazonはproducts.jsonでenabled:falseのため、resolveLinksの時点で結果に含まれず無効のまま。
 */
export function RoombaPurchasePanel({ product }: { product: Product }) {
  const links = resolveLinks(product);
  const hasAffiliateLink = links.some(
    (l) => (l.kind === "standard" && l.linkType === "affiliate") || l.kind === "rakuten-html"
  );

  return (
    <section id="purchase" className="mb-10 scroll-mt-24 rounded-2xl border border-canvas-line bg-canvas-card p-5 sm:p-6">
      <h2 className="mb-1 text-lg font-bold text-canvas-ink">価格・購入先</h2>
      {/*
        金額・出典・確認日を同じ場所に表示する。この価格はproduct.sourceType（メーカー公式サイト）で
        編集部が確認した価格であり、下の販売店リンク（楽天・メーカー公式）ごとの価格とは別物として扱う。
        楽天側の価格が別途確認できている場合のみ、そのリンク行自体に表示する（下記、link.price参照）。
        販売店固有の価格が未確認の場合はここでは作らない（resolveLinksのlink.priceがnullのままなら
        リンク行に価格を出さない、という既存ロジックをそのまま使う）。
      */}
      <div className="mb-5">
        <PriceDisplay product={product} variant="detailed" />
        <p className="mt-1 text-xs text-canvas-inkSoft">出典：{product.sourceType}</p>
      </div>

      {hasAffiliateLink && (
        <p className="mb-3 text-xs font-bold text-canvas-inkSoft">
          PR：一部のリンクはアフィリエイトプログラムによる広告を含みます
        </p>
      )}

      {links.length === 0 ? (
        <p className="text-sm text-canvas-inkSoft">購入先情報は準備中です。</p>
      ) : (
        <ul className="space-y-2.5">
          {links.map((link) => {
            const label =
              link.kind === "rakuten-html" ? PROVIDER_PANEL_LABEL.rakuten : PROVIDER_PANEL_LABEL[link.provider];
            return (
              <li
                key={link.id}
                className="rounded-lg border border-canvas-line px-4 py-3 transition-colors duration-150 hover:border-canvas-primary"
              >
                <div className="mb-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="text-sm font-bold text-canvas-ink">{label}で確認</span>
                  {link.price !== null && (
                    <span className="text-xs tabular-nums text-canvas-inkSoft">
                      {link.price.toLocaleString()}円{link.priceCheckedAt ? `（${link.priceCheckedAt}確認）` : ""}
                    </span>
                  )}
                </div>
                {link.kind === "rakuten-html" ? (
                  <span className="block text-sm leading-relaxed text-canvas-ink [&_a]:break-words [&_a]:text-canvas-primary [&_a]:underline [&_a]:decoration-canvas-primary/40 [&_a]:underline-offset-2 [&_a]:hover:text-canvas-primaryHover">
                    <RakutenSnippet
                      html={link.html}
                      productId={product.id}
                      pageType="product_detail"
                      placement="purchase_section"
                    />
                  </span>
                ) : (
                  <a
                    href={link.url}
                    target="_blank"
                    rel={link.linkType === "affiliate" ? "noopener noreferrer sponsored" : "noopener noreferrer"}
                    onClick={() =>
                      trackPurchaseLinkClick({
                        product_id: product.id,
                        merchant: link.provider,
                        page_type: "product_detail",
                        placement: "purchase_section",
                        link_type: link.linkType,
                      })
                    }
                    className="text-sm font-bold text-canvas-primary underline decoration-canvas-primary/40 underline-offset-2 hover:text-canvas-primaryHover"
                  >
                    サイトを見る →
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-4 text-xs text-canvas-inkSoft">
        Amazonの購入先は現時点で準備中です。楽天市場・メーカー公式サイトでご確認ください。
      </p>
    </section>
  );
}
