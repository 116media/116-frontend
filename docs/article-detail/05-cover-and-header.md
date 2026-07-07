# The Cover & Header (Hero)

`ArticleDetail.Hero` is the top of the article page — everything above the body. It is a
**compound sub-composer** in the `articles` slice, assembled by `ArticleDetail` (the
top-level assembler, documented in the page-composition slice) and fed a **scoped subset**
of `IArticleDetailEntity`, never the whole entity.

```text
ArticleDetail(entity)
└── ArticleDetail.Hero   { coverImageUrl, categoryName, title, headline, author, publishedAt, readTimeInMinutes }
    ├── ArticleDetailHeroCover   { coverImageUrl, categoryName, author }   (full-bleed image + scrim overlays)
    ├── <Tag> category           categoryName                             (exclusive-tags style, above the title)
    ├── <h1> title               title
    ├── <p> headline             headline                                 (lead paragraph)
    └── ArticleDetailHeroMeta    { publishedAt, readTimeInMinutes }       (date · read time)
```

> **Scoped props.** Only `ArticleDetail` holds the entity. `Hero` receives the seven
> fields it renders and hands each child **exactly its slice** — the cover gets
> `{ coverImageUrl, categoryName, author }`, the meta gets `{ publishedAt,
> readTimeInMinutes }`. No child ever sees `IArticleDetailEntity`. This mirrors the
> [`ArticleCard.Feed`](../../articles/05-article-card.md) sub-composer split.

---

## Anatomy

### 1. The cover — `ArticleDetailHeroCover`

A full-width hero image with a gradient scrim and two overlaid pieces of chrome:

- **Category chip — bottom-left.** The category name overlaid on the scrim, so it reads as
  a kicker anchored to the image.
- **Author — bottom-right.** `UserAvatar` + `userName` on the opposite corner of the
  scrim, balancing the composition. (Overlaying the author on the scrim keeps the byline
  visually tied to the cover; the alternative — author below the title with the meta — was
  rejected so the header text block stays a clean title / headline / meta stack.)

The image is `next/image` with `fill`, `object-cover`, inside a tall hero aspect
(`aspect-video` on small screens widening toward a `21:9`-ish band on large ones, or a
fixed `h-[60vh]` hero — pick one at build time and keep it token-driven). A dark
`bg-linear-to-t from-black/70 via-black/20 to-transparent` scrim guarantees the overlaid
chrome stays legible over any photo.

When `coverImageUrl` is `null`, render the same **`bg-muted` + `NewspaperIcon`** fallback
the feed card uses — no placeholder asset, no layout shift.

```tsx
/**
 * ArticleDetailHeroCover
 *
 * @description
 * The full-bleed cover band. Renders the cover image (next/image, fill, object-cover)
 * under a gradient scrim, with the category chip overlaid at the bottom-left and the
 * author (avatar + name) at the bottom-right. When there is no cover, a token-colored
 * muted surface with a NewspaperIcon stands in.
 */
export function ArticleDetailHeroCover({
    coverImageUrl,
    categoryName,
    author
}: ArticleDetailHeroCoverProps) {
    return (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl md:h-[60vh] md:aspect-auto">
            {coverImageUrl ? (
                <Image
                    fill
                    priority
                    src={coverImageUrl}
                    alt={categoryName}
                    sizes="100vw"
                    className="object-cover"
                />
            ) : (
                <div className="flex size-full items-center justify-center bg-muted">
                    <NewspaperIcon className="size-16 text-muted-foreground" />
                </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
            <span className="absolute bottom-4 left-4">
                <Tag as="span" variant="primary" size="sm">
                    {categoryName}
                </Tag>
            </span>
            <div className="absolute right-4 bottom-4 flex items-center gap-2 text-white">
                <UserAvatar
                    size={32}
                    userName={author?.userName ?? ""}
                    image={author?.avatarUrl ?? undefined}
                />
                <span className="font-medium text-sm">{author?.userName}</span>
            </div>
        </div>
    );
}
```

> The `text-white` on the author byline is the one place a literal color is acceptable —
> it sits **on the fixed dark scrim**, not on a theme surface, exactly as the feed card's
> overlay button uses `bg-background/90`. The scrim itself is a gradient of `black/*`, a
> deliberate constant, not a themeable surface.

### 2. The category `Tag` above the title

