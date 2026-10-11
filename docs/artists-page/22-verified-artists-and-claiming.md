# 22 — Verified Artists & Claiming

## What already exists

Claiming is **not new work**. The backend shipped it before any of this
([15](15-backend-current-state.md)):

| Endpoint | Effect |
|---|---|
| `POST /api/v1/artists/{id}/claim` | Records a claim *request*. Grants nothing. |
| `POST /api/v1/admin/artists/{id}/verify-owner` | Admin confirms the claim; sets `UserId` and `VerifiedAt`. |

`ArtistEntity` carries `UserId` (nullable) and `VerifiedAt` (nullable). There is **no `IsVerified`
column** — verification is the conjunction of the two being non-null.

So the flow is: *artist requests → admin reviews out-of-band → admin grants*. There is no
self-service verification and no automated identity check, which is the correct posture for a
badge that asserts identity.

## What the badge means

> **This profile has been claimed by the artist (or their representative) and a 116 admin has
> confirmed it.**

It means exactly that. It does **not** mean popular, endorsed, featured, official partner, or
higher quality.

> **Corrected.** An earlier version of this doc justified that by saying *"nothing in the product
> ranks"*. That is no longer true: `Chansons populaires` ranks an artist's songs by `ViewCount`
> ([08](08-catalog-sections.md)), and the tab-resolution order ranks *sections*
> ([07](07-artist-detail-tabs.md)). The rule the badge actually needs is narrower and stronger.

**The separation, stated precisely:** verification is an **identity** fact, never an **ordering**
input. `isVerified` must not appear — directly, as a tie-break, or as a weight — in:

| Surface | What orders it instead |
|---|---|
| The index listing | `Name` ascending, always ([04](04-artists-index-page.md)) |
| The alphabet rail and its `availableLetters` | The folded initial ([05](05-alphabet-search-and-filters.md)) |
| Index search results | Name match only, no boost |
| `Chansons populaires` | `ViewCount` descending, `PublishedAt` tie-break ([08](08-catalog-sections.md)) |
| Every other catalog section | `PublishedAt` / `ReleaseYear` / `SortOrder` / `EventDate` |
| Tab order and default-tab resolution | The fixed `music → videos → news` order ([07](07-artist-detail-tabs.md)) |
| The sitemap | Every listed profile, unweighted ([13](13-seo-and-metadata.md)) |

Two verified artists and two unverified ones with identical data must render in identical order.
The badge changes what is *drawn next to a name*; it changes nothing about *which names appear or
in what sequence*. So: ranking exists on this page — it is honest, it is `ViewCount`, and it is
about songs. It is never about badges.

Verified-only filtering or sorting on the index is refused for the same reason, and is listed under
**Not in scope** below.

This is why the badge is not decorative. It needs:

- An accessible label — *"Artiste vérifié"* / *"Verified artist"* — not a bare icon.
- A tooltip stating the meaning above, in one sentence. A badge whose meaning is guessable-only is
  noise ([06](06-artist-detail-hero.md)).

## Where it renders

Two places, both already specified:

| Surface | Placement | Source |
|---|---|---|
| Index card | inline, immediately after the name | [04](04-artists-index-page.md) |
| Profile hero | inline, immediately after the `<h1>` | [06](06-artist-detail-hero.md) |

**Never overlaid on the avatar.** On the card it would collide with a face at 2-column mobile
sizes; on the hero it would sit on the LCP image. Inline-after-the-name is one rule for both
surfaces and one component.

On the card the name truncates to one line, so the badge must be laid out as a non-shrinking
sibling of the truncating name — not inside it. A badge that truncates away on long names is worse
than no badge, because it is inconsistent rather than absent.

The badge appears nowhere else. It is not on lyrics cards, video cards, or the lyrics detail page's
artist link — those surfaces belong to other modules and adding it there means threading
verification through their DTOs for a decoration.

## The data path

`isVerified` is a **backend-derived boolean**, Gap 2 in [16](16-backend-gaps-and-contracts.md):

```
isVerified = UserId is not null && VerifiedAt is not null
```

Two rules follow, and neither is negotiable:

1. **`UserId` is never exposed to the client.** Who claimed a profile is not public information
   ([14](14-data-requirements.md)). The frontend receives only the derived flag.
2. **The frontend never derives it.** `IArtistSummaryEntity.isVerified` and
   `IArtistDetailEntity.isVerified` are read straight from the DTO
   ([18](18-domain-entities-and-mappers.md)).

### Degradation before Gap 2 ships

Gap 2 is 🟠, not 🔴 — DTO plus mapper, and the pages are complete without it. Until it lands the
mapper coalesces `isVerified` to `false` and **no badge renders anywhere**. That is the intended
Phase 1 state ([24](24-implementation-plan.md)): a profile page with no badges is complete and
honest; a profile page with a badge the backend cannot substantiate is not.

Do not fake it from any other signal. There is no other signal.

## Claiming grants a badge, not a CMS

Locked in [01](01-overview.md), out of scope: **artist-submitted profile editing**.

A verified artist gets a checkmark next to their name. They do **not** get:

- editing of `Name`, `Bio`, or `Slug`;
- avatar upload (still `POST /admin/artists/{id}/avatar`, admin-only);
- control over which lyrics or videos are attributed to them;
- any moderation, takedown, or ordering capability.

All artist data stays editorially owned and admin-edited. If profile editing is ever wanted it is a
separate feature with its own permission model, audit trail, and moderation queue — not an
implication of the badge. Nothing in this feature should be built in a way that presumes it.

