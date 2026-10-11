# 11 — Accessibility & Responsive

The a11y contract for both routes, and every breakpoint in one table.

> **Scope history.** Written for three tabs, expanded for merch and tour, and now back to three
> tabs over five content surfaces after merch, tour and featured credits were cut
> ([07](07-artist-detail-tabs.md), [08](08-catalog-sections.md)). What survives the churn: a
> stacked `Musique` panel with an anchor jump-bar, and four contracts added along the way — the
> scrolling tablist, the jump-bar, rank numerals, and outbound links.

## Tabs

[07](07-artist-detail-tabs.md) locks the pattern: `role="tablist"` / `role="tab"` /
`role="tabpanel"`, `aria-selected`, `aria-controls` ↔ `aria-labelledby`, arrow keys plus
`Home`/`End`, roving tabindex, and focus staying on the tab after a switch. Expanding on that:

- **Use the shared `Tabs`** (`shared/presentation/components/ui/Tabs`, Radix-backed). It already
  implements roles, roving tabindex, arrow/Home/End, and the id pairing. Hand-rolling the pattern
  to re-derive those behaviours is how they end up subtly wrong.
- **The tab bar is not page navigation.** It carries `role="tablist"`, not `<nav>`, and its
  controls are `<button>`s even though they also write `?tab=` to the URL. A `<a href="?tab=videos">`
  inside a tablist announces as a link and breaks the pattern's keyboard contract.
- **Panels keep a stable id across switches**, so `aria-controls` never points at a detached node
  while a panel is mid-fetch.
- **The panel is not focusable and is not focused on switch.** With focus on the tab, arrow keys
  keep working; move focus into the panel and the user must tab back out to reach the next tab.
- **A tab's own loading state stays inside its panel.** The tablist never disappears or becomes
  `aria-busy` — the user must be able to switch away from a slow tab.
- **One tab means no tablist at all** ([07](07-artist-detail-tabs.md)) — the heading and the panel
  render bare. A one-item tablist announces "tab 1 of 1", which is noise.
- **The stat row entries in the hero** activate tabs ([06](06-artist-detail-hero.md)). They are
  `<button>`s outside the tablist and must not carry `role="tab"` — a tab outside its tablist is
  invalid and breaks arrow-key traversal.

### The scrolling tablist — a defensive path that must still work

[07](07-artist-detail-tabs.md) makes the bar horizontally scrollable below `md` rather than wrapping
it or hiding tabs behind a "More" menu. That choice is what keeps the ARIA pattern intact — every
tab stays in one tablist, in DOM order — but it moves the burden onto scroll management:

- **Arrowing to an off-screen tab must scroll it into view.** Roving tabindex moves focus to a tab
  that may be entirely outside the scrollport; a focused element that cannot be seen is a
  **WCAG 2.4.11 (Focus Not Obscured)** failure. The keydown handler calls
  `scrollIntoView({ inline: 'nearest', block: 'nearest' })` on the newly focused tab. `block: 'nearest'`
  is not optional — omit it and the browser scrolls the whole page vertically to a bar that was
  already visible.
- **The active tab is scrolled into view on mount**, `inline: 'center'`, so deep-linking to
  `?tab=news` never lands on a bar that appears to start and end at `Musique`.
- **`scroll-snap-type: x proximity`, not `mandatory`.** Mandatory snapping fights programmatic
  `scrollIntoView` and can leave focus mid-transition; `proximity` snaps a resting scroll without
  overriding a scroll we initiated.
- **The container is natively scrollable** (`overflow-x: auto`), never a transform-based carousel —
  same rule as the alphabet rail below, and for the same reason: transforms do not scroll on focus.
- **The right-edge fade is decorative** and `aria-hidden`. It must not be the only signal that more
  tabs exist; the tablist's own semantics already convey "tab 2 of 3".
- **`prefers-reduced-motion` makes both scrolls instant** (`behavior: 'auto'`), not absent. Removing
  the scroll entirely would re-create the invisible-focus failure.
- Tabs keep a **44×44 CSS px** target and never wrap to a second line.

### The `Musique` jump-bar is navigation, not tabs

The anchor row at the top of the `Musique` panel ([07](07-artist-detail-tabs.md)) sits inside a
`tabpanel` and looks like a second tab bar. It is not one, and the distinction is the single easiest
thing to get wrong in this feature:

- It is `<nav aria-label="…">` (`artists.a11y.sectionNav`) wrapping a list of plain
  `<a href="#albums">` links. **No `role="tab"`, no `role="tablist"`, no `aria-selected`, no roving
  tabindex.** A tablist nested in a tabpanel makes arrow keys ambiguous and nests the roving
  tabindex — rejected explicitly in [07](07-artist-detail-tabs.md).
