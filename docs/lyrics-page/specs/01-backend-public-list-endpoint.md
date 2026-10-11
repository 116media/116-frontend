# Spec 01 — Backend: Slug, Category & Public List Endpoint

**The authoritative, implementation-ready version of this spec now lives in the backend's own docs
folder** — [`apps/backend/docs/lyrics-page/specs/01-slug-and-public-list-endpoint.md`](../../../../backend/docs/lyrics-page/specs/01-slug-and-public-list-endpoint.md).
This file is kept as a short pointer from here on, not a second copy of the C# code — an earlier
draft here used `CreateForVideo`/`CreateStandalone` as the two factory names and gave `LyricsEntity`
no category concept at all; both were corrected on the backend side (replaced with
`CreateFree`/`CreatePaid`, and a required `CategoryId` added, matching `ArticleEntity`/`VideoEntity`
exactly — see the backend spec's §0). Read the backend spec for the real entity code, endpoints,
and task checklist.

## Summary

- `LyricsEntity` gains a required `CategoryId`, plus nullable `CustomerId`/`OrderItemId` — full
  parity with `ArticleEntity`/`VideoEntity`. Any number of lyrics categories can exist, each
  independently free or paid via the existing `CategoryEntity.IsFree`; whether a song has a
  claimed `ArtistId` (backend spec 08) is an unrelated, independent concern from whether it's free
  or paid.
- `LyricsEntity` also gains a stored, unique `Slug` column (Genius-style —
  `{artist}-{title}-lyrics`, e.g. `fally-ipupa-mayday-lyrics`) and the same
  `Draft → PendingPayment/PendingReview → Approved → Published`/`Rejected`/`Archived` editorial
  workflow articles and videos already have — replacing the misleading, un-slugified two-segment
  `/lyrics/{songTitle}/{artistName}` route.
- A new public list endpoint (`GET /api/v1/public/lyrics`) with search, language filter, and sort
  — there was previously no way to *browse* lyrics publicly, only look one up by exact key.

## Task checklist

Tracked in the backend spec's own checklist — not duplicated here.
