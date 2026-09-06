import Image from "next/image";
import type { Product } from "@/types/product";

type ImageProduct = Pick<Product, "name" | "imageUrl" | "imageAlt">;

/**
 * 商品画像。imageUrlが未設定の場合は、大きな「NO IMAGE」ではなく
 * 「えらぶ。」のデザインに馴染む控えめな「画像準備中」表示にフォールバックする。
 * aspect-square + object-containで、画像の縦横比が商品ごとに違ってもレイアウトが崩れず、
 * 商品全体が見えるようにする（トリミングして一部だけ見せるcoverは使わない）。
 *
 * 正規に利用できる画像（アフィリエイト提供／メーカー許諾／自社保有）が用意でき次第、
 * products.jsonのimageUrl・imageAlt・imageSourceTypeを設定するだけでこのコンポーネントが
 * 自動的に画像を表示する。コンポーネント側の変更は不要。
 *
 * 外部ドメインの画像を使う場合、next.config.mjsのimages.remotePatternsにそのドメインを
 * 追加する必要がある（任意ドメインを許可するワイルドカード設定は行わない）。
 */
export function ProductImage({
  product,
  aspect = "aspect-square",
  className = "",
  sizes = "(min-width: 768px) 33vw, 50vw",
  priority = false,
}: {
  product: ImageProduct;
  /** Tailwindのaspect-*ユーティリティクラス。カードの形に合わせて呼び出し側で変更できる。 */
  aspect?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const { name, imageUrl, imageAlt } = product;

  return (
    <div
      className={`relative flex ${aspect} shrink-0 items-center justify-center overflow-hidden rounded-lg border border-brand-line bg-brand-bgRaised ${className}`}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={imageAlt ?? name}
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain p-3"
        />
      ) : (
        <div className="flex flex-col items-center gap-1.5 text-brand-inkSoft/70">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <span className="text-[11px] font-bold">画像準備中</span>
        </div>
      )}
    </div>
  );
}
