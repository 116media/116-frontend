# 04 — Utils & Helpers

Rules in [01 §5](01-canonical-conventions.md). The question the team asked — *"how should
utils be structured?"* — has a concrete answer below, plus the inline/duplicated helpers to
relocate.

---

## The structure — mirror the dashboard

Utils are grouped **by concern into a folder**, each holding a type-suffixed grouped file —
the same convention `apps/dashboard/src/**/presentation/utils/` uses. **Not** one function
per file.

**Shape:** `<layer>/presentation/utils/<concern>/<concern>.utils.ts`

- **Folder per concern** (`slug`, `youtube`, `format`, `color`…) — never per function.
- File **`<concern>.utils.ts`** holding the 1–N related functions for that concern (grouped),
  each JSDoc'd.
- **`.validator.ts` / `.notification.ts` are fixed buckets** — `utils/validators/`,
  `utils/notification/` — with the module/concern in the **filename prefix**
  (e.g. `catalog.packages.validator.ts`, `lookup.tags.notification.ts`), *not* a
  `<concern>/<concern>.notification.ts` folder. The frontend follows this for notifications
  (`utils/notification/articles.share.notification.ts`); validation schemas keep their own
  `validation/` dir (zod `.schema.ts`, a different mechanism from the dashboard's validators).
- A JSX-returning helper uses `<concern>.utils.tsx` — a **frontend-specific** extension; the
  dashboard has no `.utils.tsx` files.
- **No barrel `index.ts`** in utils dirs — import the file directly
  (`@/shared/presentation/utils/format/format.utils`).
- Lives in every module's `presentation/utils/` **and** `shared/presentation/utils/`.

| Kind of helper | Home | File |
|---|---|---|
| UI formatting / browser / DOM | `shared/presentation/utils/<concern>/` | `<concern>.utils.ts` |
| Helper returning JSX | same folder | `<concern>.utils.tsx` |
| Module-specific presentation helper | `modules/<m>/presentation/utils/<concern>/` | `<concern>.utils.ts` |
| DTO ↔ domain entity | `infrastructure/mappers/` | `<feature>.mapper.ts` (grouped object) |
| Entity predicate / derivation (business invariant) | the owning `domain/` | — |
| Domain result/failure factories (`ok`, `err`, `unwrap`) | `shared/domain/{results,failures}/` (already correct) | — |
| Single-caller trivial closure | inline in the consumer | — |

### Remap the current flat utils → concern folders

Today `shared/presentation/utils/` is 14 flat one-fn files. Group them by concern:

| Now (flat) | Dashboard-style |
|---|---|
| `cn.ts` | `cn/cn.utils.ts` |
| `formatCount.ts`, `formatRelativeDate.ts` | `format/format.utils.ts` (both) |
| `withAlpha.ts` | `color/color.utils.ts` |
| `avatar.ts` | `avatar/avatar.utils.ts` |
| `shareUrl.ts` (+ new `resolveShareUrl`) | `share/share.utils.ts` |
| `youtube.ts` (+ `buildYoutubeEmbedUrl`) | `youtube/youtube.utils.ts` |
| `country.ts` | `country/country.utils.ts` |
| `notification.tsx` | `notification/notification.utils.tsx` |
| new `sanitize.ts` (DUP1) | `sanitize/sanitize.utils.ts` |
| `getClientLanguage`, `setClientLanguage`, `setLanguageCookie`, `resolveLanguage` (client) | `language/language.client.utils.ts` |
| `getServerLanguage` (server) | `language/language.server.utils.ts` |

Module utils created by this work follow suit (concern folder + `.utils.ts`):

| Helper | Home |
|---|---|
| `videoJsonLd` | `modules/videos/presentation/utils/json-ld/video-json-ld.utils.ts` |
| `articleJsonLd` | `modules/articles/presentation/utils/json-ld/article-json-ld.utils.ts` |
| `orderTags` | `modules/articles/presentation/utils/tags/tags.utils.ts` |

> **Frontend-only nuance (Next SSR):** the dashboard is a Vite SPA, so it can freely group
> client + server helpers. The frontend must **not** co-bundle server-only helpers (those that
> import `next/headers`, e.g. `getServerLanguage`) with client helpers — split them into
> `<concern>.server.utils.ts` / `<concern>.client.utils.ts` (or `.utils.ts` for
> environment-agnostic ones) within the same concern folder, as shown for `language/` above.

> **Decision — notifications live under `utils/notification/` (dashboard parity).** Every
> module's toast configs sit in `presentation/utils/notification/<module>[.<concern>].notification.ts`
> (e.g. `videos.playlist.notification.ts`, `auth.notification.ts`). Only **validation** keeps its
> dedicated `presentation/validation/` dir — the frontend's zod `.schema.ts` files are a different
> mechanism from the dashboard's `.validator.ts` bucket.

All util *targets* referenced later in this doc (U1–U6) use this `<concern>/<concern>.utils.ts`
form.

---

## U1 / U2 / U3 — Duplication

| ID | Helper | Locations | Sev | Fix |
|---|---|---|---|---|
| **U2** | `SANITIZE_CONFIG` DOMPurify allow-lists (identical) | `ArticleDetail.Body.tsx:19`, `VideoDetail.Description.tsx:14` | 🔴 | New `shared/presentation/utils/sanitize/sanitize.utils.ts` = one config + `sanitizeHtml(html)`. Same finding as [03 K2](03-constants.md). |
| **U1** | Absolute-share-URL resolver (`window.location.href ?? SITE_URL + /<type>/<slug>`) | `VideoShareModal.tsx:49` (`resolveVideoUrl`), `ArticleDetail.ShareRail.tsx:36` (`resolveArticleUrl`) | 🟡 | Add `resolveShareUrl(path)` to `shared/presentation/utils/share/share.utils.ts` (with `buildShareUrl`). |
| **U3** | YouTube embed-URL string `https://www.youtube.com/embed/${id}` hand-built | `videoJsonLd.ts:38` | 🟢 | Add `buildYoutubeEmbedUrl(id)` to `shared/presentation/utils/youtube/youtube.utils.ts` (which already owns `extractYoutubeId`). |

`formatCount` is correctly the single count-formatter (no inline `Intl.NumberFormat`
elsewhere) — the model to emulate.

---

## U4 — Reusable pure helpers defined inline 🟡 M

Non-component, non-hook, reusable functions living in a component/hook file:

| `path:line` | Helper | Move to |
|---|---|---|
| `videos/.../VideoDetail/VideoDetail.Similar.tsx:29` | `dedupeById` (generic dedupe-by-id) | `shared/presentation/utils/collection/collection.utils.ts` as `dedupeById<T extends { id: string }>` |
| `videos/.../hooks/useYoutubeStats.ts:29` | `isAllNull` (predicate over `IYoutubeVideoStats`) | mapper-derived `hasStats` boolean on the entity (`VideosMapper.youtubeStatsFromJson`) — domain files hold no functions (see U6) |
| `auth/.../context/AuthProvider.tsx:42` | `deriveAuthStatus` (pure status derivation, testable) | `auth/presentation/utils/` or `auth/domain/` |

**Keep inline (trivial / single-caller closures):** `bigValue` (`VideoDetail.Scoreboard.tsx:136`,
closes over `pending`, returns JSX), `buildDummyDescription` (`video-detail.dummy.ts:40`,
dummy-only), `commentDisplayName` (`ArticleDetailComment.tsx:31`), `readingProgressColor`
(`ArticleDetail.ReadingProgress.tsx:36`), `focusComposer` (`ArticleDetail.tsx:38`),
`makeQueryClient`/`getQueryClient` (`QueryProvider.tsx`, provider-internal).

---

## U5 — Pure helpers under `components/` instead of a `utils/` 🟡 S

Already extracted to their own file, but living in a component folder rather than a `utils/`:

| `path` | Helper | Move to |
|---|---|---|
| `articles/.../ArticlesToolbar/orderTags.ts` | `orderTags` (pure list ordering) | `articles/presentation/utils/` |
| `articles/.../ArticleDetail/articleJsonLd.ts` | `articleJsonLd` (SEO builder) | `articles/presentation/utils/` |
| `videos/.../VideoDetail/videoJsonLd.ts` | `videoJsonLd` (SEO builder) | `videos/presentation/utils/` |

(Creating `presentation/utils/` for articles/videos also feeds the module-parity target in
[07](07-module-and-layer-parity.md).)

---

## U6 — Layer leakage 🟡 M

| `path:line` | Leak | Fix |
|---|---|---|
| `videos/.../hooks/useYoutubeStats.ts:29` (`isAllNull`) | Presentation hook holds a **domain** predicate over `IYoutubeVideoStats` | Derive it in the mapper as a `hasStats` entity boolean (dashboard pattern); the hook reads the property |
| `videos/.../videoJsonLd.ts` & `articles/.../articleJsonLd.ts` | Pure **domain→SEO** transforms sitting in presentation `components/` | Relocate to `presentation/utils/` (U5); acceptable as presentation concern once out of `components/` |
| `shared/presentation/utils/country.ts:1` | Presentation util imports from **infrastructure** (`@/shared/infrastructure/constants/countries`) | Acceptable (it's a lookup over a reference constant), but note the cross-layer read; if it grows, the country list should surface through a domain/application seam |

No reverse leakage found (no infra mapper doing presentation formatting).

---

## Naming notes (see also [06](06-naming-and-imports.md))

- `shared/presentation/hooks/UseLanguageDropdown.ts` — capital-`U` hook filename; rename to
  `useLanguageDropdown.ts` ([N4](06-naming-and-imports.md)).
- Utils use the dashboard's **concern-folder** form: `utils/<concern>/<concern>.utils.ts`
  (grouped by concern, not one-fn-per-file). Mappers keep the grouped-object
  `<feature>.mapper.ts` form. This supersedes the earlier "one-fn-per-file" note.
- A JSX-returning util is `<concern>.utils.tsx` (e.g. `notification/notification.utils.tsx`).

---

## Counts

- Util/mapper/helper files today: 14 shared presentation utils, 4 mappers (1 shared + 3 module), 1 module presentation util (`auth/authChannel.ts`), 2 domain factory files.
- Inline helpers in `.tsx`/hook/data files: **12** (4 reusable → move, 6 trivially-local → keep, 2 provider-internal → keep).
- Extracted-but-misplaced helpers (in `components/`): **3**.
- Confirmed duplications: **3** (U1 URL resolver, U2 sanitize config, U3 embed URL).
- Layer-leakage instances: **3**.
