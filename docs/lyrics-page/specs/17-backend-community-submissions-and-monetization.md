# Spec 17 — Backend: Community Submissions, Corrections & Monetization

Design: [../07-community-and-monetization.md](../07-community-and-monetization.md).

**The authoritative, implementation-ready version of this spec now lives in the backend's own docs
folder** — [`apps/backend/docs/lyrics-page/specs/11-community-submissions-and-corrections.md`](../../../../backend/docs/lyrics-page/specs/11-community-submissions-and-corrections.md)
and [`specs/12-monetization-and-promoted-placement.md`](../../../../backend/docs/lyrics-page/specs/12-monetization-and-promoted-placement.md).
This file is kept short and deliberately non-duplicative from here on — restating the full C# code
in two places is exactly how this doc set drifted out of sync before (a name-matching bug in the
verified-artist fast path, an `OwnerUserId`/`UserId` rename, and a monetization scope cut all had to
be fixed here *and* there). Read the backend specs for the real entities/handlers/endpoints; this
page only summarizes what changed and why, for readers who started on the frontend side.

## Community submissions & corrections — summary

Three paths land in the same `LyricsEntity` table, per 07 §1: admin CRUD, verified-artist upload,
and community submission/correction. The verified-artist fast path is gated by
**`ArtistEntity.UserId`** — an identity check (does the submitting user own a claimed artist
profile?), never by comparing the submitted artist-name text (backend spec 08/11 explain why that
was rejected: names change, get misspelled, and can collide between unrelated people). Corrections
apply to **any published song**, regardless of who created it — admin-entered content is trusted at
creation time, not exempt from later community/artist correction proposals.

## Monetization — summary

Scoped to three streams (07 §2): advertising (no backend work), streaming-affiliate links (a
URL-parameter change in spec 09's link resolution, not a new endpoint), and label/artist promoted
placement — which **reuses the existing Commerce module** already live for articles and videos
(`ContentOrderEntity`/`ContentOrderItemEntity`/`ContentPaymentEntity`/`PromotionLevelEntity`),
extended with one new content kind and two new columns on `LyricsEntity`. **Premium subscriptions
and a per-artist revenue-share ledger were dropped from scope** — both assume payment/payout
infrastructure this platform's actual markets don't reliably have.

Streaming-affiliate links are the one piece of this whole feature still deliberately incomplete:
`StreamingLinkResolver.GenerateSearchUrl` builds every platform's URL today, but appends no
affiliate/referral query param — per spec 12 §2, that's gated on a legal/business step (confirming
each platform's affiliate program is active in this platform's markets), not on anything left to
build. Once that's confirmed, adding the param is a few lines in that one method.

## Task checklist

Tracked in the backend docs' own checklists (specs/11, specs/12) — not duplicated here to avoid a
second copy going stale. Confirm both are checked off there before considering this feature's
community/monetization scope complete. The one open item on either checklist is the
streaming-affiliate param above — everything else is done and verified.
