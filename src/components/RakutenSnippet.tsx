"use client";

import { checkRakutenSnippet } from "@/lib/rakutenSnippet";
import { trackPurchaseLinkClick, type PurchaseLinkPageType } from "@/lib/analytics";

/**
 * 楽天アフィリエイトツールが生成した「テキストのみ」のHTMLをそのまま表示する。
 * ガイドライン（https://affiliate.rakuten.co.jp/guideline/rule/）に従い、生成されたタグ自体には
 * rel・target・onClick等を追加・変更しない。クリック計測は、このタグを含む外側の要素（下記span）
 * のonClickでイベント委譲により検知する（バブリングしてきたクリックを拾うだけで、
 * 楽天タグ自身のonClickを上書きすることはない）。
 * 検証（checkRakutenSnippet）に通らないHTMLは表示せず、コンソールに理由を出力して報告する。
 */
export function RakutenSnippet({
  html,
  productId,
  pageType,
  articleId,
  placement,
}: {
  html: string;
  productId: string;
  pageType: PurchaseLinkPageType;
  articleId?: string;
  placement: string;
}) {
  const check = checkRakutenSnippet(html);

  if (!check.safe) {
    console.error(
      `[RakutenSnippet] product=${productId} placement=${placement} の楽天生成HTMLの表示を中止しました: ${check.reason}`
    );
    return null;
  }

  return (
    <span
      onClick={() =>
        trackPurchaseLinkClick({
          product_id: productId,
          merchant: "rakuten",
          page_type: pageType,
          article_id: articleId,
          placement,
          link_type: "affiliate",
        })
      }
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
