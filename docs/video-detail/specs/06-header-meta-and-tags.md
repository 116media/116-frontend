# Spec 06 — Header, Rating, Stat Chips & Tags

Design ref: [../07-header-and-meta.md](../07-header-and-meta.md). Four composers in
`VideoDetail/`, all scoped-prop, no author anywhere.

## 1. `VideoDetail.Header.tsx`

Props: `{ videoId, slug, title, categoryName, ratingAverage, ratingCount, shareCount,
youtubeVideoUrl, onShare, onAddToPlaylist }`.

Layout: category `Tag` (`variant="primary" size="sm"`) → `h1`
(`font-serif font-bold text-2xl md:text-3xl line-clamp-3`) → meta row (rating action +
stat chips) → action row (`flex-wrap`):

- Share `Button` (`variant="outline"`, `ShareIcon`, `videos.detail.share`) →
  `onShare()` opens the modal.
- Playlist `Button` (`variant="outline"`, `ListPlusIcon` — **barrel addition**
  `ListPlus as ListPlusIcon`) → `onAddToPlaylist()`.

## 2. `VideoDetail.Rating.tsx`

Props: `{ videoId, slug, ratingAverage, ratingCount }`.

- Display: the `VideoCard.Rating` idiom — `StarRating` + `4.6` + `(128)` muted.
- Action: five star buttons (hover fills up to the hovered star with
  `text-warning`/`fill-warning`); click → `useRateVideo(videoId, slug).submit(stars)`
  (auth-gated inside the hook; guest → login modal, resumes after). `aria-label` per
  star via `videos.detail.rating.rateAria` `{{stars}}`. Pending: stars disabled +
  reduced opacity. No `myRating` echo (DTO gap —
  [../18-open-questions.md](../18-open-questions.md)).

## 3. `VideoDetail.Stats.tsx`

Props: `{ youtubeVideoUrl, shareCount }`. Internally
`useYoutubeStats(extractYoutubeId(youtubeVideoUrl))`.

- Chips (icon + `formatCount` number, `text-muted-foreground text-sm`, `gap-1.5`):
  views/`EyeIcon`, likes/`ThumbsUpIcon` (**barrel addition** `ThumbsUp as
  ThumbsUpIcon`), comments/`MessageSquareIcon`, shares/`ShareIcon` (backend count —
  always renders).
- Loading → three `Skeleton` chips (`h-4 w-14`); null field → chip absent; each chip
  carries an `aria-label`/`title` from `videos.detail.stats.*`.

## 4. `VideoDetail.Tags.tsx`

Props: `{ tags: IVideoTagEntity[] }`. The article tags block verbatim, minus links:
uppercase `videos.detail.tags.label` + `#`-prefixed `Tag` pills, `as="span"`
(no video tag filter exists — [../03-backend-api-reference.md](../03-backend-api-reference.md) §5),
slate resting fill (`bg-muted text-muted-foreground border-transparent`), brand hover
(`hover:bg-primary hover:text-primary-foreground dark:hover:bg-secondary
dark:hover:text-secondary-foreground`), top border, empty → null.

## Tasks

- [ ] `ListPlusIcon` + `ThumbsUpIcon` added to the lucide barrel.
- [ ] Header composes category/title/meta/actions, wraps cleanly at mobile widths.
- [ ] Rating submits 1–5 auth-gated, toasts, invalidates detail; hover preview works.
- [ ] Stats chips: skeleton → numbers → hidden-null behaviors verified (with and
      without `YOUTUBE_API_KEY`).
- [ ] Tags block matches the articles styling; renders nothing when empty.
- [ ] `tsc` + biome clean.
