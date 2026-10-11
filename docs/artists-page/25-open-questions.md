# 25 — Open Questions

Genuinely unresolved product decisions, each deferred deliberately by an earlier doc. This is the
record of what it would cost to change the current answer, so the decision is evidence-driven rather
than re-litigated from scratch.

Each entry: the question, the options, the cost, a recommendation. Recommendations are not
decisions; a product owner still has to say yes.

**Two tiers.** Q1–Q5 are *deferrals*: each already has a documented v1 answer ("don't ship it"),
and none blocks anything. Q8 is a *gate*: it does not block v1, but it blocks the phase that would
ship the identity block ([24](24-implementation-plan.md)). Shipping that block without answering it
is the failure mode, not the shortcut.

| # | Question | Type | Blocks |
|---|---|---|---|
| Q1 | Artists in global search | deferral | — |
| Q2 | Album detail pages | deferral | — |
| Q3 | "Claim this profile" CTA | deferral | — |
| Q4 | Does `availableLetters` ship in v1? | deferral | — |
| Q5 | Load-more vs. infinite scroll | deferral | — |
| Q8 | Editorial sourcing for identity fields | **gate** | Phase 4 (Gap 7) |

> **Q6, Q7 and Q9 were removed, not answered.** They covered merch sellers and affiliate
> disclosure, tour-date sourcing and freshness, and the source of truth for `Primary` credits.
> All three surfaces were cut from v1 ([01](01-overview.md)), so the questions are moot — if any
> surface ever returns, its question returns with it and must be answered before it ships.

---

## Q1 — Artists in global search

Marked deferred in [03](03-information-architecture.md)'s entry-point table.

**Question:** should the header search return artist results alongside lyrics/videos/articles?

| Option | Cost |
|---|---|
| **A.** Add artists as a result type | A new result shape in the global search response and a new result-card variant. The underlying name search already exists once Gap 1 ships — the search *capability* is nearly free; the presentation is not. |
| **B.** Rely on the scoped search on `/artistes` *(v1)* | Zero. |

Worth noting the sequencing: A is cheap **after** Gap 1, and impossible before it. Deferring costs
nothing.

**Recommendation: B for v1, revisit immediately after Phase 3.** This is the highest
value-per-effort item on this page once the index exists — a reader typing an artist name into the
header search today gets songs but never the artist.

---

## Q2 — Album detail pages

[08](08-catalog-sections.md) locks album cards as **not links** in v1, precisely because there is
nowhere to link to.

**Question:** should albums get their own route?

| Option | Cost |
|---|---|
| **A.** `/albums/{slug}` with tracklist | Album slugs, a public endpoint, a new route + module surface, plus Gap 3 (the artist-scoped album **query**) as a prerequisite. `LyricsEntity.AlbumId` already gives a tracklist, which makes the page more than a stub. |
| **B.** Cards link to a filtered view of the artist's lyrics | Cheap, but a filtered list is not an album page and the URL would lie about what it is. |
| **C.** Static tiles *(v1)* | Zero. |

> **Corrected.** An earlier version of this entry described Gap 3 as an
> `AlbumEntity.ArtistId` **migration and backfill**. That was wrong — the column already exists
> ([15](15-backend-current-state.md)); only the query path is missing, so Gap 3 is a repository
> method plus an endpoint ([16](16-backend-gaps-and-contracts.md) Gap 3). The same entry also said
> the albums section was optional and recommended for dropping. It is not: albums and mixtapes are
> in scope ([01](01-overview.md)) and are Phase 2 ([24](24-implementation-plan.md)) precisely
> *because* the gap turned out to be cheap.

**Recommendation: C.** Static tiles remain right for v1 — not because albums are marginal, but
because a detail page is a separate route with its own module surface and the section works without
one. Revisit once album coverage is populated on most profiles; the prerequisite (Gap 3) will
already have shipped in Phase 2.

---

## Q3 — "Claim this profile" CTA

Raised and deliberately left open in [22](22-verified-artists-and-claiming.md).

**Question:** should the profile expose a CTA to `POST /api/v1/artists/{id}/claim`?

| Option | Cost |
|---|---|
| **A.** Direct CTA calling the endpoint | Requires exposing the artist **id** to the client, which [14](14-data-requirements.md) deliberately avoids. Plus: no admin review queue exists, so the claim lands nowhere visible; no rate limiting, so false claims are free; no post-submit state, so the user gets a toast and nothing else. |
| **B.** Link to a contact form, signed-in users only, unverified profiles only | No id exposure, no silent void, a human already reads that inbox. Low effort, low risk. |
| **C.** No CTA *(v1)* | Zero. Claims arrive through existing out-of-band channels. |

**Recommendation: C for v1, B when asked.** A should not ship until the dashboard has a claim-review
queue — otherwise the button's only effect is generating work nobody sees. Note the audience is one
person per profile, at most once, on a hero that is deliberately minimal
([06](06-artist-detail-hero.md)).

---

## Q4 — Does `availableLetters` ship in v1?

Gap 1b 🟠 in [16](16-backend-gaps-and-contracts.md), explicitly marked degradable.

**Question:** does the alphabet rail disable empty letters at launch, or enable all 27?

| Option | Cost |
|---|---|
| **A.** Ship it with Gap 1 | One `SELECT DISTINCT` over the already-filtered set, ≤27 values, highly cacheable. Small — but it shares the published-content join, so a careless implementation doubles the index query's work ([21](21-performance-and-pagination.md)). |
| **B.** Ship the rail with all letters enabled | Zero. A user clicking `Q` gets the filtered-empty state, which already has correct copy and an escape action ([09](09-loading-empty-error.md)). |

The frontend handles both: `availableLetters` is `string[] | null` and `null` means "enable
everything" ([18](18-domain-entities-and-mappers.md)). No frontend change is needed to switch.

