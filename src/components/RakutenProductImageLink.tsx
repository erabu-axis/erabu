import type { Product } from "@/types/product";
import { RakutenSnippet } from "@/components/RakutenSnippet";
import type { PurchaseLinkPageType } from "@/lib/analytics";

/**
 * 楽天アフィリエイト「画像のみ」リンクを、ProductImageと同じ見た目の枠内に表示する。
 * 枠（div）のスタイルはこちら側で自由に付けてよいが、楽天が生成した<a><img>タグ自体には
 * 一切スタイル・属性を追加しない（安全性チェック・そのまま描画はRakutenSnippetが担う）。
 * 画像そのものが楽天の商品ページへのアフィリエイトリンクを兼ねるため、購入導線がある
 * 文脈（商品詳細ページ等）でのみ使用すること。
 */
export function RakutenProductImageLink({
  product,
  html,
  pageType,
  placement,
  articleId,
  aspect = "aspect-square",
  className = "",
}: {
  product: Product;
  html: string;
  pageType: PurchaseLinkPageType;
  placement: string;
  articleId?: string;
  aspect?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex ${aspect} shrink-0 items-center justify-center overflow-hidden rounded-lg border border-brand-line bg-brand-bgRaised ${className}`}
    >
      <RakutenSnippet
        html={html}
        productId={product.id}
        pageType={pageType}
        articleId={articleId}
        placement={placement}
      />
    </div>
  );
}
