# 03 — Constants

Rules in [01 §4](01-canonical-conventions.md). Two problems: **config constants scattered
into component/hook files** (some duplicated), and **over-verbose comments** on the older
shared constants.

---

## Where constants live today

| Location | File(s) | Contents |
|---|---|---|
| `modules/articles/presentation/constants/` | `articleKeys.ts` | query keys + `ARTICLES_PAGE_SIZE`, `ARTICLE_COMMENTS_PAGE_SIZE` (+ an interface) |
| `modules/auth/presentation/constants/` | `authKeys.ts` | query keys |
| `modules/videos/presentation/constants/` | `videoKeys.ts` | query keys + `SIMILAR_VIDEOS_PAGE_SIZE`, `POPULAR_VIDEOS_LIMIT` |
| `modules/session/infrastructure/constants/` | `storage.constants.ts` | `DEVICE_ID_STORAGE_KEY`, `X_DEVICE_ID_HEADER` |
| `shared/infrastructure/constants/` | `api.ts`, `common.ts`, `countries.ts` | error map, env/identity, country list |
| `shared/presentation/constants/` | `colors.ts`, `languages.ts`, `paths.ts` | palette, language list, routes |
| `shared/presentation/layouts/{Header,TopBar}/` | `constants.ts` | `NAV_LINKS`, `SOCIAL_LINKS` (colocated) |

