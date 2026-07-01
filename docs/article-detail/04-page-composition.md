# Page Composition

The `/articles/[slug]` route is a **server-first** composition: an async RSC fetches the
article by slug for SEO and a fast first paint, hands the fetched entity to a thin client
container, and that container assembles the interactive two-column reading surface. It
mirrors the server-cradle pattern the promotion feed already uses
(`ArticlePromotionFeedContainer` resolves `createServerCradle()` and runs a use case),
and the compose-of-containers style of the homepage (`app/(public)/page.tsx`).

---

## Route

```
app/(public)/articles/[slug]/page.tsx
```

Lives in the `(public)` route group (same as `/` and `/articles`), so it inherits the
public header/footer shell and the providers (`QueryProvider`, `AuthProvider`,
`AuthModalProvider`) from `app/(public)/layout.tsx`. The layout already wraps `children`
in `PageContainer`, so the page renders straight into the centered max-width column.

> **This Next.js is customized.** Before writing the route, read the current
> page/`params`/`generateMetadata` API in `node_modules/next/dist/docs/` (see
> `apps/frontend/AGENTS.md`). At the time of writing, `params` is a **`Promise`** you must
> `await`, and pages/metadata can be typed with the global `PageProps<'/articles/[slug]'>`
> helper. The `notFound()` function is callable from **both** the page and
> `generateMetadata`. Do not assume the synchronous-`params` shape from older Next.

---

## Server / client split

Three layers, one responsibility each:

```text
page.tsx (RSC)                         ← await params, server-fetch by slug, notFound() gate,
  │                                      generateMetadata; seeds the client with initialData
  └── ArticleDetailContainer ("use client")   ← useArticleDetail(slug, { initialData }); selects
        │                                        loading / error / data view
        └── ArticleDetail (presentation)        ← holds the whole entity; distributes SCOPED props
              ├── ArticleDetail.ReadingProgress   (client — scroll)
              ├── ArticleDetail.ShareRail         (client — share / clipboard)
              ├── ArticleDetail.Hero
              ├── ArticleDetail.Body
              ├── ArticleDetail.Tags
              ├── ArticleDetail.Engagement        (client — like / bookmark / comment scroll)
              ├── ArticleDetail.Comments          (client — query / mutation / auth)
              └── ArticleDetail.PopularSidebar
```

Everything interactive — reading-progress, interactions, share, comments — is client. The
page itself does no interactivity; its job is the server fetch, the 404 gate, and the SEO
metadata.

### The page (RSC)

The page resolves the server cradle exactly as `ArticlePromotionFeedContainer` does,
runs `getArticleBySlugUseCase.execute(slug)` server-side, and gates a missing/unpublished
article through Next's `notFound()`. The fetched `IArticleDetailEntity` is passed to the
client container as `initialData` so `useArticleDetail(slug)` hydrates without a second
network round-trip on the client.

```tsx
/**
 * ArticleDetailPage
 *
 * @description
 * The public single-article route. Awaits the dynamic `slug`, resolves the server
 * cradle, and fetches the article server-side (SEO + fast first paint). A
 * missing or unpublished article triggers `notFound()`. The resolved entity seeds the
 * client `ArticleDetailContainer` as `initialData`, so the client query hydrates without
 * a refetch.
 */
export default async function ArticleDetailPage({ params }: PageProps<"/articles/[slug]">) {
    const { slug } = await params;
    const cradle = await createServerCradle();
    const result = await cradle.getArticleBySlugUseCase.execute(slug);

    if (!result.ok) notFound();

    return <ArticleDetailContainer slug={slug} initialData={result.value} />;
}
```

(Full JSDoc'd source, including the container and assembler, is in
[specs/11-page-and-layout.md](specs/11-page-and-layout.md).)

### `generateMetadata`

`generateMetadata` runs on the server for the same slug. It reuses the fetched article
(the server cradle result is cached per request, so re-fetching is cheap) and returns the
core SEO surface: title, description, Open Graph, and the canonical URL.

```tsx
/**
 * generateMetadata
 *
 * @description
 * Server-side SEO for the article route. Fetches the article by slug and returns the
 * title (`metaTitle` first, else the article title), description (`metaDescription`
 * first, else the headline), Open Graph tags (article type, cover image), and the
 * canonical `/articles/{slug}` URL. A missing article triggers `notFound()`.
 */
export async function generateMetadata({
    params
}: PageProps<"/articles/[slug]">): Promise<Metadata> {
    const { slug } = await params;
    const cradle = await createServerCradle();
    const result = await cradle.getArticleBySlugUseCase.execute(slug);

    if (!result.ok) notFound();

    const article = result.value;
    return {
        title: article.metaTitle ?? article.title,
        description: article.metaDescription ?? article.headline,
        alternates: { canonical: `/articles/${article.slug}` },
        openGraph: {
            type: "article",
            title: article.metaTitle ?? article.title,
            description: article.metaDescription ?? article.headline,
            images: article.coverImageUrl ? [article.coverImageUrl] : []
        }
    };
}
```

The full SEO surface — JSON-LD `Article` structured data, author/section/`publishedTime`
tags, image dimensions — lives in [17-seo-and-metadata.md](17-seo-and-metadata.md). This
page only shows the `generateMetadata` skeleton; do not duplicate the JSON-LD here.

---

## Layout shell

On `lg` and up the page is a three-track layout: a left rail, the reading column, and a
right rail. On mobile everything stacks into a single column.

