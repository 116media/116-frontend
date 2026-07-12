# Short Videos — Implementation Specs

Implementation-ready specs for the frontend **short videos** feature. Each spec contains
**full, JSDoc'd code snippets** and a **task checklist** whose boxes are ticked `- [x]` only
**after** the work is implemented and verified (`tsc` + biome clean, behavior confirmed).

Read the design docs first ([../README.md](../README.md)) for the *why*; these specs are the
*how*. Decisions are locked in [../10-open-questions.md](../10-open-questions.md).

**Everything here is new work** — shorts are not yet modeled in the frontend. Unlike the
content-interactions specs (which documented shipped code), every spec below is a build.

> **Backend contract update (shipped since these specs were drafted).** The backend now
> returns per-viewer `isLiked` / `isBookmarked` on every shorts read, and adds a cursor
> **for-you feed** `GET /api/v1/public/shorts/feed` (seeded, stable pagination via
> `nextCursor`). When implementing: seed `IShortVideoEntity` + the like hook from `isLiked`
> (not `false`), add `isBookmarked` to the entity/mapper, and back the vertical player with a
> cursor `useShortsFeed` over `getShortsFeed` (keep the paged list for the homepage strip).
> Regenerate `116.api.ts` first. See [../02-backend-contract.md](../02-backend-contract.md).

---

## Specs

| File | What it covers |
|---|---|
| [01-domain-and-mappers.md](01-domain-and-mappers.md) | `IShortVideoEntity`, `IShortVideoPage`, `ShortsMapper` |
| [02-repository-and-usecases.md](02-repository-and-usecases.md) | Port, impl, use cases, DI + cradle |
| [03-hooks-and-keys.md](03-hooks-and-keys.md) | `shortKeys`, `useShortsFeed`, interaction hooks |
| [04-homepage-strip.md](04-homepage-strip.md) | Placement, `ShortsFeedSectionContainer`, `ShortsStrip`, `ShortCard` |
| [05-modal-player.md](05-modal-player.md) | Shell, `ShortVideoPlayer`, `ShortsPlayerProvider`, the compound slots |
| [06-gestures-and-shortcuts.md](06-gestures-and-shortcuts.md) | Swipe/arrow/keyboard nav, tap-to-pause, double-tap-like |
| [07-interactions-like-share.md](07-interactions-like-share.md) | Action rail, like toggle, share, deferred bookmark |
| [08-view-counting.md](08-view-counting.md) | The engagement gate + record-view hook |
| [09-i18n-and-notifications.md](09-i18n-and-notifications.md) | `shorts.` strings + share notification config |

---

## Implementation order

1. **Domain & mappers** (01) — entities + `ShortsMapper`.
2. **Repository & use cases** (02) — port, impl, use cases, DI, cradle.
3. **Hooks & keys** (03) — `shortKeys`, `useShortsFeed`, `useToggleShortLike`,
   `useShareShort`, `useRecordShortView`.
4. **Homepage strip** (04) — container + strip + card, wired into `page.tsx`.
5. **Modal player** (05) — extend the shared `VideoPlayer` to remote-file sources, then
   provider, shell, `ShortVideoPlayer` wrapper, compound slots.
6. **Gestures** (06) — swipe/arrow/keyboard nav, tap/double-tap on top of the player.
7. **Interactions** (07) — action rail wired to the hooks.
8. **View counting** (08) — engagement gate.
9. **i18n + notifications** (09) — strings + share toast.
10. **Icons** — add `ChevronUp`, `ChevronDown`, `ShareIcon` (and `BookmarkIcon` for the
    deferred item) to the `Icon` barrel if not already present.

Each step is independently verifiable (`tsc` + biome). Steps 1–3 have no UI and can land
first behind the feature.

---

## Conventions for all snippets

- **JSDoc only — no inline comments.** Block `/** … */` above every export (multi-line,
  `@param` / `@returns` / `@property`, neutral team-to-team voice). No `//` narration, no
  per-field notes, no decorative separators. Any `//` / `＋ new` marker in these snippets is
  scaffolding for the reader and must not appear in the output.
- **Component folder rules** (`AGENTS.md`): one component per folder, kind buckets, dotted
  compound parts, flat state files, `@/` imports, `export interface XxxProps` inline.
- **`Result<T>`** out of every repository/use case; `ProblemMapper.toFailure` in catches;
  `runInteraction` bridges `Result<boolean>` to the throw-based mutation.
- **Mappers own list mapping** (`shortListFromDto`, `shortPageFromDto`); call sites never
  `.map(Mapper.x)`.
- **Optimistic toggles via `useToggle`** — like never toasts; it flips and rolls back.
- **Auth-gate every write except share/view** — through `useRequireAuth`.
- **Theme tokens** in `className` — never hardcoded colors; active like `fill-destructive`.
- **Notification copy** lives in `shorts.share.notification.ts`, never at the call site.
- **Icons from the barrel** (`@/shared/presentation/components/ui/Icon`); brand share icons
  from `@icons-pack/react-simple-icons` via the existing `SocialShareGroup`.
- **Next 16 is customized** — read `node_modules/next/dist/docs/` before touching the
  homepage RSC, `next/image`, or any route handler.

---

## Global progress

- [ ] 01 — Domain & mappers
- [ ] 02 — Repository & use cases
- [ ] 03 — Hooks & keys
- [ ] 04 — Homepage strip
- [ ] 05 — Modal player
- [ ] 06 — Gestures & shortcuts
- [ ] 07 — Interactions (like + share)
- [ ] 08 — View counting
- [ ] 09 — i18n & notifications

Mark a box `- [x]` only when that spec's own task list is fully verified.
</content>
