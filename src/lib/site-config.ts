/**
 * 本番ドメインは https://erabu-axis.jp に確定している。
 * NEXT_PUBLIC_SITE_URL が設定されている場合はそちらを優先する（ステージング等で別ドメインを
 * 使いたい場合のための上書き用）。未設定時は、sitemap.xml・robots.txt・canonical・OpenGraphが
 * localhostのまま生成されてSearch Console等で「許可されていないURL」になる事故を防ぐため、
 * この確定済み本番ドメインをデフォルト値として使う。
 *
 * 使用箇所：
 * - src/app/layout.tsx（metadataBase。ここが正しく設定されることで、各ページのcanonical・
 *   og:url・og:image等もすべて https://erabu-axis.jp/... で解決される）
 * - src/app/sitemap.ts（sitemap.xml内の全URLの絶対パスの組み立てに使用）
 * - src/app/robots.ts（sitemap指定URLの組み立てに使用）
 */
import type { Metadata } from "next";

const PRODUCTION_SITE_URL = "https://erabu-axis.jp";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_SITE_URL;

/** sitemap.ts・robots.ts専用。絶対URLを組み立てるためのベースURL。 */
export const SITE_URL_FOR_BUILD = SITE_URL;

export const SITE_NAME = "えらぶ。";

/**
 * Google Analytics 4の測定ID。ソースコードにベタ書きせず、環境変数からのみ取得する。
 * 未設定時はnull（layout.tsxはnullのときGA4タグ自体を描画しない）。
 * ローカル：.env.local（Gitにはコミットしない）／本番：デプロイ先の環境変数に設定する。
 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || null;

/**
 * 各ページのgenerateMetadata/metadataで繰り返す「title・description・canonical・
 * OpenGraph・Twitter Card」を1箇所にまとめるためのヘルパー。新しい文言は作らず、
 * 呼び出し側が既に持っているtitle/descriptionをそのまま反映するだけ。
 *
 * Next.jsはopenGraph/twitterをページ単位で「上書き」する（親レイアウトの値と深いマージはしない）ため、
 * ここでtitle/description以外にimages・siteName・type・locale・cardも明示し、
 * ページごとのメタデータでog:image等が消えないようにしている。
 * 画像はsrc/app/opengraph-image.png・twitter-image.png（静的ファイル規約）をそのまま指す。
 */
export function buildPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      locale: "ja_JP",
      images: ["/opengraph-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/twitter-image.png"],
    },
  };
}
