# 11 — Popular Articles Sidebar

The wide layout carries a left column of **popular articles** beside the reading column —
a titled list of compact **horizontal** cards. It introduces one new card variant,
`ArticleCard.Horizontal`, and one hook, `useArticleDetailPopular`, then assembles them in
`ArticleDetail.PopularSidebar`.

```text
ArticleDetail.PopularSidebar          titled column ("Popular articles")
 ├─ ArticleCard.Horizontal            bordered row: thumbnail + title + meta
 ├─ ArticleCard.Horizontal
 └─ …up to ~5
```

---

## `ArticleCard.Horizontal` — a new variant

The card family is a compound (`ArticleCard = { Feed }` today). We add `Horizontal` and
update the barrel to `ArticleCard = { Feed, Horizontal }`, mirroring the video family's
`VideoCard = { Horizontal, Vertical }`.

`ArticleCard.Horizontal` is a **bordered row**, laid out exactly like
[`VideoCard.Horizontal`](../../src/modules/videos/presentation/components/VideoCard/VideoCard.Horizontal.tsx):

- **Left**: a landscape thumbnail, `~w-28` and responsive, 16:9, `shrink-0`, rounded, with
  the same `bg-muted` fallback surface. It reuses **`ArticleCard.Media`** for the cover
  image + hover overlay where sensible (the Media component already handles the null-cover
  fallback and the "Read Article" overlay).
- **Right** (`min-w-0 flex-1 flex-col`): the **title** as an `h4`, `line-clamp-2`,
  `group-hover:text-primary` (dark: `group-hover:text-secondary`); then a **meta row**
  pushed to the bottom (`mt-auto`) with the **category `Tag`** (or the published date) and
  small counts, muted `text-xs`.
- The whole row is a `Link` to `/articles/{slug}` with a `group` hover treatment
  (`hover:bg-muted/50`), identical to the video row.

Like `ArticleCard.Feed`, its entry prop is a single **`IArticleSummaryEntity`** — the same
shape `articleSummaryFromDto` already produces, so the sidebar needs no new mapper. Inside,
it destructures into scoped sub-props (slug, title, cover, category, date, counts) and
reuses `ArticleCard.Media` / the `Tag` / `RelativeDate` primitives.

```tsx
<Link href={`/articles/${slug}`}
      className="group flex gap-3 rounded-xl border p-3 transition-all hover:bg-muted/50">
    <div className="relative w-28 shrink-0 overflow-hidden rounded-md">
        {/* ArticleCard.Media (16:9) */}
    </div>
    <div className="flex min-w-0 flex-1 flex-col">
        <h4 className="line-clamp-2 font-semibold group-hover:text-primary dark:group-hover:text-secondary">
            {title}
        </h4>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2 text-muted-foreground text-xs">
            {/* category Tag or date + counts */}
        </div>
    </div>
</Link>
```

---

## `useArticleDetailPopular(currentArticleId)` — sourcing "popular"

There is **no popularity endpoint** ([03-backend-api-reference.md](03-backend-api-reference.md)
§4). The hook sources popular articles from what exists and excludes the current article:

1. **Primary**: `getPromotedArticlesUseCase.execute()` — editorially boosted articles ≈
   "popular" — filtered to drop `currentArticleId`.
2. **Fallback**: if promoted returns empty (or too few), the first page of
   `getPublishedArticlesUseCase.execute({ pageIndex: 0, pageSize: … })`, also excluding the
   current article.

It returns **up to ~5** `IArticleSummaryEntity`. Both use cases already live in the cradle
(`getPromotedArticlesUseCase`, `getPublishedArticlesUseCase`) and both return
`Result<…>` — the hook unwraps and slices.

```ts
export function useArticleDetailPopular(currentArticleId: string) {
    return useQuery({
        queryKey: articleKeys.popular(currentArticleId),
        queryFn: async () => {
            const promoted = await container.cradle.getPromotedArticlesUseCase.execute();
            const list = promoted.ok ? promoted.value : [];
            const filtered = list.filter((a) => a.id !== currentArticleId);
            if (filtered.length >= 1) return filtered.slice(0, 5);
            const page = await container.cradle
                .getPublishedArticlesUseCase.execute({ pageIndex: 0, pageSize: 6 });
            const items = page.ok ? page.value.items : [];
            return items.filter((a) => a.id !== currentArticleId).slice(0, 5);
        }
    });
}
```

### Query key

Keyed under the existing `articleKeys`. Add a **`popular`** entry:

```ts
popular: (articleId: string) => [...articleKeys.all, "popular", articleId] as const
```

Keying by `currentArticleId` keeps each article's exclusion list cached independently.

> **Open question — no true popularity sort.** "Promoted" is an editorial signal, not a
> view/like ranking, so this sidebar approximates popularity rather than measuring it. When
> a real "most popular / trending" endpoint (sorted by engagement) lands, swap the primary
> source and drop the promoted-then-published fallback. Tracked in
> [19-open-questions.md](19-open-questions.md).

---

## `ArticleDetail.PopularSidebar`

Renders a titled column of `ArticleCard.Horizontal`. Scoped prop: `currentArticleId`
(it owns the hook, not the entity).

- **Heading**: "Popular articles" from i18n key **`articles.sidebar.popular`**.
- **Loading**: while the query is pending, render ~5 **skeleton** rows (a thumbnail block +
  two title lines), matching the horizontal card's footprint so the column does not jump.
- **Empty guard**: if the resolved list is empty (no promoted, no published fallback), the
  sidebar renders **nothing** (no heading, no empty-state box) — a popular column with no
  content should not occupy the layout. On `lg+` the reading column simply spans wider.
- **Data**: `.map` the up-to-5 summaries into `<ArticleCard.Horizontal article={…} />`.

```tsx
export function ArticleDetailPopularSidebar({ currentArticleId }: Props) {
    const { data, isPending } = useArticleDetailPopular(currentArticleId);
    if (isPending) return <PopularSkeletons count={5} />;
    if (!data || data.length === 0) return null;
    return (
        <aside className="flex flex-col gap-3">
            <h2 className="font-semibold text-lg">{t("articles.sidebar.popular")}</h2>
            {data.map((article) => (
                <ArticleCard.Horizontal key={article.id} article={article} />
            ))}
        </aside>
    );
}
```

On mobile the sidebar drops below the body (or is hidden) per the page composition
([04-page-composition.md](04-page-composition.md)); on `lg+` it is the left column.

The full `ArticleCard.Horizontal`, the barrel update, the hook, the `popular` key, and the
skeleton are in [specs/09-popular-sidebar.md](specs/09-popular-sidebar.md).