```text
┌─────────────────────────────────────────────────────────────┐
│ ReadingProgress (fixed, full-width, at the very top)         │
├──────────┬───────────────────────────────────┬──────────────┤
│          │  Hero  (cover · category · author) │              │
│ Share    │  Body  (sanitized prose HTML)      │  Popular     │
│ Rail     │  Tags                              │  Sidebar     │
│ (sticky) │  Engagement                        │  (Horizontal │
│          │  Comments (composer + list)        │   cards)     │
└──────────┴───────────────────────────────────┴──────────────┘
   left               center (main)                 right
```

- **Left rail** — the sticky `ArticleDetail.ShareRail` (Facebook · X · WhatsApp · copy
  link). Sticky so it stays beside the body as the reader scrolls
  ([08](08-share-rail.md)).
- **Center column** — the reading flow: Hero → Body → Tags → Engagement → Comments.
- **Right rail** — `ArticleDetail.PopularSidebar`, a column of `ArticleCard.Horizontal`
  ([11](11-popular-articles-sidebar.md)).
- **Reading-progress bar** — fixed at the very top of the viewport, spanning the full
  width, filling 0→100 % as the body scrolls ([07](07-reading-progress.md)).

### Responsive behavior

- **Mobile / tablet (`< lg`)**: one column. The `ShareRail` collapses to a **horizontal
  row** above (or below) the body rather than a sticky vertical rail. The
  `PopularSidebar` moves **below the comments** so the reader reaches the article body
  immediately.
- **Desktop (`lg+`)**: the three tracks appear; the share rail and popular sidebar become
  side rails. Recommended grid: a wide center column flanked by two narrow rails, e.g.
  `lg:grid lg:grid-cols-[auto_minmax(0,1fr)_20rem] lg:gap-8`, with the rails hidden on
  small screens and re-inserted as stacked blocks. The exact track sizing is in
  [specs/11-page-and-layout.md](specs/11-page-and-layout.md).

The whole page renders inside `PageContainer` (inherited from the public layout), so it
never sets its own horizontal padding or max-width.

---

## The `ArticleDetail` assembler

`ArticleDetail` is **the only component that holds the whole `IArticleDetailEntity`**.
Every sub-composer receives **scoped props** — only the fields it renders — never the
entity. This keeps each part independently testable and prevents accidental coupling to
fields it does not own (the standing module rule, see [02](02-architecture.md)).

```tsx
/**
 * ArticleDetail
 *
 * @description
 * The presentation assembler for the single-article page. Holds the whole
 * `IArticleDetailEntity` and distributes scoped props to each sub-composer — the hero,
 * body, tags, engagement row, share rail, popular sidebar, and comments — laying them
 * out in the two-column reading shell. This is the only component that receives the
 * entire entity; every child takes only the fields it renders.
 *
 * @param article - The fully resolved article to render.
 */
export function ArticleDetail({ article }: { article: IArticleDetailEntity }) {
    return null;
}
```

The assembler distributes, in outline:

| Sub-composer | Scoped props it receives |
|---|---|
| `ArticleDetail.ReadingProgress` | (none — reads scroll) |
| `ArticleDetail.ShareRail` | `articleId`, `slug`, `title` |
| `ArticleDetail.Hero` | `categoryName`, `title`, `headline`, `coverImageUrl`, `author`, `publishedAt`, `readTimeInMinutes`, `tags`-derived category `Tag` |
| `ArticleDetail.Body` | `body` (HTML), `images` |
| `ArticleDetail.Tags` | `tags` |
| `ArticleDetail.Engagement` | `articleId`, `likeCount`, `commentCount`, `bookmarkCount`, a `commentsRef` to scroll to |
| `ArticleDetail.Comments` | `articleId`, `commentCount` (+ its own anchor `id`/`ref`) |
| `ArticleDetail.PopularSidebar` | `currentArticleId` (to exclude self) |

The `Hero`/`Body`/`Tags`/`Engagement`/`ShareRail`/`PopularSidebar` composers are specced
in [specs/04](specs/04-cover-and-header.md)–[specs/09](specs/09-popular-sidebar.md);
`Comments` is in [specs/10-comments.md](specs/10-comments.md). The full assembler layout
and the client container are in [specs/11-page-and-layout.md](specs/11-page-and-layout.md).

### The comment button ↔ composer link

The `Engagement` comment button and the `Comments` section are wired through a shared
ref. `ArticleDetail` owns a `commentsRef` (attached to the `Comments` section anchor);
the `Engagement` comment button scrolls that element into view and focuses the composer,
rather than navigating away. The feed card's comment button navigates to
`/articles/{slug}?comments=1` — on the detail page that query flag can be read once on
mount to auto-scroll to comments. See [09](09-interactions.md) and
[12](12-comments.md).

---

## Composition diagram

```text
ArticleDetailPage (RSC)
├── await params → slug
├── createServerCradle() → getArticleBySlugUseCase.execute(slug)
├── !result.ok → notFound()
├── generateMetadata (title / description / OpenGraph / canonical)   ← 17-seo-and-metadata.md
└── <ArticleDetailContainer slug initialData={entity}> ("use client")
      └── useArticleDetail(slug, { initialData })  → useQuery
            └── <ArticleDetail article> (presentation, holds the entity)
                  ├── ReadingProgress  (fixed top)
                  ├── ShareRail        (left rail / mobile row)
                  ├── Hero · Body · Tags · Engagement · Comments  (center)
                  └── PopularSidebar   (right rail / below on mobile)
```

See [02-architecture.md](02-architecture.md) for the layering and the full file list.
