# Structured Data (JSON-LD)

## Why It Matters

Structured data tells Google exactly what your content is. For a music/culture platform, this means rich results: article cards with author photos, video thumbnails in search, lyrics with song metadata. Without it, Google sees HTML. With it, Google sees "this is an article about Fally Ipupa written by this author on this date."

## Implementation

Add JSON-LD as a script tag in the page component. Next.js Server Components make this simple because you already have the data.

```typescript
export default async function ArticleDetailPage({ params }: Props) {
    const { slug } = await params;
    const article = await getArticle(slug);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: article.metaTitle || article.title,
        description: article.metaDescription || article.headline,
        image: article.coverImageUrl,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        author: {
            "@type": "Person",
            name: article.author?.userName,
        },
        publisher: {
            "@type": "Organization",
            name: "116 Media",
            logo: {
                "@type": "ImageObject",
                url: "https://116.cd/logo.png",
            },
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ArticleDetailContainer article={article} />
        </>
    );
}
```

## Schema Types by Content

### Articles

Use `NewsArticle` for editorial content:

```json
{
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": "Fally Ipupa Interview",
    "description": "An exclusive behind-the-scenes interview",
    "image": "https://res.cloudinary.com/.../cover.jpg",
    "datePublished": "2026-05-20T10:30:00Z",
    "author": { "@type": "Person", "name": "musiceditor" },
    "publisher": { "@type": "Organization", "name": "116 Media" },
    "mainEntityOfPage": "https://116.cd/articles/fally-ipupa-interview"
}
```

### Videos

Use `VideoObject`:

```json
{
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "Fally Ipupa - Latest Song",
    "description": "Watch the official music video",
    "thumbnailUrl": "https://res.cloudinary.com/.../thumb.jpg",
    "uploadDate": "2026-05-15T12:00:00Z",
    "embedUrl": "https://www.youtube.com/embed/VIDEO_ID",
    "publisher": { "@type": "Organization", "name": "116 Media" }
}
```

### Lyrics

Use `MusicComposition`:

```json
{
    "@context": "https://schema.org",
    "@type": "MusicComposition",
    "name": "Eloko Oyo",
    "composer": { "@type": "Person", "name": "Fally Ipupa" },
    "inLanguage": "fr",
    "text": "First few lines of lyrics...",
    "publisher": { "@type": "Organization", "name": "116 Media" }
}
```

### Website (Home Page)

```json
{
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "116",
    "url": "https://116.cd",
    "description": "Musique & Culture Hip-Hop en RDC et au-delà",
    "potentialAction": {
        "@type": "SearchAction",
        "target": "https://116.cd/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
    }
}
```

## Reusable Helper

Create a helper to avoid repeating the publisher block:

```typescript
// src/shared/presentation/utils/structured-data.ts

const PUBLISHER = {
    "@type": "Organization",
    name: "116 Media",
    logo: {
        "@type": "ImageObject",
        url: "https://116.cd/logo.png",
    },
};

export function articleJsonLd(article: IArticleEntity) {
    return {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: article.metaTitle || article.title,
        description: article.metaDescription || article.headline,
        image: article.coverImageUrl,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        author: article.author
            ? { "@type": "Person", name: article.author.userName }
            : undefined,
        publisher: PUBLISHER,
        mainEntityOfPage: `https://116.cd/articles/${article.slug}`,
    };
}

export function videoJsonLd(video: IVideoEntity) { ... }
export function lyricsJsonLd(lyrics: ILyricsEntity) { ... }
```

## Validation

Test structured data with:

- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/
