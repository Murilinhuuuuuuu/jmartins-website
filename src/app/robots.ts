import type { MetadataRoute } from "next";
import { allowIndexing, site } from "@/lib/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: allowIndexing
      ? { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/"] }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
