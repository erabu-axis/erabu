import type { MetadataRoute } from "next";
import { getPublishedComparisons, products } from "@/lib/data";
import { SITE_URL_FOR_BUILD } from "@/lib/site-config";

/** 記事追加・商品追加のたびに手作業で直さなくて済むよう、すべて既存データから動的生成する。 */
const STATIC_PATHS = [
  "",
  "/robot-vacuums",
  "/articles",
  "/about-axis-score",
  "/about",
  "/privacy",
  "/advertising-policy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL_FOR_BUILD;
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
  }));

  // dataType==="real"の商品のみ（sampleは公開ルートから404になるため対象外）。
  const productEntries: MetadataRoute.Sitemap = products
    .filter((p) => p.dataType === "real")
    .map((p) => ({
      url: `${base}/robot-vacuums/${p.id}`,
      lastModified: p.verifiedAt ? new Date(p.verifiedAt) : now,
    }));

  // status==="published"の比較記事のみ（draftは対象外）。
  const articleEntries: MetadataRoute.Sitemap = getPublishedComparisons().map((c) => ({
    url: `${base}/articles/${c.slug}`,
    lastModified: c.updatedAt ? new Date(c.updatedAt) : now,
  }));

  return [...staticEntries, ...productEntries, ...articleEntries];
}