Structural drift:
- **`settings` has no constants folder** despite inline config (`SETTINGS_TABS`, `DEVICE_ICONS`) — see [K5](#k5).
- **Naming drift** — `xxxKeys.ts` vs `storage.constants.ts` (`.constants` suffix) vs bare `api.ts`/`colors.ts`. Pick one (see [06](06-naming-and-imports.md)).
- **Interfaces inside constants files** — `articleKeys.ts` (`IArticleFeedFilters`), `languages.ts` (`ILanguage`). Mild scope creep; move the interface to a `types.ts` or the domain if it grows.

---

## K1 / K2 / K3 — Duplicated constants

| ID | Constant | Locations | Sev | Fix |
|---|---|---|---|---|
| **K2** | `SANITIZE_CONFIG` (DOMPurify `ALLOWED_TAGS`/`ALLOWED_ATTR`) — **byte-for-byte identical, security-relevant** | `articles/.../ArticleDetail/ArticleDetail.Body.tsx:19`, `videos/.../VideoDetail/VideoDetail.Description.tsx:14` | 🔴 | Single `shared/presentation/utils/sanitize/sanitize.utils.ts` exporting the config + a `sanitizeHtml()` wrapper. A fix to the allow-list must propagate to both surfaces. Cross-ref [04 U2](04-utils-and-helpers.md). |
| **K1** | `SENTINEL_OPTIONS = { rootMargin: "200px 0px" }` (infinite-scroll observer) | `articles/.../ArticlesGrid/index.tsx:21`, `articles/.../ArticleDetail/ArticleDetail.Comments.tsx:21`, `videos/.../VideoDetail/VideoDetail.Similar.tsx:17` | 🟡 | One `INFINITE_SCROLL_SENTINEL_OPTIONS` in `shared/presentation/constants/`. |
| **K3** | `STAR_POSITIONS = [1,2,3,4,5] as const` | `videos/.../VideoDetail/VideoDetail.Scoreboard.tsx:16`, `videos/.../VideoDetail/VideoRatingModal.tsx:20` (also conceptually shared with `ui/StarRating`) | 🟢 | One shared `STAR_POSITIONS`. |

---

## K4 — Config-like constants inline that should move 🟡 M

Module-scope config data declared at the top of a component/hook/impl instead of a
`constants/` file:

| `path:line` | Const | Move to |
|---|---|---|
| `modules/settings/.../SettingsSidebar/index.tsx:16` | `SETTINGS_TABS` (route+i18n nav list) | new `settings/presentation/constants/` |
| `modules/settings/.../SessionCard/index.tsx:28` | `DEVICE_ICONS` (`Record<string, Component>`) | same |
| `shared/.../common/UserAccountControl/index.tsx:33` | `USER_MENU_ITEMS` (menu list) | shared/settings constants |
| `modules/auth/.../modal/AuthModal.tsx:29` | `VIEW_TITLES` (view→i18n map) | `auth/presentation/constants/` |
| `modules/auth/.../VerifyOtpForm/index.tsx:14-15` | `OTP_LENGTH`, `RESEND_COOLDOWN_SECONDS` | `auth/presentation/constants/` |
| `modules/videos/.../VideoDetail/VideoDetailPlayer.Plyr.tsx:12` | `PLYR_OPTIONS` (player config) | `videos/presentation/constants/` |
| `modules/articles/infrastructure/repositories/articles.repository.impl.ts:26,33` | `ALL_TAGS_LIMIT`, `POPULAR_TAGS_LIMIT` | next to the page-size consts in `articleKeys.ts` |
| `shared/application/usecases/prefetchnavigation.usecase.ts:12` | `PROMOTED_LIMIT` | shared constants |
| `shared/.../ui/Toaster/FlashToast.tsx:24` | `TYPE_STYLES` (variant→style/icon) | colocated `FlashToast/constants.ts` (borderline — see below) |
| `shared/.../common/SocialShareGroup/index.tsx:60` | `DEFAULT_PLATFORMS` | colocated/shared |
| `shared/.../ui/Md3Carousel/Md3Carousel.tsx:12,18` | `SLOT_TRANSITION`, `SWIPE_THRESHOLD` | colocated (borderline) |

**Genuinely local — keep inline (do not churn):** `ARTICLE_BODY_ID`, `SUCCESS_FROM`/`WARNING_FROM`
(ReadingProgress), `MAX_COMMENT_LENGTH`, `POPULAR_SKELETON_ROWS`,
`SCOREBOARD_COLUMNS`/`TAG_CHIPS`/`DESCRIPTION_LINES` (skeleton-only), `DUMMY_PAGE_LATENCY_MS`,
`YOUTUBE_STATS_STALE_TIME_MS`/`NULL_STATS`, `DEFAULT_AVATAR_SIZE`, `DETECTED_COUNTRY_KEY`,
`TAB_SPRING`, `REFRESH_TOKEN_EXPIRED_EVENT`, and all `*.dummy.ts`/`data/` seed constants
(already correctly isolated).

---

## K5 — `settings` module has no constants folder 🟡 S

`SETTINGS_TABS`, `DEVICE_ICONS`, and the OTP/menu maps above have nowhere canonical to go.
Create `modules/settings/presentation/constants/` (bringing it to parity with
articles/auth/videos — see [07](07-module-and-layer-parity.md)) and land K4's settings rows
there.

---

## K7 — Over-verbose / catalog comments on constants 🟡 M

The team's constant-comment style is mostly good ("one concise line, explain the why").
The offenders are the older shared constants that carry a full `@property` catalog or a
prose re-listing of self-evident keys:

| `path:line` | Problem |
|---|---|
| `shared/presentation/constants/colors.ts:1-41` | **~40-line JSDoc**, one `@property` per color re-stating the obvious ("`White` - White color"). Worst offender. |
| `shared/presentation/constants/paths.ts:1-19` | 19-line block re-listing every route in prose, duplicating the `export const` names below. |
| `shared/infrastructure/constants/common.ts:1-15` | Multi-section header ("**Environment Variables:**"…) narrating obvious `process.env` reads. |
| `shared/presentation/constants/languages.ts:19-24,26-31` | `USER_LANG`/`LANGUAGE_LIST` blocks repeat the const name as a heading. |
| `shared/presentation/layouts/{TopBar,Header}/constants.ts` | `@property` catalogs re-describing self-evident `icon`/`href`/`label` fields. |
| `videos/.../VideoDetail/VideoDetail.Scoreboard.tsx:13-15` | 3-line block for `STAR_POSITIONS = [1,2,3,4,5]` restating the literal. |

**Fix:** collapse each to a single concise line (or a short file-level comment for a
catalog file), documenting only the non-obvious rationale. **Model examples to copy:**
`AuthModal.tsx` `VIEW_TITLES`, `FlashToast.tsx` `TYPE_STYLES`, `VideoDetailPlayer.Plyr.tsx`
`PLYR_OPTIONS` — concise, explain the *why*, no per-field catalog.

**Decorative separators:** none found — the no-separator rule is currently respected. Keep it.

---

## cva vs data maps — the boundary

- **Keep inline:** `cva()` variant definitions tied to one primitive (`badgeVariants`,
  `tagVariants`, `buttonGroupVariants`, `buttonVariants`, `cardVariants`). Extracting adds
  indirection with zero reuse benefit — this is the shadcn idiom.
- **Extract (they're data, not styling):** `DEVICE_ICONS`, `SETTINGS_TABS`,
  `USER_MENU_ITEMS`, `VIEW_TITLES`.
- **Borderline (`Record<>` style maps):** `TYPE_STYLES` (FlashToast), `SLOT_TRANSITION`/
  `SWIPE_THRESHOLD` (Md3Carousel), `DEFAULT_PLATFORMS` (SocialShareGroup) — keep **inline**, or
  colocate as `FlashToast/constants.ts` etc. under the **R13 carve-out**
  ([component-folder-structure/01-rules.md](component-folder-structure/01-rules.md) R13:
  folder-local content too large to inline). Do **not** scatter them to a module constants dir.
  Layout constants (`layouts/{Header,TopBar}/constants.ts`) fall under the same carve-out.

---

## Counts

- Constants files/dirs: 6 `constants/` dirs + 2 colocated `constants.ts`; 12 files.
- Modules missing a constants folder despite inline config: **1** (`settings`).
- Inline consts flagged to move: **~16** (incl. 3 duplications K1–K3).
- Inline consts judged fine to keep: **~25**.
- Over-verbose constant comments: **6**.
- Decorative separators: **0**.
