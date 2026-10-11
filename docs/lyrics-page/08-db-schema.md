# Lyrics Page — Full DB Schema Proposal

Every table below is additive to `apps/backend`'s existing `Content` module schema (PostgreSQL,
EF Core). Naming, typing, and constraint conventions mirror the existing `LyricsEntity` /
`ArticleEntity` / `VideoEntity` / `ShortVideoEntity` tables exactly — `Aggregate<Guid>` base
(`Id uuid PK`, `CreatedAt`, `UpdatedAt`), `varchar` length caps via `ContentConstants`, FK
`Restrict` on delete for anything a public page still reads, `Cascade` only for a table's own
strictly-owned children (e.g. a translation's revisions).

## ACID posture — no explicit multi-statement transactions required

Every write below is a **single aggregate mutation** — one `INSERT`/`UPDATE` against one table (EF
Core's own `SaveChangesAsync` already wraps that single call in an implicit transaction at the
database level; Postgres does this for any single statement regardless). The design deliberately
avoids operations that need an *explicit* `BEGIN`/`COMMIT` spanning multiple statements:

- **Append-only history, never in-place rewrites.** Revisions (`LyricsRevisionEntity`,
  `LyricsTranslationRevisionEntity`), votes, and earnings are all `INSERT`-only tables — a
  correction doesn't `UPDATE` history, it adds a new row and the aggregate's *current* pointer
  field (e.g. `LyricsEntity.LyricsText` itself) is updated in the same single statement that
  inserts the accepted revision's audit row would otherwise need two statements for — handled
  instead by the use case doing: insert the revision row (already-terminal, its own commit), then
  a separate, idempotent-if-retried `UPDATE` of the parent's current text. If the second step fails
  after the first succeeds, the system is still consistent — the revision exists and is marked
  `Accepted` but not yet applied, which a retry-safe background reconciler (or a simple "apply
  accepted-but-unapplied revisions" query) can complete without any data corruption. This is a
  standard eventually-consistent pattern for exactly this reason: it avoids needing a distributed
  or even a local multi-table transaction for what is otherwise a two-step process.
- **Optimistic concurrency via a `RowVersion`/`xmin` check**, not locking. `LyricsEntity` (and any
  row multiple actors might race to update — vote tallies, counters) uses Postgres's native
  `xmin` system column as EF Core's concurrency token (`.IsRowVersion()` on `xmin`) — a concurrent
  double-update fails one writer with a `DbUpdateConcurrencyException` instead of silently losing
  one of the writes, with no explicit transaction needed.
- **Uniqueness and idempotency via constraints, not app logic.** Duplicate votes
  (`UNIQUE(RevisionId, UserId)`), duplicate slugs, duplicate earnings-period rows
  (`UNIQUE(ArtistId, PeriodStart, PeriodEnd)`) — the database rejects the invalid state directly;
  the application doesn't need a read-then-write transaction to check-then-insert.
- **Counters increment via a single atomic `UPDATE ... SET count = count + 1`**, exactly like the
  existing `ShortVideoEntity`/`LyricsEntity` view/like/share counters already do (spec 11) — never
  read-modify-write in application code.

The one place a real transaction *would* be justified — accepting a community submission, which
both marks the submission `Approved` and creates the new `LyricsEntity` row — still doesn't need
one: create the `LyricsEntity` first (if that fails, nothing changed, safe to retry), then mark the
submission `Approved` and store the new entity's id on it. A submission stuck `Approved`-but-not-
linked is a detectable, repairable inconsistency, not a corruption — the same "safe partial
failure" reasoning as the revision-apply step above. This keeps every write path in this feature at
"one statement per step, each step individually safe to retry," which is the existing codebase's
own pattern (no `IDbContextTransaction` usage anywhere in the current `Content` module).

---

## New/changed tables

### `Artists` (new)

| Column | Type | Notes |
| --- | --- | --- |
| `Id` | uuid PK | |
| `Name` | varchar(150) | required |
| `Slug` | varchar(220) unique | generated via the platform's normal `generateSlug(text, {unique:true})` convention, same as every other slugged entity |
| `Bio` | text nullable | |
| `AvatarFileId` | uuid FK → Files, nullable | same file-resolution pattern as `CoverImageFileId` |
| `UserId` | uuid FK → Users, nullable, unique | set once an artist account is verified; unique so one user owns at most one artist profile. Gates the verified-artist fast path by identity, never by comparing artist-name text (backend spec 08/11) |
| `VerifiedAt` | timestamptz nullable | non-null once `UserId` is set and the verification step (07 §1) completes |
| `CreatedAt`, `UpdatedAt` | timestamptz | |

`LyricsEntity.ArtistId` (new, nullable FK → `Artists`, `Restrict`) is added **alongside** the
existing free-text `ArtistName` column, not replacing it — most songs will reference an unclaimed
or not-yet-modeled artist for a long time, and `ArtistName` remains the fallback display value
when `ArtistId` is null. `VideoEntity` gains the same nullable `ArtistId` for consistency, out of
scope to backfill immediately.

### `Albums` (new)

| Column | Type | Notes |
| --- | --- | --- |
| `Id` | uuid PK | |
| `Name` | varchar(200) | required |
| `ArtistId` | uuid FK → Artists, nullable, `Restrict` | nullable because an album can exist before its artist is claimed |
| `CoverImageFileId` | uuid FK → Files, nullable | |
| `ReleaseYear` | smallint nullable | check constraint `>= 1900 AND <= extract(year from now()) + 1` |
| `Label` | varchar(100) nullable | |
| `CreatedAt`, `UpdatedAt` | timestamptz | |

`LyricsEntity.AlbumId` (new, nullable FK → `Albums`, `Restrict`) is added; the existing free-text
`Album` column from spec 10 (`10-backend-song-metadata-and-cover.md`) stays as the fallback display
value for songs not yet linked to a real `AlbumEntity`, same relationship as `ArtistName`/`ArtistId`
above.

### `StreamingLinks` (new)

| Column | Type | Notes |
| --- | --- | --- |
| `Id` | uuid PK | |
| `AlbumId` | uuid FK → Albums, `Cascade` | a link is strictly owned by its album |
| `Platform` | smallint (enum: Spotify=0, AppleMusic=1, YouTubeMusic=2, Tidal=3) | |
| `Url` | varchar(500) | |
| `CreatedAt`, `UpdatedAt` | timestamptz | |

`UNIQUE(AlbumId, Platform)` — one stored link per platform per album. Missing rows fall back to a
generated search URL client/server-side (06f), so this table is allowed to be sparse by design.

### `Tags` (new) / `LyricsTags` (new, join)

| `Tags` column | Type | Notes |
| --- | --- | --- |
| `Id` | uuid PK | |
| `Name` | varchar(60) unique | e.g. "Afrobeat", "Love Song", "Freestyle" |
| `Slug` | varchar(80) unique | |

`LyricsTags`: `(LyricsId FK → Lyrics Cascade, TagId FK → Tags Cascade)`, composite PK
`(LyricsId, TagId)` — a plain many-to-many join, no extra columns needed.

### `LyricsTranslations` (new)

| Column | Type | Notes |
| --- | --- | --- |
| `Id` | uuid PK | |
| `LyricsId` | uuid FK → Lyrics, `Cascade` | |
| `Language` | varchar(10) | ISO 639-1, same domain as `LyricsEntity.Language` |
| `Text` | text | the currently-published translation body |
| `Source` | smallint (enum: Ai=0, Community=1) | which origin produced the *current* published text |
| `Status` | smallint (enum: Published=0, Locked=1) | `Locked` reserved for disputed/abuse-flagged translations pending moderator attention |
| `CreatedAt`, `UpdatedAt` | timestamptz | |

`UNIQUE(LyricsId, Language)` — one published translation per song per language; corrections don't
create a second row, they create a `LyricsTranslationRevisionEntity` that, once accepted, updates
this row's `Text`/`Source`/`UpdatedAt` in place (the "current pointer," per the ACID note above —
history lives in the revision table, not here).

### `LyricsTranslationRevisions` (new)

| Column | Type | Notes |
| --- | --- | --- |
| `Id` | uuid PK | |
| `TranslationId` | uuid FK → LyricsTranslations, `Cascade` | |
| `ProposedText` | text | |
| `EditSummary` | varchar(300) nullable | |
| `ProposedByUserId` | uuid FK → Users, `Restrict` | |
| `Status` | smallint (enum: Pending=0, Accepted=1, Rejected=2) | |
| `DecidedByUserId` | uuid FK → Users, nullable, `Restrict` | set when a moderator directly decides, vs. threshold auto-accept |
| `CreatedAt`, `UpdatedAt` | timestamptz | |

### `LyricsTranslationVotes` (new)

| Column | Type | Notes |
| --- | --- | --- |
| `Id` | uuid PK | |
| `RevisionId` | uuid FK → LyricsTranslationRevisions, `Cascade` | |
| `UserId` | uuid FK → Users, `Restrict` | |
| `Vote` | smallint (enum: Approve=0, Reject=1) | |
| `Comment` | varchar(300) nullable | |
| `CreatedAt` | timestamptz | |

`UNIQUE(RevisionId, UserId)` — one vote per user per revision, enforced by the database (07 §1
anti-abuse note).

### `LyricsRevisions` (new) — canonical-text edit history

Same shape as `LyricsTranslationRevisions` but against the song's own `LyricsText` rather than a
translation:

| Column | Type | Notes |
| --- | --- | --- |
| `Id` | uuid PK | |
| `LyricsId` | uuid FK → Lyrics, `Cascade` | |
| `ProposedText` | text | |
| `EditSummary` | varchar(300) nullable | |
| `ProposedByUserId` | uuid FK → Users, `Restrict` | |
| `Status` | smallint (enum: Pending, Accepted, Rejected) | |
| `DecidedByUserId` | uuid FK → Users, nullable, `Restrict` | |
| `CreatedAt`, `UpdatedAt` | timestamptz | |

`LyricsRevisionVotes` mirrors `LyricsTranslationVotes` 1:1 (same columns, FK to this table
instead) — not duplicated in full here for brevity, same shape.

### `LyricsSubmissions` (new) — new-song community submissions

| Column | Type | Notes |
| --- | --- | --- |
| `Id` | uuid PK | |
| `SongTitle`, `ArtistName` | varchar | same caps as `LyricsEntity` |
| `LyricsText` | text | |
| `Language` | varchar(10) | |
| `SubmittedByUserId` | uuid FK → Users, `Restrict` | |
| `Status` | smallint (enum: Pending, Approved, Rejected, NeedsRevision) | |
| `ReviewedByUserId` | uuid FK → Users, nullable, `Restrict` | |
| `ReviewNote` | varchar(500) nullable | shown to the submitter on rejection/needs-revision |
| `PublishedLyricsId` | uuid FK → Lyrics, nullable, `Restrict` | set once `Approved` produces the real row (07 §1's "safe partial failure" case) |
| `CreatedAt`, `UpdatedAt` | timestamptz | |

### `LyricsInteractions` additions (spec 11, extended)

`LyricsViewEvents` (from spec 11) gains two columns for the read-time algorithm
([09-view-count-algorithm.md](09-view-count-algorithm.md)):

| Column | Type | Notes |
| --- | --- | --- |
| `DwellMs` | integer | client-reported foreground dwell time on the lyrics body |
| `ScrollDepthRatio` | real (0–1) | client-reported max scroll coverage of the lyrics text |

Both are **advisory inputs re-validated server-side** against `LyricsEntity.LyricsText`'s own word
count before a view is counted — see the algorithm doc. No schema change beyond these two columns;
the existing dedup-window / counter-increment mechanics (spec 11) are unchanged.

### Monetization — no new tables, extends the existing Commerce tables

Scoped to advertising (no schema — existing ad infrastructure), streaming-affiliate links (no
schema — a URL-parameter change in the streaming-link resolution, spec 09/12), and label/artist
promoted placement, which **reuses the existing Commerce tables already live for articles and
videos** — `Customers`, `ContentOrders`, `ContentOrderItems`, `ContentItemTiers`,
`ContentPayments`, `PromotionLevels`. Premium subscriptions and a per-artist revenue-share ledger
were both considered and dropped: both assume payment/payout infrastructure (recurring card
billing, cross-border creator payouts) this platform's actual markets don't reliably have.

The only lyrics-specific additions:

| Table | Change | Notes |
| --- | --- | --- |
| `ContentOrderItems.ContentKind` | gains a `Lyrics` enum value | Alongside existing `Article`/`Video`. Unlike those two, a `Lyrics` item never leads to content creation — it always targets an already-published `Lyrics` row |
| `Lyrics` | gains `CustomerId`, `OrderItemId` | Identical fields `Articles`/`Videos` already have. Set via a dedicated admin action *after* the song is already published — not at creation time, since the song predates the commerce transaction |
| `Categories` | one seeded row: "Promoted Lyrics Placement" | Commerce SKU only — lyrics still have no content-organizing category system (tags, spec 07, do that job); this row exists purely to hang a price on the promoted-placement product |

`Lyrics` also gains `IsPromoted`/`PromotedUntil` (mirroring `Articles`/`Videos` exactly), stamped
by the same `AdminVerifyPaymentFactory` handler that already stamps those two — one more lookup
branch added to its existing loop, no new handler. Full column-level detail for all of this lives
in the backend's own SQL reference:
[`../../../backend/docs/lyrics-page/LYRICS_FEATURE_SCHEMA.sql`](../../../backend/docs/lyrics-page/LYRICS_FEATURE_SCHEMA.sql).

---

## Indexes worth calling out explicitly

- `Lyrics(ArtistId)`, `Lyrics(AlbumId)` — both new FKs are queried directly (artist page's song
  list, "more from this album").
- `LyricsTags(TagId)` — reverse lookup for the tag-based similar-lyrics fallback (06d).
- `LyricsTranslationRevisions(TranslationId, Status)` — the review queue's primary query shape
  (`WHERE Status = Pending`).
- `Lyrics(ViewCount DESC)`, `Lyrics(LikeCount DESC)`, `Lyrics(ShareCount DESC)` — back the "Top
  Lyrics" tabs (06 §1b) directly; partial or plain btree indexes, whichever this codebase's
  existing counter-sort precedent (if any exists on `ShortVideoEntity`) already uses.
