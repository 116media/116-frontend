# Lyrics Page — Community Contributions & Monetization

Two remaining pieces of the Musixmatch-scale expansion: **who is allowed to add lyrics content**
(artists directly, or the community via a moderated queue) and **how this feature makes money**.
Neither changes the read-side design in docs 01–06; both add new write paths and new entities.

---

## 1. Who can add content, and how

Three distinct submission paths, all landing in the same published `LyricsEntity` table but with
different trust levels and review requirements:

| Path | Who | Review needed | Result |
| --- | --- | --- | --- |
| **Admin/staff CRUD** | Internal team (existing) | None — already trusted | `Draft` → the same editorial `submit`/`approve`/`publish` workflow every other content type has (backend spec 01) |
| **Verified artist upload** | A user linked to a claimed `ArtistEntity` they own | None for their own songs | `Draft` → same editorial workflow, attributed to that artist |
| **Community submission** | Any signed-in user | Moderation queue | Published only after approval |
| **Community correction** | Any signed-in user, on **any** published song | Peer review + threshold, or moderator override | Merges into the canonical text on acceptance |

**Corrections apply to every published song, not just community-originated ones.** The first three
rows are about who gets to *create* a lyrics record and how much review that creation requires —
admins skip review because staff are already trusted to enter content correctly. That trust does
not carry over into "so nobody can flag a typo in it afterward." A community member or verified
artist who spots a mistake in an admin-transcribed song proposes a correction exactly the same way
they would for a community-submitted one — the backend's `ProposeLyricsRevisionCommand` (backend
spec 11) takes only the song's id, with no check on who originally created it.

This is the same shape already established for translations (06, section b) — a
propose-then-review pipeline — reused for lyrics content itself, not a separate invention:

- **New submissions** (`LyricsSubmissionEntity`): a full new song a community member believes is
  missing. Sits in `Pending` until a moderator approves (→ creates the real `LyricsEntity`, crediting
  the submitter) or rejects (with a reason, so the submitter isn't left guessing). Mirrors the
  existing admin-CRUD trust boundary — nothing público until a human with authority signs off,
  same principle as this codebase's existing publish/draft workflows on articles/videos. Lyrics now
  has that same draft/publish workflow too (backend spec 01 — an earlier draft of this doc assumed
  lyrics had no status field at all; that's been corrected), so an approved submission lands in
  `Draft` and goes through the normal cycle rather than a bespoke "submissions are pre-publication"
  status.
- **Corrections to existing songs** (`LyricsRevisionEntity`, backend spec 11): same
  propose → vote/threshold → merge model as translation revisions (06b), applied to the canonical
  `LyricsText` instead of a translation. A revision that reaches the approval threshold (or is
  moderator-approved) updates `LyricsEntity.LyricsText` directly and is recorded in a
  `LyricsRevisionEntity` history table — so the canonical text always has a real edit history, the
  same way the translations do.
- **Verified artist uploads**: an `ArtistEntity` gains a `UserId` (nullable — most artist
  rows are unclaimed profiles created from a song credit, not accounts) once that artist verifies
  ownership (out-of-band process: email domain match, label-provided list, or manual staff
  verification — deliberately not spec'd as an automated flow here, since it's a business/trust
  process, not a technical one). Once `UserId` is set, that user's lyrics submissions are attributed
  to that profile directly and skip the queue — gated by that exact user id, never by comparing the
  submitted artist-name text (see the backend's spec 08/11 for why name-matching was rejected).

Full schema: [08-db-schema.md](08-db-schema.md). Backend spec:
[specs/16-backend-community-submissions-and-monetization.md](specs/16-backend-community-submissions-and-monetization.md).

### Anti-abuse baseline

- Rate limits on submission/revision-proposal endpoints (reuse `RateLimitPolicies`, a new
  `ContentContribution` tier — stricter than `ContentBrowsing` since this is a write path).
  New voting endpoint (see below) rejects repeat votes from the same user on the same
  entity/revision with a unique constraint (`(RevisionId, UserId)`), not app-level dedup logic.
- A minimum-account-age or minimum-reputation gate on voting (not on submitting) is recommended so
  a single sock-puppet cluster can't force a threshold — exact numbers are a product decision, not
  specced here.

---

## 2. Business model

Scoped to three revenue streams, deliberately narrower than Musixmatch's own public model.
**Premium subscriptions, a per-artist revenue-share program, and data/API licensing are explicitly
out of scope** — all three assume payment/payout infrastructure (recurring card billing,
cross-border creator payouts) that isn't reliably available across this platform's actual markets
in Africa. Building that data model now would be speculative; if the underlying infrastructure
changes later, that's a new proposal, not a revival of this section.

### Revenue streams

1. **Advertising** — the existing ad-serving infrastructure (already used on videos/articles)
   extends to `/lyrics` and `/lyrics/{slug}` — standard display placements, nothing new to design
   here beyond making sure ad slots are reserved in the page layout (06). No backend work at all.
2. **Streaming affiliate revenue** — the "Go to album" modal's platform links (06f) go out as
   affiliate/referral links where each platform's affiliate program allows it (Spotify, Apple
   Music, Tidal all have or have had affiliate programs; verify current terms *and* regional
   availability before enabling — this is a legal/business step, not a technical one). Low
   per-click value, high volume, zero marginal cost once the modal exists for another reason — a
   URL-parameter change at the point those links are already generated (backend spec 09/12), not a
   new endpoint.
3. **Label & artist licensing / promoted placement** — **this already exists for articles and
   videos today** (`CustomerEntity` → `ContentOrderEntity` → `ContentOrderItemEntity` →
   `ContentPaymentEntity` → `PromotionLevelEntity`, stamped by `AdminVerifyPaymentFactory`). Nothing
   new is invented for lyrics — the exact same commerce pipeline is extended to reach a third
   content kind. See below for how.

### How promoted placement extends to lyrics — reusing the existing Commerce pipeline

Labels/artists can already pay for a promoted homepage slot on an article or video: an order is
created, an order item selects a `PromotionLevelEntity` (duration + price), payment is verified,
and `AdminVerifyPaymentFactory` stamps `IsPromoted`/`PromotedUntil` on the linked content. For
lyrics, the same pipeline is extended with one structural difference: an article/video order item
is created *before* the content exists (the admin creates the article/video afterward, referencing
the order item); a lyrics promotion targets a song that's **already published** — there's nothing
to create. So instead of "create content referencing this order item," the flow is "link this
*existing, already-published* song to a freshly created order item," then payment verification
proceeds exactly as it already does today for articles and videos — same entity, same handler, one
more content kind it checks.

Concretely (full detail in backend spec 12):

- The backend's content-kind enum gains a `Lyrics` value, alongside the existing `Article`/`Video`.
- One admin-seeded category ("Promoted Lyrics Placement") exists purely to hang a price on this
  product — lyrics still have no content-organizing category system otherwise (tags, spec 07, do
  that job); this category is a commerce SKU, not an editorial concept.
- `LyricsEntity` gains `CustomerId`/`OrderItemId`/`IsPromoted`/`PromotedUntil` — the identical
  fields `ArticleEntity`/`VideoEntity` already have, populated the identical way.
- The "Top Lyrics" ranking (06 §1b) never reorders around a promoted entry — `IsPromoted` is
  excluded from that sort by construction (backend spec 13's explicit guard), a promoted song
  always renders in its own clearly-labeled slot instead.

No pricing table is proposed here — promoted placement pricing should mirror whatever the existing
article/video promotion pricing already is (same `PromotionLevelEntity` rows, same
`ContentOrderItemEntity.PromoPriceSnapshotUsd` mechanism), not a new, separate price list invented
for lyrics specifically.