## But a verified artist needs a correction path

**New requirement, introduced by the expanded scope.** When this doc was first written the profile
published a name, a bio and a catalog — all of it derived from content we already host. It now also
publishes an **identity block**: real name, aliases, birthdate, hometown ([06](06-artist-detail-hero.md),
[16](16-backend-gaps-and-contracts.md) Gap 7).

That is a different kind of statement. A birthdate is a **factual claim about a living person**,
asserted by 116, on a profile that person mostly has not claimed, indexed by search engines with
`MusicGroup` JSON-LD ([13](13-seo-and-metadata.md)). "No CMS" is still the right answer for
*editing*; it is not an acceptable answer for *correcting*.

**The rule:** an artist who has been verified must have a route to get their own identity data
fixed, and it must be reachable from the page carrying the claim.

This does **not** reopen artist-submitted editing. The distinction is deliberate:

| Editing (still out of scope) | Correction (required) |
|---|---|
| The artist writes the value | The artist reports the value is wrong |
| Change is live immediately | Change is made by staff, after review |
| Needs a permission model, audit trail, moderation queue | Needs an inbox and an admin edit form that already exists |
| Applies to bio, avatar, attribution, ordering | Applies to the four identity fields, and to a wrong `Name` |

Minimum viable version, and the recommendation for v1:

- A **contact route, not a form on the profile.** The existing out-of-band channel is enough — the
  audience is one person per profile and the volume is single-digit.
- Surfaced to **verified artists only**, and only on their own profile. An open "report an error"
  affordance on every profile is an abuse surface with no triage behind it, exactly like the claim
  CTA below.
- **The identity block is the only thing in v1 that requires this.** Bio and catalog errors are
  ordinary editorial corrections with no urgency attached.

Two things the frontend must not do while this is unresolved:

1. **Do not invent values to fill the block.** Every field is nullable and hidden when null
   ([06](06-artist-detail-hero.md)). A missing hometown renders nothing; it is never inferred from
   a bio, a label, or a name.
2. **Do not attribute the data.** No "source:" line, no "last verified" date. We either stand
   behind the value or we do not publish it.

Editorial sourcing — who supplies these values and who checks them — is the other half of the same
problem and is a policy decision, not a UI one. Both halves are recorded in
[25](25-open-questions.md).

## Open: does the frontend show a "claim this profile" CTA?

**Unresolved. Flagged, not decided.** Carried into [25](25-open-questions.md).

The endpoint exists, so a CTA is technically cheap. Everything else about it is a product decision
nobody has made:

| Question | Why it blocks the CTA |
|---|---|
| Who may claim? | `POST /artists/{id}/claim` presumably requires auth. Anonymous visitors would need a sign-up detour before a button that does nothing visible. |
| What does the claimant see afterwards? | The endpoint records a request and returns. With no "claim pending" state on the profile and no notification system, the button gives no feedback beyond a toast. |
| How does an admin learn of it? | There is no admin claim-review queue in the dashboard today. A claim that nobody sees is a form submitted into a void. |
| What stops abuse? | Nothing rate-limits or validates a claim. A visible CTA on every unverified profile invites bulk false claims that a human then has to triage. |
| Where would it even sit? | The hero is deliberately minimal ([06](06-artist-detail-hero.md)) and a claim CTA is for a vanishingly small audience — one person per profile, at most once. |

The CTA also requires the artist's **id**, which [14](14-data-requirements.md) explicitly states
the frontend does not receive. Adding it to the DTO purely to enable a claim button reopens a
decision made deliberately.

**Recommendation, for the product owner to accept or reject:** ship v1 with **no CTA**. Claims
arrive through the existing out-of-band channel (contact/email), which already has a human on the
other end. Revisit when an admin claim-review queue exists — at which point the CTA is a
half-day's work and actually leads somewhere.

If a CTA is wanted anyway, the minimum viable version is: signed-in users only, on unverified
profiles only, a link to a contact form rather than a direct `POST` — no id exposure, no silent
void, no abuse surface.

## Accessibility

- The badge is an `<svg aria-hidden="true">` plus a visually-hidden text label, or an icon with
  `role="img"` and `aria-label`. Never a bare decorative glyph, and never a `✓` character in the
  name string — it would be read aloud as punctuation inside the name.
- The tooltip's content is reachable without hover: it is on a focusable trigger, or the same
  sentence is available to screen readers via the accessible name.
- The badge is not a link and not a button on the card — the whole card is one link with one focus
  stop ([04](04-artists-index-page.md)). It must not add a second tab stop.
- Colour is not the only carrier. The checkmark shape plus the label carries it; a
  colour-differentiated badge with no shape difference fails for a colour-blind reader.

## Not in scope

- Verification tiers or per-type badges. One badge, one meaning.
- Displaying claim/verification **dates**. `VerifiedAt` is an internal audit field.
- A "pending claim" state on the profile. Claim status is private to the claimant and the admin.
- Verified-only filtering or sorting on the index. The directory is alphabetical
  ([04](04-artists-index-page.md)) and filtering by badge would turn it into a ranking.
- A verified-only boost anywhere ranking *does* exist — `Chansons populaires` sorts on `ViewCount`
  and nothing else ([08](08-catalog-sections.md)).
- An in-app correction **form**. The correction path above is a contact route reviewed by staff,
  not a self-service editor.
