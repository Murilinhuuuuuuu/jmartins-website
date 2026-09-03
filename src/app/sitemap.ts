import type { MetadataRoute } from "next";
import { products, projects } from "@/lib/content/catalog";
import { site } from "@/lib/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/reformas", "/cadeiras", "/portfolio", "/sobre", "/orcamento", "/contato", "/privacidade", "/termos"];
  return [...routes.map((route) => ({ url: `${site.url}${route}`, changeFrequency: route === "" ? "weekly" as const : "monthly" as const, priority: route === "" ? 1 : 0.7 })), ...products.map((product) => ({ url: `${site.url}/cadeiras/${product.slug}`, changeFrequency: "weekly" as const, priority: 0.6 })), ...projects.map((project) => ({ url: `${site.url}/portfolio/${project.slug}`, changeFrequency: "monthly" as const, priority: 0.6 }))];
}