The **same category** appears twice — once overlaid on the cover (above), and once as the
kicker directly above the `<h1>`, rendered as the shared **`Tag`** in the
**exclusive-tags style**: `variant="primary"`, `as="span"`. The exclusive tag strip
([`ArticlesToolbar.TagStrip`](../../../src/modules/articles/presentation/components/ArticlesToolbar/ArticlesToolbar.TagStrip.tsx))
passes `prefix="#"` on its pills; the **category** is a taxonomy label, not a hashtag, so
the header category `Tag` **omits** `prefix="#"`. (The `#` prefix is reserved for the
article's own tags — see [10-tags.md](10-tags.md).)

### 3. Title, headline, and meta

- **Title** — an `<h1>`, large and editorial (`font-bold text-3xl md:text-5xl`, tracking
  tight; a serif face if the reference typography calls for one — drive it from a token /
  font-family class, never inline).
- **Headline** — the lead paragraph under the title (`text-lg text-muted-foreground`),
  the article's teaser.
- **Meta line** — `RelativeDate(publishedAt)` · read time, with a `ClockIcon`, joined by a
  vertical `Separator`. The read time **reuses the existing key**
  `t("articles.card.readTime", { count: readTimeInMinutes })` — no new i18n string.

```tsx
/**
 * ArticleDetailHeroMeta
 *
 * @description
 * The meta line under the headline: the relative published date and the estimated read
 * time (ClockIcon), joined by a vertical Separator. Reuses the shared readTime key.
 */
export function ArticleDetailHeroMeta({
    publishedAt,
    readTimeInMinutes
}: ArticleDetailHeroMetaProps) {
    const { t } = useTranslation();
    return (
        <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-sm">
            <RelativeDate date={publishedAt} />
            <Separator orientation="vertical" className="h-4" />
            <span className="flex items-center">
                <ClockIcon className="mr-1 size-3.5" />
                {t("articles.card.readTime", { count: readTimeInMinutes ?? 0 })}
            </span>
        </div>
    );
}
```

---

## The assembled `Hero`

```tsx
/**
 * ArticleDetail.Hero
 *
 * @description
 * The article header: the cover band (with the category chip and author overlaid on the
 * scrim), then a text block of the category Tag, the title, the headline, and the meta
 * line. Receives a scoped subset of the article — never the whole entity.
 */
export function ArticleDetailHero({
    coverImageUrl,
    categoryName,
    title,
    headline,
    author,
    publishedAt,
    readTimeInMinutes
}: ArticleDetailHeroProps) {
    return (
        <header className="flex flex-col gap-6">
            <ArticleDetailHeroCover
                coverImageUrl={coverImageUrl}
                categoryName={categoryName}
                author={author}
            />
            <div className="flex flex-col gap-4">
                <Tag as="span" variant="primary" size="sm" className="self-start">
                    {categoryName}
                </Tag>
                <h1 className="font-bold text-3xl tracking-tight md:text-5xl">{title}</h1>
                <p className="text-lg text-muted-foreground">{headline}</p>
                <ArticleDetailHeroMeta
                    publishedAt={publishedAt}
                    readTimeInMinutes={readTimeInMinutes}
                />
            </div>
        </header>
    );
}
```

---

## Reused pieces

| Piece | Location | Used for |
|---|---|---|
| `Tag` | `shared/presentation/components/ui/Tag` | Category kicker + cover chip (`variant="primary"`) |
| `UserAvatar` | `shared/presentation/components/common/UserAvatar` | Author byline on the scrim |
| `RelativeDate` | `shared/presentation/components/ui/RelativeDate` | Published date in the meta line |
| `Separator` | `shared/presentation/components/ui/Separator` | Divider between date and read time |
| `ClockIcon`, `NewspaperIcon` | `shared/presentation/components/ui/Icon` | Read-time glyph, no-cover fallback |
| `next/image` | Next.js | Cover image (`fill`, `priority`) |
| `articles.card.readTime` | `articles/presentation/i18n` | Read-time label (reused, not duplicated) |

No new icon or primitive is required for the hero — `ClockIcon` and `NewspaperIcon` are
already in the barrel, and `Tag` / `UserAvatar` / `RelativeDate` / `Separator` all exist.

The full JSDoc'd snippets and the task checklist live in
[specs/04-cover-and-header.md](specs/04-cover-and-header.md).
