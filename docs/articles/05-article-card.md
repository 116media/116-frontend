# The Article Card

`ArticleCard` is a **compound component** in the `articles` slice — a family of card
variants, opened with a single `.Feed` variant for the grid, and extensible the same
way `ArticlePromotionCard = { Hero, Side, Pair, Strip }` and
`ArticlesMegaMenuCard = { FeaturedOverlay, FeaturedGradient, Compact }` are.

`src/modules/articles/presentation/components/ArticleCard/index.ts`:

```ts
export const ArticleCard = { Feed } as const;
```

> The brief says the new cards "must be added to the articles compound cards." This is
> that family. Adding a future `ArticleCard.Row` (horizontal) or `ArticleCard.Compact`
> is a one-line change to the barrel.

The card takes a single domain entity and is otherwise self-contained:

```ts
interface ArticleCardFeedProps {
    article: IArticleSummaryEntity;
}
```

(`IArticleSummaryEntity` is defined in
[07-domain-entities-and-mappers.md](07-domain-entities-and-mappers.md).)

---

## Anatomy

The card is built from small **sub-composers** (mirroring how
`ArticlesMegaMenuCard` splits into `…Image`, `…Body`, `…Stats`), so each concern is
testable and reusable. **Only `ArticleCard.Feed` receives the whole entity** — it
destructures and passes each child **exactly the props it renders**, never the whole
`article`:

```text
ArticleCard.Feed(article)
├── ArticleCardMedia        { slug, title, coverImageUrl }
├── ArticleCardAuthor       { author }                       (avatar + name; no date)
├── ArticleCardMeta         { categoryName, publishedAt, readTimeInMinutes }  (the one date)
├── <h3> title              article.title  (hover:text-primary)
├── <p> headline            article.headline  (line-clamp-2, muted)
└── ArticleCardEngagement   { articleId, slug, likeCount, commentCount, bookmarkCount }
```

> Passing scoped props (not `article={article}`) keeps each sub-composer independent of
> the `IArticleSummaryEntity` shape, makes them trivially reusable elsewhere, and lets
> React skip re-rendering a child whose specific props didn't change.

### Two differences from the supplied markup

1. **The image category badge overlay is removed.** The brief's
   `<div className="absolute top-3 left-3"><Badge>Music</Badge></div>` block is **not**
   rendered. The category instead appears in the meta row (below), as a `Tag`.
2. **A meta row is added above the title** — category, published date, reading time —
   using the shared `Tag` for the category and a vertical `Separator` between items.

---

## The card, translated to this codebase

The brief used raw shadcn (`Badge`, `Avatar`/`AvatarImage`, `Separator`, `Calendar`,
`Heart`, `MessageSquare`, `Share2`, `BookmarkPlus`) and hardcoded colors
(`bg-blue-500`, `text-red-500`, `bg-white/90`). This module maps every piece to the
app's primitives and **theme tokens** (no hardcoded colors — a standing rule):

| Brief | This codebase |
| --- | --- |
| `<Badge className="bg-blue-500">` (image overlay) | **removed** |
| `<Badge variant="outline">` (category, meta row) | **`<Tag variant="outline" size="sm">`** |
| `<Separator orientation="vertical" className="h-4">` | new **`Separator`** primitive (none exists — see below) |
| `<Avatar>/<AvatarImage>/<AvatarFallback>` | the shared **`UserAvatar`** (`size` + fallback already built) |
| `<Button>` (Read Article / actions) | the shared **`Button`** (`ghost`, `size` presets) |
| `Calendar`, `Clock`, `Heart`, `MessageSquare`, `Share2` | `CalendarIcon`, `ClockIcon`, `HeartIcon`, `MessageSquareIcon`, `ShareIcon` (barrel) |
| `BookmarkPlus` | **add** `BookmarkPlus as BookmarkPlusIcon` to the icon barrel |
| `bg-white/90 text-black` overlay button | token-based: `bg-background/90 text-foreground` |
| `fill-red-500 text-red-500` (liked) | `fill-destructive text-destructive` (or a dedicated `--like` token — see [15](15-open-questions.md)) |
| `group-hover:text-primary` | kept (already a token) |

### `ArticleCard.Feed` (reference structure)

