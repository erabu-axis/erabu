/**
 * 購入先リンクのクリック計測。GA4本体（@next/third-parties/googleのGoogleAnalytics）が
 * 発行するグローバルgtag関数をそのまま使う。タグを二重に設置しない。
 * 測定ID未設定（gtag自体が存在しない）場合は何もしない（画面エラーにしない）。
 * リンク遷移（target="_blank"での新規タブオープン）は計測の成否と無関係に必ず行われる
 * ため、ここでのtry/catchは「計測が失敗してもページ遷移を妨げない」ことの保険。
 */

export type PurchaseLinkPageType = "product_detail" | "article";
export type PurchaseLinkType = "affiliate" | "official";

export interface PurchaseLinkClickParams {
  product_id: string;
  merchant: string;
  page_type: PurchaseLinkPageType;
  /** page_type==="article"のときのみ指定する記事slug */
  article_id?: string;
  placement: string;
  link_type: PurchaseLinkType;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackPurchaseLinkClick(params: PurchaseLinkClickParams): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  try {
    window.gtag("event", "purchase_link_click", params);
  } catch {
    // 計測失敗はリンク遷移をブロックしない
  }
}
