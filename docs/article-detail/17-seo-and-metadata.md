# 17 — SEO & Metadata

The detail page is the app's most link-shared, most crawler-visited surface, so it is the
one page that invests in **rich metadata**. It ships two things the references
([01-overview.md](01-overview.md)) lack: a full `generateMetadata` (title, description,
canonical, Open Graph, Twitter card) and **JSON-LD `Article` structured data**. The route
spec ([specs/11-page-and-layout.md](specs/11-page-and-layout.md)) shows the
`generateMetadata` skeleton; this doc goes deeper on Open Graph and JSON-LD and is the
design reference the spec points back to.

Both come from the same server-fetched `ArticleDetailDto` the RSC already awaits (see
[04-page-composition.md](04-page-composition.md)), so metadata never triggers a second
request.

---

## `generateMetadata`

An async `generateMetadata({ params })` fetches the article by slug (deduped with the
page's own fetch by TanStack/Next request memoization) and maps the DTO to a Next
`Metadata` object:

| Metadata field | Source (fallback) |
|---|---|
| `title` | `metaTitle ?? title` |
| `description` | `metaDescription ?? headline` |
| `alternates.canonical` | `/articles/{slug}` |
| `openGraph.type` | `"article"` |
| `openGraph.title` / `openGraph.description` | same as `title` / `description` |
| `openGraph.url` | canonical `/articles/{slug}` |
| `openGraph.images` | `[{ url: coverImageUrl }]` (omitted when `coverImageUrl` is null) |
| `openGraph.publishedTime` | `publishedAt` (→ `article:published_time`) |
| `openGraph.authors` | `[author.userName]` when present |
| `openGraph.tags` | `tags.map(t => t.name)` (→ `article:tag`, one per tag) |
| `openGraph.section` | `categoryName` (→ `article:section`) |
| `twitter.card` | `"summary_large_image"` |
| `twitter.title` / `twitter.description` / `twitter.images` | mirror the OG values |

```tsx
/**
 * generateMetadata
 *
 * @description
 * Builds the document metadata for the article detail route from the server-fetched
 * `ArticleDetailDto`. Title falls back from `metaTitle` to `title`, description from
 * `metaDescription` to `headline`; the canonical URL is `/articles/{slug}`. Emits an
 * Open Graph "article" object (cover image, published time, author, section, per-tag
 * `article:tag`) and a matching large-image Twitter card. A missing or unpublished slug
 * returns the not-found metadata so crawlers see a proper 404 (see 15).
 *
 * @param params - The route params carrying the article `slug`.
 * @returns The Next `Metadata` for the resolved article.
 */
export async function generateMetadata({ params }: ArticleDetailRouteProps): Promise<Metadata> { /* … */ }
```

- **Null cover** — when `coverImageUrl` is null, `openGraph.images` / `twitter.images` are
  omitted (no broken share preview); a site-level default OG image from the root layout
  applies.
- **Not-found** — if the slug resolves to a `Failure(not-found)` or absent article,
  `generateMetadata` returns minimal not-found metadata and the page calls `notFound()`
  (see [15-loading-empty-error.md](15-loading-empty-error.md)); the two stay consistent so
  a 404 page never advertises a real title.
- **Base URL** — canonical and OG `url` are absolute, built from the site base URL
  (`metadataBase` on the root layout) + the `/articles/{slug}` path.

## JSON-LD structured data

Beyond meta tags, the page injects a **`NewsArticle`** (an `Article` subtype fitting a
news/gossip publication) JSON-LD block via a `<script type="application/ld+json">` in the
RSC output. Structured data lets Google render rich results (headline, thumbnail, date,
byline) and is a concrete improvement over both references, which shipped none.

```tsx
/**
 * articleJsonLd
 *
 * @description
 * Builds the schema.org `NewsArticle` JSON-LD for the detail page from the article
 * entity: `headline` (title), `image` (cover), `datePublished` (publishedAt),
 * `dateModified` (updatedAt), `author` (Person, author.userName), `publisher`
 * (Organization + logo), `articleSection` (category), `keywords` (tag names), and
 * `mainEntityOfPage` (the canonical URL). Injected via a single
 * `<script type="application/ld+json">` in the server-rendered page so crawlers get it on
 * first paint with no client work.
 *
 * @param article - The resolved article detail entity.
 * @returns The JSON-LD object stringified into the script tag.
 */
export function articleJsonLd(article: IArticleDetailEntity): Record<string, unknown> { /* … */ }
```

Shape emitted:

```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "…title…",
  "image": ["…coverImageUrl…"],
  "datePublished": "…publishedAt…",
  "dateModified": "…updatedAt…",
  "author": { "@type": "Person", "name": "…author.userName…" },
  "publisher": {
    "@type": "Organization",
    "name": "116",
    "logo": { "@type": "ImageObject", "url": "…site logo…" }
  },
  "articleSection": "…categoryName…",
  "keywords": ["…tag names…"],
  "mainEntityOfPage": { "@type": "WebPage", "@id": "…canonical…" }
}
```

- Fields with no data are omitted rather than emitted null (`image` only when a cover
  exists; `author` only when `author` is present — the DTO's `author` can be null, see
  [03-backend-api-reference.md](03-backend-api-reference.md)).
- The script is rendered server-side in the page (not the client container), so it is in
  the initial HTML. It is **not** put through `isomorphic-dompurify` — it is
  JSON we build, not the article body; the untrusted HTML body is sanitized separately in
  [06-article-body.md](06-article-body.md).
- `headline`/`image`/`datePublished`/`author.name`/`publisher` are the fields Google
  documents as required/recommended for the Article rich result; the rest are supporting.

## Notes

- All metadata derives from the **single** server fetch; there is no separate SEO request.
- The canonical URL protects against the same article being reachable through tracking
  query strings.
- Robots: published articles are indexable by default; a draft/unpublished slug never
  reaches here (it 404s), so `noindex` handling is implicit in the not-found path.
- See [specs/11-page-and-layout.md](specs/11-page-and-layout.md) for where
  `generateMetadata` and the JSON-LD script sit in the route file.