```tsx
/**
 * ArticleCard.Feed
 *
 * @description
 * The magazine-style article card used in the /articles grid. Shows the cover image
 * with a hover "Read Article" overlay, the author and published date, a meta row of
 * category · date · reading time above the title, the title and a 2-line headline, and
 * an engagement bar (like / comment / share / bookmark). The whole card links to the
 * article; the engagement buttons stop propagation so they act in place. All colors are
 * theme tokens.
 *
 * @param article - The article summary entity to render.
 */
export function ArticleCardFeed({ article }: ArticleCardFeedProps) {
    return (
        <article className="group overflow-hidden rounded-xl border bg-background shadow-sm transition-shadow hover:shadow-md">
            <ArticleCardMedia
                slug={article.slug}
                title={article.title}
                coverImageUrl={article.coverImageUrl}
            />
            <div className="p-5">
                <ArticleCardAuthor author={article.author} />
                <ArticleCardMeta
                    categoryName={article.categoryName}
                    publishedAt={article.publishedAt}
                    readTimeInMinutes={article.readTimeInMinutes}
                />
                <h3 className="mb-3 line-clamp-2 font-bold text-xl transition-colors group-hover:text-primary">
                    <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                </h3>
                <p className="mb-4 line-clamp-2 text-muted-foreground text-sm">
                    {article.headline}
                </p>
                <ArticleCardEngagement
                    articleId={article.id}
                    slug={article.slug}
                    likeCount={article.likeCount}
                    commentCount={article.commentCount}
                    bookmarkCount={article.bookmarkCount}
                />
            </div>
        </article>
    );
}
```

### The meta row (the requested addition)

```tsx
/**
 * ArticleCardMeta
 *
 * @description
 * The row above the title: the article category as a Tag, the published date, and the
 * reading time, separated by vertical rules. Wraps on narrow cards.
 */
interface ArticleCardMetaProps {
    categoryName: string;
    publishedAt: string | null;
    readTimeInMinutes?: number;
}

export function ArticleCardMeta({
    categoryName,
    publishedAt,
    readTimeInMinutes
}: ArticleCardMetaProps) {
    const { t } = useTranslation();
    return (
        <div className="mb-4 flex flex-wrap items-center gap-3">
            <Tag as="span" variant="outline" size="sm">{categoryName}</Tag>
            <Separator orientation="vertical" className="h-4" />
            <span className="flex items-center text-muted-foreground text-sm">
                <CalendarIcon className="mr-1 size-3.5" />
                <RelativeDate date={publishedAt} />
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span className="flex items-center text-muted-foreground text-sm">
                <ClockIcon className="mr-1 size-3.5" />
                {t("articles.card.readTime", { count: readTimeInMinutes ?? 0 })}
            </span>
        </div>
    );
}
```

### The media + hover overlay (badge removed)

```tsx
/**
 * ArticleCardMedia
 *
 * @description
 * The 16:9 cover image with a hover overlay that reveals a "Read Article" button and
 * gently zooms the image. The category badge overlay from the source design is
 * intentionally omitted — the category lives in the meta row instead.
 */
interface ArticleCardMediaProps {
    slug: string;
    title: string;
    coverImageUrl: string | null;
}

export function ArticleCardMedia({ slug, title, coverImageUrl }: ArticleCardMediaProps) {
    const { t } = useTranslation();
    return (
        <div className="relative aspect-video overflow-hidden">
            {coverImageUrl ? (
                <Image
                    fill
                    src={coverImageUrl}
                    alt={title}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            ) : (
                <div className="flex size-full items-center justify-center bg-muted">
                    <NewspaperIcon className="size-10 text-muted-foreground" />
                </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                <Button asChild className="rounded-full bg-background/90 text-foreground hover:bg-background">
                    <Link href={`/articles/${slug}`}>{t("articles.card.read")}</Link>
                </Button>
            </div>
        </div>
    );
}
```

The engagement bar (`ArticleCardEngagement`) is documented with its optimistic
behavior in [10-interactions.md](10-interactions.md).

---

## Grid width note

The brief wrapped the card in `max-w-md`. Inside the grid the card fills its cell
(`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`), so **`max-w-md` is dropped** — the grid
column, not the card, owns the width. See
[06-articles-grid-and-infinite-scroll.md](06-articles-grid-and-infinite-scroll.md).

---

## New shared primitives this card needs

- **`Separator`** (`src/shared/presentation/components/ui/Separator/`) — none exists.
  A minimal themed rule supporting `orientation="horizontal" | "vertical"`:
  vertical → `w-px` full-height, horizontal → `h-px` full-width, `bg-border`. Build on
  `@radix-ui/react-separator` (run `npm show @radix-ui/react-separator dist-tags.latest`
  before pinning) or a bare `role="separator"` span. JSDoc + tokens required.
- **`BookmarkPlusIcon`** — add `Bookmark, BookmarkPlus as BookmarkPlusIcon` to
  `Icon/lucide.ts` (alphabetical). Import icons only from the barrel.

Both are specced in [specs/04-article-card.md](specs/04-article-card.md).