**Recommendation: A if it lands without delaying Gap 1; B otherwise.** This must never be the reason
the index page slips. The degradation is genuinely acceptable — a dead letter is a mild annoyance,
a missing directory is a missing feature.

---

## Q5 — Load-more vs. the repo's existing infinite scroll

Not a deferred decision so much as an inconsistency worth someone's explicit blessing.

[04](04-artists-index-page.md) locks a "load more" button, for good accessibility and footer
reasons. But `/articles` and `/videos` already auto-fetch via an `IntersectionObserver` sentinel.
Shipping this feature as designed means the site has two paging interactions.

| Option | Cost |
|---|---|
| **A.** Load-more here, sentinel elsewhere *(as designed)* | Zero build cost; a small consistency debt. |
| **B.** Load-more everywhere | Retrofit two existing feeds. Contradicts nothing, but it is out of this feature's scope. |
| **C.** Sentinel here | Contradicts a locked decision in [04](04-artists-index-page.md). |

**Recommendation: A**, and log B as a separate consistency task. Raising it here so the divergence
is a known choice rather than something discovered in review — the reasoning in
[02](02-inspiration-benchmark.md) is sound and should probably win site-wide eventually.

---

> **Q8 is the one gate here.** Unlike Q1–Q5 it is **not** "don't ship it, revisit later" — it must
> be answered *before* the identity block ships, not after ([24](24-implementation-plan.md)).
> Q1–Q5 keep their numbers, and the removed Q6, Q7 and Q9 keep their gaps in the sequence rather
> than being renumbered.

## Q8 — Editorial sourcing for identity fields

Opened by Gap 7 ([16](16-backend-gaps-and-contracts.md)) and flagged, not solved, in
[06](06-artist-detail-hero.md) and [22](22-verified-artists-and-claiming.md).

Real name, aliases, birthdate and hometown are **factual claims about living people**, published on
profiles those people have mostly not claimed, and fed to search engines through `MusicGroup`
JSON-LD ([13](13-seo-and-metadata.md)). The schema is trivial; the policy is not.

**Question:** where do these values come from, who checks them, and how does a subject get one fixed?

| Option | Cost |
|---|---|
| **A.** Staff fill fields from public sources at their discretion, no record of the source | Zero process cost, maximum exposure. A wrong birthdate is our assertion, with nothing behind it and no way to reconstruct where it came from. |
| **B.** Staff fill fields, plus an **internal, non-public** source note per field | One admin text column, never serialised to the public DTO. Makes a correction request answerable in minutes instead of guessable. Cheap and proportionate. |
| **C.** Public attribution on the page ("source: …") | Rejected on sight — it puts editorial plumbing in a reader-facing identity block and invites argument in the UI. We either stand behind a value or we do not publish it ([22](22-verified-artists-and-claiming.md)). |
| **D.** Ship the block with `RealName` and `Hometown` only, defer `Birthdate` | Birthdate is the highest-risk of the four (it is the one people are wrong about, and the one most often deliberately private). Deferring it costs a row in the block. |

Paired with this, and non-optional: **a correction path for verified artists**
([22](22-verified-artists-and-claiming.md)). The recommended shape there is a contact route
reviewed by staff, surfaced to verified artists on their own profile — not a public "report an
error" affordance and not a self-service editor.

**Recommendation: B, plus the correction path, plus D if the block is otherwise ready to ship.**
Note the asymmetry that makes deferral easy: a `null` field renders nothing and costs nothing
([06](06-artist-detail-hero.md)) — **an empty identity block is free; a wrong one is a
correspondence.** This is the one item in this feature where shipping late is strictly safer than
shipping fast.

---

## Not open

Recorded so they are not reopened as "questions":

| Settled | Where |
|---|---|
| Route stays `/artistes`, not `/artists` | [01](01-overview.md), locked |
| Slug-addressed, not id-addressed | [01](01-overview.md), locked |
| Profile ships before the index | [01](01-overview.md), locked |
| Zero-content artists 404 and are unlisted — where "content" means **any of the five surfaces**, so an album-only artist renders | [01](01-overview.md), locked (**corrected** from "lyrics or videos") |
| Tabs are URL-addressable | [01](01-overview.md), locked |
| **Three** tabs, with albums and mixtapes as sections inside `Musique`, not tabs | [07](07-artist-detail-tabs.md) |
| The **index** is alphabetical, never ranked — this is about the directory, not the profile | [01](01-overview.md), locked |
| Claiming grants a badge, not profile editing | [01](01-overview.md), locked |
| A verified badge never influences ranking or ordering anywhere | [22](22-verified-artists-and-claiming.md) |
| Albums derived via `artist → lyrics → album` | Rejected, [16](16-backend-gaps-and-contracts.md) — `AlbumEntity.ArtistId` exists, so the derivation was never needed |
| Ranking popular songs by `ViewCount` alone, not a composite | [08](08-catalog-sections.md) |
| No merch, no tour dates, no commerce of any kind on this page | [01](01-overview.md), locked |
| No featured/guest-credit surface; the profile shows an artist's own catalog only | [01](01-overview.md) |
| Shorts on artist profiles | Excluded — shorts have no `ArtistId` ([03](03-information-architecture.md)) |

> **Removed from this table:** *"'Top songs' framing — rejected, we sort by date."* That entry is
> **no longer true and has been corrected.** `LyricsEntity` carries `ViewCount` and
> `GET /public/lyrics` already supports `sort=views`, so `Chansons populaires` is an honest label
> backed by real data ([08](08-catalog-sections.md), [07](07-artist-detail-tabs.md)). The rule that
> survives is stricter and still binding: **a section's label must match its actual sort key.**
