# Metadata API

## Overview

SEO is critical for the 116 frontend. The platform needs to rank for queries like "Fally Ipupa paroles", "clip video Innoss'B", and "musique congolaise". Next.js 16's Metadata API makes this straightforward with Server Components.

## Static Metadata

For pages with known metadata (home, articles list), export a `metadata` object:

```typescript
// app/(public)/articles/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Articles",
    description: "Découvrez les derniers articles sur la musique et la culture hip-hop en RDC.",
    openGraph: {
        title: "Articles | 116",
        description: "Découvrez les derniers articles sur la musique et la culture hip-hop.",
        type: "website",
    },
};
```

## Dynamic Metadata

For detail pages (articles, videos, lyrics), use `generateMetadata` to fetch data and build metadata from the API response:

```typescript
// app/(public)/articles/[slug]/page.tsx
import type { Metadata } from "next";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const repository = new ArticlesRepositoryImpl();
    const result = await repository.getArticleBySlug(slug);

    if (!result.ok) {
        return { title: "Article introuvable" };
    }

    const article = result.value;

    return {
        title: article.metaTitle || article.title,
        description: article.metaDescription || article.headline,
        authors: article.author ? [{ name: article.author.userName }] : undefined,
        openGraph: {
            title: article.metaTitle || article.title,
            description: article.metaDescription || article.headline,
            type: "article",
            publishedTime: article.publishedAt || undefined,
            authors: article.author ? [article.author.userName] : undefined,
            images: article.coverImageUrl
                ? [{ url: article.coverImageUrl, width: 1200, height: 630 }]
                : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title: article.metaTitle || article.title,
            description: article.metaDescription || article.headline,
            images: article.coverImageUrl ? [article.coverImageUrl] : undefined,
        },
    };
}
```

## Backend SEO Fields

The backend provides SEO fields on all content DTOs:

| Field | Max Length | Fallback |
| --- | --- | --- |
| `metaTitle` | 70 chars | Content title |
| `metaDescription` | 160 chars | Content headline or description |
| `slug` | Auto-generated | URL path segment |
| `publishedAt` | ISO datetime | Used for article:published_time |
| `coverImageUrl` / `thumbnailUrl` | Cloudinary URL | Open Graph image |
| `author.userName` | From Identity module | article:author |

Always prefer the explicit SEO fields when available. Fall back to the content title/description only when the SEO fields are null.

## Template Title

The root layout sets a title template:

```typescript
export const metadata = {
    title: {
        template: "%s | 116",
        default: "116 - Musique & Culture Hip-Hop",
    },
};
```

Child pages only set the page-specific part:

```typescript
// Results in "Fally Ipupa Interview | 116"
export const metadata = { title: "Fally Ipupa Interview" };
```

## Canonical URLs

Every page should have a canonical URL to prevent duplicate content:

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    return {
        alternates: {
            canonical: `https://116.cd/articles/${slug}`,
        },
    };
}
```

## Per-Content-Type Metadata

### Articles

```typescript
openGraph: {
    type: "article",
    publishedTime: article.publishedAt,
    authors: [article.author.userName],
    tags: article.tags.map(t => t.name),
}
```

### Videos

```typescript
openGraph: {
    type: "video.other",
    videos: video.youtubeVideoUrl
        ? [{ url: video.youtubeVideoUrl }]
        : undefined,
}
```

### Lyrics

```typescript
// Lyrics pages target search queries like "Fally Ipupa Eloko Oyo paroles"
title: `${lyrics.songTitle} - ${lyrics.artistName} | Paroles`,
description: `Paroles de ${lyrics.songTitle} par ${lyrics.artistName}. Lisez les paroles complètes sur 116.`,
```

## No-Index Pages

Some pages should not be indexed:

```typescript
// Login, signup, user profile pages
export const metadata: Metadata = {
    robots: { index: false, follow: false },
};
```