- **Every link is in the tab order**, unlike tabs. That is the point: four short links are cheap to
  tab past, and they behave the way a link is expected to.
- Activating a link **moves focus to the target section**, which a fragment link does natively only
  if the target is focusable. Each `<h2>` therefore carries `tabindex="-1"` and an `id` matching the
  fragment; without it the browser scrolls but leaves focus at the top of the panel, and the next
  Tab press sends a keyboard user back to the jump-bar.
- Targets need `scroll-margin-top` clearing the sticky tab bar at `md+`, or the heading a user just
  jumped to renders underneath it.
- Scroll-linked highlighting is optional; if implemented it is a visual treatment only and must not
  become `aria-current`, which would re-import the "selected" semantics the pattern is avoiding.
- The bar is omitted at ≤ 2 sections, so it never announces a one-item navigation landmark.

## Alphabet rail

- The rail is a `<nav>` with `aria-label` (`artists.a11y.alphabetNav`), containing a list of
  controls. It is a filter over one page, so the controls are `<button>`s, not links.
- The active letter carries `aria-current="true"` **and** a visual treatment that is not colour
  alone ([05](05-alphabet-search-and-filters.md)) — a filled background plus weight change.
- **Disabled letters stay perceivable.** `disabled` on a native button removes it from the tab
  order *and* from most screen-reader interaction, which erases the "no artists start with Q"
  information the disabled state exists to convey. Use `aria-disabled="true"` with a click
  no-op instead: the letter keeps its tab stop, is announced as dimmed-but-present, and the rail
  stays a complete 27-item set. Its contrast must still clear 3:1 against the rail background — a
  disabled control that cannot be read is the same as a hidden one.
- **Horizontal scroll must be keyboard-reachable.** Below `md` the rail scrolls horizontally. The
  scroll container needs `tabindex="0"` and an accessible name so a keyboard user can scroll it
  without tabbing through 27 buttons — and because tabbing to an off-screen letter must scroll it
  into view, the buttons must live in a natively scrollable element (`overflow-x: auto`), not a
  transform-based carousel, which does not scroll on focus.
- Touch targets are at least 44×44 CSS px. A 27-item rail of 28px chips is unusable on a phone.

## Cards

- **One card, one link, one tab stop** ([04](04-artists-index-page.md)). The avatar, name, count
  and badge are all inside the single `<Link>`; none of them is separately focusable.
- The link's accessible name is the artist name plus the count, in that order — the count is
  useful context, and reading "12 songs, Fally Ipupa" first is backwards.
- **`ReleaseCard` is not interactive** ([08](08-catalog-sections.md)): no `tabindex`, no `role`, no
  hover affordance. A tab stop that does nothing when activated is worse than no tab stop.

## Ranked lists — Chansons populaires

The section ranks by `ViewCount` and prints `1.`–`10.` down the column
([08](08-catalog-sections.md)). The ordering is real information, so it must reach assistive tech —
but not twice:

- **The list is an `<ol>`.** The ordering semantics live there, where a screen reader already
  announces position and set size.
- **The printed numerals are `aria-hidden`.** They are a visual restatement of what the `<ol>`
  already conveys; announcing "1. Number 1, Eloko Oyo" is the duplication this rule exists to stop.
- **Do not put the rank in the accessible name** of the card link. The link's name is the song
  title, exactly as in every other section, so a user comparing sections is comparing like with like.
- The numeral column is a fixed width so titles left-align, and it must not be the only thing
  distinguishing row 1 from row 10 visually — the ordering itself does that work.
- **The heading must say what the sort actually is**: *"Les plus lues"* / *"Most read"*, never "les
  plus écoutées" — we count reads, not plays ([12](12-i18n.md)).

## Outbound links — the social row

The social row ([06](06-artist-detail-hero.md)) is the only thing on either route that sends the
user off-site, and it opens a new tab. **Opening a new tab without warning is a WCAG 3.2.5 issue**,
and practically it makes users think Back is broken.

> The commercial outbound surfaces this section was written for — merch cards and ticket CTAs —
> were cut with merch and tour ([01](01-overview.md)). The contract below is unchanged and applies
> to the social row alone; it is worth keeping intact because any future outbound surface inherits
> it rather than reinventing it.

- **Every outbound control announces its destination change.** A visually-hidden suffix is appended
  inside the accessible name — `artists.a11y.opensExternalSite` → *"ouvre un site externe"* — so the
  link reads as "Instagram de Fally Ipupa, ouvre un site externe".
- **The suffix is inside the link, not adjacent to it.** A sibling `<span>` outside the `<a>` is not
  part of the accessible name and is announced only in reading order, which most users never hear.
