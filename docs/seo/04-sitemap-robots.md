# Sitemap and Robots

## Sitemap

Next.js can generate sitemaps dynamically. For a content platform like 116, the sitemap must include all published articles, videos, shorts, and lyrics pages.

### Dynamic Sitemap

```typescript
// app/sitemap.ts
import type { MetadataRoute } from "next";

const BASE_URL = "https://116.cd";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Fetch all published content slugs from the API
    const [articles, videos, shorts] = await Promise.all([
        fetchAllArticleSlugs(),
        fetchAllVideoSlugs(),
        fetchAllShortSlugs(),
    ]);

    const staticPages: MetadataRoute.Sitemap = [
        { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
        { url: `${BASE_URL}/articles`, changeFrequency: "daily", priority: 0.9 },
        { url: `${BASE_URL}/videos`, changeFrequency: "daily", priority: 0.9 },
        { url: `${BASE_URL}/shorts`, changeFrequency: "daily", priority: 0.8 },
    ];

    const articlePages = articles.map((slug) => ({
        url: `${BASE_URL}/articles/${slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    const videoPages = videos.map((slug) => ({
        url: `${BASE_URL}/videos/${slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    return [...staticPages, ...articlePages, ...videoPages];
}
```

### Large Sitemaps

If you have more than 50,000 URLs, split into multiple sitemaps using `generateSitemaps()`.

## Robots.txt

```typescript
// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/profile", "/settings", "/bookmarks", "/playlists", "/favorites"],
            },
        ],
        sitemap: "https://116.cd/sitemap.xml",
    };
}
```

This tells search engines:

- Index all public content pages
- Do not index auth pages, user profile, or API routes
- Find the sitemap at the specified URL
