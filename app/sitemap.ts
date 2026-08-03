import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://semeandoofuturo.org";
  return [{ url: baseUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
