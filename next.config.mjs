/**
 * 商品画像（ProductImage / next/image）について：
 * 現時点ではproducts.jsonのimageUrlはすべてnullのため、外部画像ドメインの許可設定は
 * まだ必要ない。正規に利用できる画像（アフィリエイト提供／メーカー許諾／自社保有）を
 * 実際に登録する際は、その画像のドメインだけをimages.remotePatternsに追加すること。
 * 任意のドメインを許可するワイルドカード設定（例: hostname: "**"）は行わない。
 *
 * 例（実際に使う画像ホストが決まってから追加する）:
 * images: {
 *   remotePatterns: [
 *     { protocol: "https", hostname: "m.media-amazon.com" },
 *   ],
 * },
 */

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
