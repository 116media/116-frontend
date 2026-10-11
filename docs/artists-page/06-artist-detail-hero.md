# 06 — Artist Detail Hero (`/artistes/{slug}`)

The identity block at the top of the profile. Answers "who is this and what do you have?" without
a scroll.

## Layout

Desktop (`md+`) — horizontal:

```
┌───────────────────────────────────────────────────────────────┐
│  ┌──────────┐   Fally Ipupa  ✓                                │
│  │          │   Chanteur congolais, auteur-compositeur…       │
│  │  avatar  │   …deux lignes puis « afficher plus »           │
│  │  160px   │                                                 │
│  └──────────┘   24 chansons  ·  8 vidéos  ·  3 albums         │
└───────────────────────────────────────────────────────────────┘
```

Mobile (`< md`) — stacked and centred: avatar (112px), name, bio, stat row wrapping.

## Elements

### Avatar
- 160px desktop / 112px mobile, 1:1, `rounded-full`.
- `next/image` with `priority` — it is the LCP element on this route.
- Same initials fallback as the index card ([04](04-artists-index-page.md)). Identical component.

### Name
- `<h1>`. Exactly one per page.
- Wraps rather than truncates — unlike the card, there is room, and truncating a person's name on
  their own page is not acceptable.

### Verified badge
- Inline, immediately after the name.
- Rendered only when the profile is claimed **and** verified.
- Not decorative: it needs an accessible label (*"Artiste vérifié"*) and a tooltip explaining what
  it means. A badge whose meaning is guessable-only is noise. See [22](22-verified-artists-and-claiming.md).

### Bio
- From `ArtistEntity.Bio`, nullable — omitted entirely when absent. No "No bio available" filler.
- Clamped to 2 lines mobile / 3 desktop, with an expand toggle.
- The toggle is a real `<button>` with `aria-expanded`, not a CSS-only checkbox hack.
- Plain text. Not rich text, not HTML — the field is a plain string and rendering it as HTML would
  be an injection vector.

### Stat row
- `24 chansons · 8 vidéos · 3 albums`
- Counts come from the **pagination totals already returned** by the profile endpoint. No extra
  aggregation, no extra request.
- **A zero-count entry is omitted, not shown as `0`.** An artist with no albums shows two stats,
  not "0 albums" — which reads as missing data rather than a fact.
- Each stat is a link that activates the matching tab, so the row doubles as navigation.
- Numbers use locale formatting (`1 234` in `fr`).

## Identity block

Renders below the bio. Every field is **optional and omitted entirely when null** — never a label
with an em-dash. An artist with only a name renders no identity block at all.

```
Nom réel      Aubrey Drake Graham
Aussi connu   Drizzy · Champagne Papi
Né le         24 octobre 1986 (39 ans)
Origine       Toronto, Canada
```

| Field | Type | Rendering |
|---|---|---|
| Real name | `string?` | Plain text. Omitted when it equals the stage name. |
| Aliases | `string[]` | Middot-joined, wraps. Empty array renders nothing. |
| Birthdate | **date-only** | Locale-formatted; age computed client-side. |
| Hometown | `string?` | Free text as entered (`Kinshasa, RDC`) — not a structured place. |

Three rules that matter:

- **Birthdate is date-only, never a timestamp.** A `DateTimeOffset` converted across timezones
  shifts a birthday by a day.
- **Age is derived, never stored.** A stored age is wrong within a year.
- **Real name is suppressed when it duplicates the stage name.** Showing "Nom réel : Awilo Longomba"
  under the heading "Awilo Longomba" is noise.

### Accuracy is a liability, not just a quality issue

These are claims about real, living people, published on profiles they mostly have not claimed.
A wrong birthdate or hometown is a factual assertion we are making. This raises two requirements
the schema alone does not cover:

- Editorial sourcing — where did this value come from, and who checked it?
- A correction path — a verified artist must be able to get their own data fixed
  ([22](22-verified-artists-and-claiming.md)).

Flagged rather than solved here; it is a policy decision, not a UI one.

## Social links

A row of platform icons, rendered only when at least one link exists.

- Modelled as a **child table keyed by platform**, mirroring the existing `StreamingLinkEntity`
  pattern — not N nullable URL columns ([16](16-backend-gaps-and-contracts.md) Gap 8).
- Icon-only with an accessible label per platform (*"Instagram de Fally Ipupa"*); never a bare
  icon with no name.
- `target="_blank"` + `rel="noopener noreferrer"`, with an external-link affordance.
- Unknown/unsupported platforms in the data are **skipped**, not rendered as a generic link.
- Link rot is real and unmonitored. Accepted for v1: these are the only outbound links on the
  page that we do not control, and a dead social icon is low-harm — it neither costs the reader
  money nor misrepresents a fact.

## What is deliberately absent

| Element | Why |
|---|---|
| Cover/banner image | No column, and no editorial process to source one per artist |
| Share button | Deferred; the page URL is the share unit and browsers already do this |

Each of these is a *deliberate* omission with a reason, not an oversight. If one is later requested,
[25](25-open-questions.md) records what it would cost.

## Behaviour

- The hero is **static** — no sticky behaviour. A sticky hero on a page whose main interaction is
  scrolling a catalog eats vertical space on exactly the devices with least of it.
- The tab bar directly below **is** sticky at `md+`; see [07](07-artist-detail-tabs.md).

## Data this section needs

| Field | Feeds | Status |
|---|---|---|
| `name`, `slug`, `bio`, `avatarUrl` | name, bio, avatar | ✅ on `ArtistDto` today |
| `isVerified` | verified badge | ❌ **Gap 2** — not exposed |
| `realName`, `aliases`, `birthDate`, `hometown` | identity block | ❌ **Gap 7** — no columns |
| `socialLinks[]` | social row | ❌ **Gap 8** — child table, per platform |
| Pagination totals | stat row | ✅ from the profile payload |

`ArtistDto` today is `(Id, Name, Slug, Bio, AvatarUrl)`. Everything past the first row is a gap;
detail in [14](14-data-requirements.md) and [16](16-backend-gaps-and-contracts.md).

**The hero degrades cleanly, field by field.** Each block above is independently optional — the
identity block and the social row each render only when they have data, and neither is skeletonised
while loading ([09](09-loading-empty-error.md)). So the hero is shippable before Gaps 2, 7 and 8
land, and each one lights up its own block without touching the others.

### The stat row does not grow to one entry per surface

It stays **songs · videos · albums**, and the remaining three surfaces are deliberately excluded.

The stat row's two properties are that every entry is a count already returned by the profile
payload, and that every entry links to somewhere. News is not the artist's own output, features
would double-count songs, and mixtapes fold into albums visually while being a separate query.
Adding them would cost extra aggregation on the highest-traffic route to say less.

The `Musique` jump bar and the tab strip are how the other surfaces are discovered
([07](07-artist-detail-tabs.md)) — the stat row is not a table of contents.