- **The ↗ icon is `aria-hidden`.** It is the visible half of the affordance; the text suffix is the
  announced half. Neither alone is sufficient — icon-only fails non-visual users, text-only fails
  the visible-affordance requirement.
- **The suffix is not repeated per card in the same list** at the expense of clarity — it is short
  by design precisely because it repeats. Do not shorten it to "↗" in the accessible name.
- The `rel` values (`nofollow sponsored noopener noreferrer` for commercial links,
  `noopener noreferrer` for socials) are an SEO and security contract, not an a11y one — they live
  in [13](13-seo-and-metadata.md).

### Social icons

- **Each social link is icon-only and therefore needs an explicit accessible name**, per platform
  and naming the artist: `artists.a11y.socialLink` → *"Instagram de Fally Ipupa"*. A bare icon with
  no name announces as "link" and is useless; a name of just "Instagram" is ambiguous on a page that
  also links our own socials in the footer.
- The platform icon itself is `aria-hidden`; the name comes from the visually-hidden label.
- The row is a plain list, **not** a navigation landmark. Six landmark-level `<nav>`s on one page
  dilutes landmark navigation, and this is a set of external destinations, not site navigation.
- Unknown platforms are skipped ([06](06-artist-detail-hero.md)) — there is no generic icon, so
  there is no unnameable link.
- 44×44 targets. Icon rows are where this rule is most often broken.

## Load-more focus — the part that is easy to get wrong

Appending items to a list while the user's focus is on the button that appended them is where most
implementations lose focus. Three rules:

1. **The button stays mounted and keeps its DOM identity** across the fetch. It is disabled and
   `aria-busy` while in flight, then re-enabled — never unmounted and re-rendered, which drops
   focus to `<body>` and sends the user back to the top of the page.
2. **Do not move focus to the appended items.** The user asked for more content, not to be
   teleported into it. Instead a polite live region announces the new total
   (`artists.a11y.resultsAnnounce`), per [09](09-loading-empty-error.md).
3. **On exhaustion the button is replaced by the end-of-list line** — the one moment focus is
   genuinely destroyed. The terminus element takes `tabindex="-1"` and receives focus explicitly,
   so the user lands on "you've reached the end" instead of at `<body>`. This is the single
   highest-value a11y detail in the feature and the one most likely to be dropped in review.

The same three rules apply to every tab's load-more inside the profile.

## Bio expand toggle

A real `<button>` with `aria-expanded`, per [06](06-artist-detail-hero.md) — never a CSS checkbox
hack, which is announced as a checkbox and cannot be labelled meaningfully.

- The button's label changes with state (`artists.bio.expand` ↔ `artists.bio.collapse`); it does not
  stay "Show more" while showing less.
- The bio text keeps a stable id and is referenced with `aria-controls`.
- The clamp is CSS (`line-clamp`), so the full text is always in the DOM. That is deliberate:
  screen readers and crawlers get the whole bio regardless of the visual state.
- The toggle renders only when the text actually overflows. A "show more" that reveals nothing is
  a lie the UI tells twice — once by existing, once when pressed.

## Images and alt text

| Case | `alt` |
|---|---|
| Avatar inside `ArtistCard` (link already names the artist) | `""` — decorative |
| Avatar in `ArtistHero` (adjacent `<h1>` names the artist) | `""` — decorative |
| Release cover in `ReleaseCard` (adjacent text names the release) | `""` — decorative |
| Avatar used anywhere the name is *not* adjacent text | `artists.a11y.avatarAlt` → "Photo de {{name}}" |

The rule is one line: **an image whose information is already in adjacent text is decorative.**
Giving the hero avatar `alt="Fally Ipupa"` makes a screen reader say the name twice in a row.
`ArtistAvatar` therefore takes the alt decision from its caller and defaults to `""`.

The initials fallback ([04](04-artists-index-page.md)) is rendered text inside an `aria-hidden`
wrapper for the same reason — the initials carry no information the name doesn't.

## Verified badge

Not decorative ([06](06-artist-detail-hero.md)). It is an icon with an accessible label
(`artists.verified.label` → "Artiste vérifié"), so it is announced as part of the card link's or
the heading's name.

The tooltip (`artists.verified.tooltip`) explains what verification means. Tooltip-only meaning is
unacceptable on touch, so the tooltip is an enhancement over the label, never the sole carrier —
the label alone must be sufficient.

## Contrast, colour and motion

- **The count text is the card's primary signal** ([04](04-artists-index-page.md)) yet is styled
  muted. `text-muted-foreground` must clear **4.5:1** against the card background in *both* themes;
  if it does not, this is the one place to step up to a stronger token rather than shrink the
  contrast requirement. Verify with the theme tokens, not by eye.
