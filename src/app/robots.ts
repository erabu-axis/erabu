import type { MetadataRoute } from "next";
import { SITE_URL_FOR_BUILD } from "@/lib/site-config";

/** 通常の検索エンジンによるクロールを許可する。ドメインの解決方法はsite-config.tsを参照。 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL_FOR_BUILD}/sitemap.xml`,
  };
}
