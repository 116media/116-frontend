# 16 — SEO & Metadata

The video page mirrors the article page's SEO surface, swapping the `Article` shapes for
**video** ones. Everything derives from the single server fetch (React `cache()` shared
between `generateMetadata` and the page — no second request).

## `generateMetadata`

| Field | Source (fallback) |
|---|---|
| `title` | `metaTitle ?? title` |
| `description` | `metaDescription ?? description` (truncated ~160 chars) |
| `alternates.canonical` | `/videos/{slug}` |
| `openGraph.type` | `"video.other"` |
| `openGraph.title` / `description` / `url` | as above |
| `openGraph.images` | `[thumbnailUrl]` when present (omitted when null) |
| `openGraph.videos` | `[youtubeVideoUrl]` when present |
| `twitter.card` | `"player"` when a YouTube url exists, else `"summary_large_image"` |

Missing/unpublished slug → `notFound()` from both the page and `generateMetadata`, so a
404 never advertises a real title.

## JSON-LD — `VideoObject`

A `videoJsonLd(video)` builder rendered server-side via one
`<script type="application/ld+json">` (JSON we build — not sanitized user HTML):

```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "…title…",
  "description": "…description…",
  "thumbnailUrl": ["…thumbnailUrl…"],
  "uploadDate": "…publishedAt…",
  "embedUrl": "https://www.youtube.com/embed/{youtubeId}",
  "genre": "…categoryName…",
  "keywords": ["…tag names…"],
  "publisher": { "@type": "Organization", "name": "116" },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 4.6, "ratingCount": 128,
    "bestRating": 5, "worstRating": 1
  }
}
```

- Fields with no data are **omitted**, never null: `thumbnailUrl`, `uploadDate`,
  `embedUrl` (no YouTube url → omit), and the whole `aggregateRating` when
  `ratingCount === 0` (Google rejects zero-count ratings).
- `name`, `description`, `thumbnailUrl`, `uploadDate` are Google's required VideoObject
  fields — all satisfied by the DTO.
- YouTube's own stats are *not* embedded in JSON-LD (they're fetched client-side and
  would drift); the structured data stays server-truthful.

## Robots

The canonical URL is always the bare `/videos/{slug}`, so any tracking query strings
consolidate. Published videos are indexable by default; unpublished slugs 404.
