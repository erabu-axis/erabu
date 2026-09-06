/**
 * 本番ドメインは、コード内・環境変数・READMEのいずれにも現時点で存在しないため、
 * URLを創作しない。NEXT_PUBLIC_SITE_URL が設定されている場合のみ本番ドメインとして使う。
 *
 * 使用箇所：
 * - src/app/layout.tsx（metadataBase。未設定時はmetadataBaseを省略し、Next.jsのデフォルト解決に委ねる）
 * - src/app/sitemap.ts（絶対URLが必須のため、未設定時のみビルド用の仮値 http://localhost:3000 を使う。
 *   本番公開前に必ずNEXT_PUBLIC_SITE_URLを設定すること）
 * - src/app/robots.ts（同上）
 */
import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || null;

/** sitemap.ts・robots.ts専用。絶対URLを組み立てるための仮のベースURL（本番では必ずSITE_URLを設定して上書きする）。 */
export const SITE_URL_FOR_BUILD = SITE_URL ?? "http://localhost:3000";

export const SITE_NAME = "えらぶ。";

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
