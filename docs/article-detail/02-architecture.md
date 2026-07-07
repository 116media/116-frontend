# 02 — Architecture

The detail page is a **vertical slice inside the existing `articles` module** — it does
not create a new module. It extends the four clean-architecture layers the feed already
established (domain → application → infrastructure → presentation) and adds one route.

## Layering

```text
domain          IArticleDetailEntity, IArticleImage, IArticleCommentEntity, IArticleCommentPage
   ↑
application      IArticlesRepositoryPort  (+ getArticleBySlug, getArticleComments, addArticleComment)
                 use cases: GetArticleBySlug, GetArticleComments, AddArticleComment
   ↑
infrastructure   articles.repository.impl (new methods), articles.mapper (articleDetailFromDto, …), DI + cradle
   ↑
presentation     hooks (useArticleDetail, useArticleComments, useAddArticleComment, useReadingProgress),
                 components (ArticleDetail/*, ArticleCard.Horizontal), the /articles/[slug] route
```

- Every repository/use-case method returns `Result<T>`; `ProblemMapper.toFailure` in
  catches; no thrown errors across layers.
- The presentation layer never imports the generated client directly — it goes through
  `container.cradle.<useCase>` (Awilix), exactly like the feed.

## Reuse map — what already exists and is used as-is

| Piece | Location | Used for |
|---|---|---|
| `IArticleSummaryEntity`, `IArticleAuthor` | `articles/domain/entities` | Popular sidebar cards; author shape |
| `articleSummaryFromDto`, `tagFromDto` | `articles/infrastructure/mappers/articles.mapper.ts` | Mapping summaries & tags |
| `useToggleArticleLike`, `useToggleArticleBookmark` | `articles/presentation/hooks` | Like / bookmark (unchanged) |
| `useShareArticle` | `articles/presentation/hooks` | Share (platform arg) |
| `getPromotedArticles` / `getPublishedArticles` (+ use cases) | repo/usecases | Popular sidebar source |
| `articleKeys` | `articles/presentation/constants/articleKeys.ts` | Extended with `detail`, `comments` |
| `ArticleCard` compound | `articles/presentation/components/ArticleCard` | Extended with `.Horizontal` |
| `Tag`, `UserAvatar`, `RelativeDate`, `Separator`, `EmptyState`, `Button`, `Input` | `shared/presentation/components` | Header, meta, states, composer |
| Icon barrel | `shared/presentation/components/ui/Icon` | `HeartIcon`, `BookmarkIcon`, `MessageSquareIcon`, `ShareIcon`, `ClockIcon`, `CalendarIcon`, … |
| `@icons-pack/react-simple-icons` | dependency | Facebook / X / WhatsApp brand marks |
| `useDismiss`, `useDebouncedValue`, `useIntersectionObserver` | `shared/presentation/hooks` | Comments pagination sentinel, misc |
| `VideoCard.Horizontal` | `videos/presentation/components/VideoCard` | Layout reference for `ArticleCard.Horizontal` |

## New files

### Domain (`articles/domain/entities`)
- `IArticleDetailEntity.ts` — the full article (adds `body`, `tags`, `images`,
  `readTimeInMinutes`, `author`, counts).
- `IArticleImage.ts` — `{ id, url, type: "cover" | "body" }`.
- `IArticleCommentEntity.ts` — `{ id, userId, body, isDeleted, createdAt, author? }`.
- `IArticleCommentPage.ts` — paginated comments (`items`, `pageIndex`, `pageSize`,
  `count`, `hasNextPage`).

### Application
- `articles.repository.port.ts` — **extend** with `getArticleBySlug`,
  `getArticleComments`, `addArticleComment` (+ optional `editArticleComment`,
  `deleteArticleComment`).
- `usecases/getarticlebyslug.usecase.ts`, `getarticlecomments.usecase.ts`,
  `addarticlecomment.usecase.ts`.

### Infrastructure
- `articles.mapper.ts` — **extend** with `articleDetailFromDto`, `articleImageFromDto`,
  `articleCommentFromDto`, `articleCommentPageFromDto`.
- `articles.repository.impl.ts` — **extend** with the new methods.
- `articles.dependencies.ts` + `service.locator.ts` — register the new use cases in the
  cradle.

### Presentation — hooks (`articles/presentation/hooks`)
- `useArticleDetail.ts` — `useQuery` for one article by slug.
- `useArticleComments.ts` — `useInfiniteQuery` for the comment list.
- `useAddArticleComment.ts` — `useMutation` with optimistic prepend + count bump.
- (`useReadingProgress.ts` lives in **shared** hooks — it's generic.)

### Presentation — shared
- `shared/presentation/hooks/useReadingProgress.ts` — scroll-progress hook.
- `shared/presentation/components/ui/Progress/` — a slim themed progress bar primitive
  (none exists).
- `shared/presentation/components/ui/Textarea/` — a themed textarea primitive for the
  composer (none exists; `Input` is single-line).
- `shared/presentation/components/ui/Prose/` — a typographic container for the sanitized
  HTML body (or a Tailwind `prose`-style class set — see [06](06-article-body.md)).

### Presentation — components (`articles/presentation/components`)
- `ArticleCard/ArticleCard.Horizontal.tsx` + barrel update → `ArticleCard = { Feed, Horizontal }`.
- `ArticleDetail/` compound:
  - `ArticleDetail.tsx` — assembles the page from the entity.
  - `ArticleDetail.Hero.tsx` — cover + category overlay + author + title `Tag` + title +
    headline + meta.
  - `ArticleDetail.Body.tsx` — sanitized HTML in the prose container.
  - `ArticleDetail.Tags.tsx` — tag block.
  - `ArticleDetail.Engagement.tsx` — like / comment / bookmark.
  - `ArticleDetail.ShareRail.tsx` — Facebook / X / WhatsApp / copy-link.
  - `ArticleDetail.ReadingProgress.tsx` — the sticky top bar.
  - `ArticleDetail.PopularSidebar.tsx` — popular column (`ArticleCard.Horizontal`).
  - `ArticleDetail.Comments.tsx` — list + composer wrapper.
  - `ArticleDetailComment.tsx` — one comment row.
  - `ArticleDetailCommentComposer.tsx` — textarea + submit.
  - `index.ts` — barrel, and the client `ArticleDetailContainer`.

### Route
- `app/(public)/articles/[slug]/page.tsx` — async RSC + `generateMetadata`.

### i18n
- `articles/presentation/i18n/locales/{en,fr}/article-detail.ts` (or extend `articles.ts`)
  — `articles.detail`, `articles.comments`, `articles.share`, `articles.sidebar` groups.

## Naming conventions (locked)

- **Compound card files** use dot notation, symbols stay concatenated:
  `ArticleCard.Horizontal.tsx` exports `ArticleCardHorizontal`; the `ArticleDetail.*.tsx`
  sub-composers export `ArticleDetail<Part>` and are internal (only the container is
  exported from the barrel).
- **Scoped props** — every sub-composer receives only the fields it renders, never the
  whole `IArticleDetailEntity`. Only `ArticleDetail` (the assembler) holds the entity.
- **JSDoc-only**, theme tokens only, icons from the barrel — the standing module rules.