- Selected letter, active tab, and verified state are never encoded by colour alone — each pairs
  colour with weight, fill, or an icon.
- **`prefers-reduced-motion`**: the shared `Tabs` ships a sliding indicator and directional content
  transitions; both are suppressed under reduced motion, leaving an instant state change. Skeleton
  `animate-pulse` becomes a static block. Nothing in this feature animates on scroll.
- Focus rings are visible on every interactive element including inside cards — the card link's
  ring outlines the whole card, which is why the card has no inner focusables.

## Responsive

### Consolidated column table

Tailwind's default breakpoints, restated from [04](04-artists-index-page.md) and
[08](08-catalog-sections.md) as one table:

| Grid | base `<640` | `sm` 640 | `md` 768 | `lg` 1024 | `xl` ≥1280 |
|---|:---:|:---:|:---:|:---:|:---:|
| Artist index (`ArtistGrid`) | 2 | 3 | 4 | 5 | 6 |
| Chansons populaires | 1 | 2 | 2 | 2 | 2 |
| Dernières chansons | 2 | 3 | 4 | 5 | 5 |
| Albums | 2 | 3 | 4 | 5 | 6 |
| Mixtapes | 2 | 3 | 4 | 5 | 6 |
| Vidéos | 1 | 2 | 2 | 3 | 4 |
| Actualités | 1 | 2 | 2 | 3 | 3 |

**This table is now a restatement of [08](08-catalog-sections.md), not a reconciliation of it.**
The earlier version of this doc resolved two four-value/five-breakpoint ambiguities by judgement
(the lyrics tab capped at 5, the videos tab holding 2 across `sm`–`md`); doc 08 has since stated all
five breakpoints explicitly and **adopted both resolutions**. One correction carried over: 08 now
gives Albums `2 / 3 / 4 / 5 / 6`, where this doc previously had `2 / 3 / 4 / 6 / 6`. **08 wins** —
jumping 4 → 6 at `lg` shrinks covers by a third in one step.

One note on the new rows: **Chansons populaires is the only grid that narrows on the way up.** It
is a two-column list of compact rows, not a card grid, and it deliberately stops at 2 so a rank +
thumbnail + title row keeps a readable line length ([08](08-catalog-sections.md)).

Page sizes, all from [08](08-catalog-sections.md):

| Surface | Page size |
|---|---|
| Artist index | 30 |
| Chansons populaires | 10, fixed — no paging |
| Dernières chansons | 20 |
| Albums · Mixtapes | 12 |
| Vidéos · Actualités | 12 |

Every one of them is a real pager whose control is hidden while there is only one page
([08](08-catalog-sections.md)). There are no unpaginated surfaces.

### Layout at each route

| Element | `< md` (768) | `md+` |
|---|---|---|
| Hero | stacked, centred; 112px avatar; stat row wraps | horizontal; 160px avatar; stats on one line |
| Identity block | label above value, stacked | two columns, labels left-aligned |
| Social row | centred under the identity block, wraps | left-aligned, one line |
| Alphabet rail | horizontally scrollable strip | wraps inline, all 27 visible |
| Tab bar | **horizontally scrollable**, static | fits in a flex row, **sticky** |
| `Musique` jump-bar | horizontally scrollable, **never sticky** | inline row, never sticky |
| Search input | full width | full width, above the rail |
| Preview grid | 3 items (songs/news) / 2 (videos) | 4 (songs/news) / 3 (videos) |

Sticky, decided once for the tab bar:

- **The hero is never sticky, at any width** ([06](06-artist-detail-hero.md)).
- **The tab bar is sticky only at `md+`** ([07](07-artist-detail-tabs.md)). Below `md` the bar can
  become a horizontally scrolling strip, and pinning a strip that scrolls sideways to the top of a
  viewport the user is scrolling vertically produces two competing scroll axes in the same 44px
  band.
- **The jump-bar is never sticky, at any width.** Two stacked sticky bars at `md+` would consume
  ~96px of a phone-adjacent viewport, and a sticky in-page nav inside a sticky-topped tabpanel makes
  the scroll position of the thing it points at unpredictable. It scrolls away with the content.
- A sticky bar must not trap content behind it: the panel gets top padding equal to the bar's
  height, and every `<h2>` anchor target carries `scroll-margin-top` so jump-bar links don't land
  underneath it.

Preview counts. Only sections above 10 items get a preview ([08](08-catalog-sections.md)), which
means songs, videos and news; **Populaires, Albums and Mixtapes never get one** — they are already
short or fixed-size. At `md+` the counts are 08's: 4 for songs and news, 3 for videos. The `<md`
counts remain the one number not stated upstream: 4 items in a 2-column mobile grid is two full
rows, which is no longer a preview. Three (songs, news) and two (videos) keep it to a glance.
