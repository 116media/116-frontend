# Short Videos — Design & Implementation Docs

Design and implementation documentation for the web frontend's **short videos** feature
— the TikTok-style vertical clips ("Réels") surfaced on the homepage and played in a
full-screen, swipeable player. A short is a Cloudinary-hosted vertical (9:16) video clip
that a reader can watch, like, and share.

These docs mirror the structure of [`../content-interactions/`](../content-interactions/):
numbered design docs (the *why* and the *what*), a `specs/` folder of
implementation-ready, JSDoc'd, checklist-tracked specs (the *how*), and a set of locked
decisions with the open questions called out.

This is **documentation only** — no code is written into the codebase from these files.
The `specs/` snippets are the contract an implementer copies from once the go-ahead is
given.

---

## The feature at a glance

Short videos are **not yet modeled in the frontend**. The backend already ships the full
public contract (feed, by-slug, like/unlike, bookmark/unbookmark, share, record-view);
this feature builds the entire frontend surface on top of it.

1. **Homepage strip** — a simple horizontally-scrolling row of 9:16 thumbnail tiles,
   placed **between the promoted-articles section and the exclusive-show hero**. Not the
   shows carousel — a plain scroll-snap row ([04-homepage-strip.md](04-homepage-strip.md)).
2. **Full-screen player modal** — tapping a tile opens a transparent, closeable modal
   showing one short at a time; the reader **swipes up/down** (or uses **up/down arrow
   buttons**) to move between clips, one snap per short, TikTok-style
   ([05-modal-player.md](05-modal-player.md)).
3. **Instagram shortcuts** — **single tap** pauses/unpauses, **double tap** likes (with a
   heart-burst), on the video itself ([06-gestures-and-shortcuts.md](06-gestures-and-shortcuts.md)).
4. **Like & share** — a like toggle and a share action, each with a **live count** shown
   on the action rail, exactly like TikTok/Instagram ([07-interactions.md](07-interactions.md)).
5. **View counting** — an engagement-gated, deduplicated view event is recorded once a
   short has been watched long enough ([08-view-counting.md](08-view-counting.md)).

The look reuses the dashboard's shorts styling (9:16, rounded, dark scrim, the same
tokens); the TikTok interaction model (autoplay-on-active, tap-to-pause, action rail) is
net-new to both apps.

---

## What the backend supports (and does not)

The capability set is fixed by the backend contract (see [02-backend-contract.md](02-backend-contract.md)):

| Capability | Supported | Auth |
|---|---|---|
| Feed (paginated) · by-slug | Yes | Anonymous |
| Like / Unlike | Yes | Visitor (authenticated) |
| Bookmark / Unbookmark | Yes | Visitor (authenticated) |
| Share (with `shareChannel`) | Yes | Anonymous |
| Record view | Yes | Anonymous |
| **Comment** | **No** | — |

Two consequences drive the whole design:

- **Per-user flags in reads.** `ShortVideoDto` carries `isLiked` / `isBookmarked` for the
  authenticated caller (false when anonymous) alongside the counts, so the player seeds a
  pre-filled heart on load. A cursor **for-you feed** (`GET /shorts/feed`) backs the vertical
  player; the paged list backs the homepage strip.
- **File-based video, not YouTube.** `videoUrl` is a direct Cloudinary file URL. The shared
  `VideoPlayer` is Plyr-based and app-themed but currently YouTube-only; it is **extended**
  to also play direct file/remote URLs (like the dashboard's dual-source player) and reused
  for shorts — no separate native player ([05-modal-player.md](05-modal-player.md)).

---

## Where shorts surface

| Surface | What it shows |
|---|---|
| Homepage strip (`ShortsFeedSectionContainer`) | horizontal row of 9:16 tiles: thumbnail · title · view count |
| Player modal (`ShortsPlayer`) | one full-bleed short at a time · action rail (like + share counts) · up/down nav · close |

---

## Design docs

| File | What it covers |
|---|---|
| [01-overview.md](01-overview.md) | Goals, scope, the TikTok behaviours, decisions locked |
| [02-backend-contract.md](02-backend-contract.md) | Every public endpoint, DTO, generated client method, the capability matrix |
| [03-domain-and-module.md](03-domain-and-module.md) | The new `shorts` module: entities, mapper, repository, use cases, DI |
| [04-homepage-strip.md](04-homepage-strip.md) | Placement, the simple horizontal scroll row, the tile, opening the modal |
| [05-modal-player.md](05-modal-player.md) | The transparent full-screen modal, the shared Plyr player extended to files, the compound + context, styling reuse |
| [06-gestures-and-shortcuts.md](06-gestures-and-shortcuts.md) | Swipe up/down, up/down arrows, tap-to-pause, double-tap-like, keyboard |
| [07-interactions.md](07-interactions.md) | Like toggle + share, the counts, the action rail, auth-gating |
| [08-view-counting.md](08-view-counting.md) | The engagement gate, the device-id header, dedup, when the event fires |
| [09-i18n-and-notifications.md](09-i18n-and-notifications.md) | Short strings + notification configs (en/fr) |
| [10-open-questions.md](10-open-questions.md) | Decisions locked, backend gaps, assumptions to confirm |

---

## Specs

Implementation-ready, in [specs/](specs/) — start at [specs/00-index.md](specs/00-index.md).

---

## Reference material

The backend contract lives in `apps/backend`
(`Content/Application/Editorial` for reads, `Content/Application/Interactions` for
like/bookmark/share/view). The **dashboard** (`apps/dashboard/src/modules/shorts` and
`shared/presentation/ui/VideoPreview`) is the reference for the visual style — the 9:16
portrait stage, the dark scrim, the brand tokens — reused here. The **videos** module
(`apps/frontend/src/modules/videos`) is the structural template the new `shorts` module
mirrors (entities, mappers, repository/use cases, hooks, i18n, notifications).
</content>
</invoke>
