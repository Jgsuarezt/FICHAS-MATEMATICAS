import type { MetadataRoute } from "next";
import { GRADES, TOPICS } from "@/data/topics";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fichasmatematicas.es";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = "2026-11-20";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/cuadernos`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const topicRoutes: MetadataRoute.Sitemap = TOPICS.map((topic) => ({
    url: `${BASE_URL}/fichas/${topic.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const gradeRoutes: MetadataRoute.Sitemap = GRADES.map((grade) => ({
    url: `${BASE_URL}/curso/${grade.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...topicRoutes, ...gradeRoutes];
}
