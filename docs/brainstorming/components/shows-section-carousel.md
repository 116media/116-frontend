# Shows Section — MD3 Carousel

Spec and design notes for the homepage "shows" section: a horizontally
swipeable carousel of video-category "shows", behaving like the **Material
Design 3 carousel**. This is a planning doc — no implementation yet.

---

## Goal

Surface the current **shows** (which are **video categories**) as a swipeable,
arrow-controlled carousel that visually pulls the user in. Each card is a
poster-style vertical card with the category artwork covering the whole card,
the show title and its episode count at the bottom. A single "view all" button
sits centered below the strip.

---

## Anatomy

```text
                     ┌──────────────────────────────┐
                     │     EVERYONE'S WATCHING NOW   │   ← centered i18n title
                     └──────────────────────────────┘

   ◀   [ large ][ large ][ medium ][ small ]   ▶            ← MD3 carousel
        ─────── horizontal swipe / drag ───────              (arrows, no autoplay)

                        ┌────────────┐
                        │  View all  │                       ← centered button
                        └────────────┘
```

### Section header
- **Centered** title at the top, **i18n**. See "Title copy" below.
- No "view all" link here — the view-all is a **button at the bottom center**.

### Show card (vertical, poster-style)
- **4:5 portrait** card.
- **Full-bleed thumbnail** of the category covering the entire card.
- A bottom gradient scrim so text stays legible over any image.
- **Show title** at the bottom, with the **category description** below it
  **clamped to 2 lines** (`line-clamp-2`). Both come straight from `CategoryDto`
  (`name`, `description`) — no episode/video count.
- Clicking the card navigates to the category/show page.

### View-all
- A real **button** (not a text link), **centered** under the carousel.
- Navigates to the **shows page** (see below) — the full listing of video
  shows.

### Shows page (view-all destination)

- A dedicated route (e.g. `/shows`) showing a **grid of all video categories**
  (the "shows").
- **Video categories only** — same data source as the carousel
  (`GET /api/v1/public/categories?contentTypeId=<videoTypeId>`), just rendered
  as a full responsive grid instead of a carousel.
- Cards reuse the same show-card design (full-bleed poster + title).

### Carousel behavior
- Horizontal **swipe / drag** with momentum and snapping.
- **Arrows** on the left and right.
- **No autoplay.**
- **MD3 dynamic resize + masking** (see next section) — this is a hard
  requirement, not a normal uniform slider.

---

## What "behaves exactly like MD3" means

The defining trait of the MD3 carousel is that **items dynamically resize as
they scroll and their imagery is masked (clipped), never scaled/squished**.

1. **Multiple item sizes, not one.** MD3 uses size keylines —
   **large → medium → small**. The strip shows a mix at once, e.g.
   `[large][large][medium][small]`. As the user swipes, each item transitions
   between those sizes based on its position relative to fixed keyline anchors
   in the viewport.
2. **Masking, not squishing (signature effect).** When an item shrinks its
   **container width collapses** while the **image inside stays at full cover
   size** — the photo is revealed through a narrowing window. A plain
   `scale()` transform is wrong; the artwork must be clipped, not distorted.
3. **Parallax.** The cover-cropped image translates to stay centered as its
   mask narrows, producing a subtle parallax on the artwork.
4. **Keyline snapping.** Scroll snaps so a **large** item rests at the leading
   keyline; the trailing item collapses `medium → small` and a fresh large item
   emerges.
5. **Gestures.** Horizontal drag with momentum; snap on release; arrows.

### MD3 layouts (carousel arrangement — not the card's internal layout)
- **Multi-browse** — large + medium + small visible together. Best for
  *browsing many shows*. **✅ Chosen** (confirmed by the reference image: a
  one-line swiper with a large focal card, medium neighbours, and progressively
  narrower/masked cards at the trailing edge).
- **Hero** — one large focal item + a small "peek" hinting at the next.
- **Uncontained** — uniform, edge-to-edge (closest to a plain carousel; loses
  most of the MD3 character).
- **Full-screen** — one item fills the viewport (not suitable here).

> Note: this "layout" is the **carousel arrangement** (how slides are sized
> across the strip). The **card's** own layout (4:5 poster + title + 2-line
> description) is separate and already fixed above.

---

## Implementation approach (shadcn + Embla)

shadcn's `Carousel` is **Embla** underneath. Embla provides swipe, snap, drag,
and arrows — but its slides are **uniform width**; the MD3 resize-mask is **not**
built in. The plan is to keep shadcn/Embla for the mechanics and layer a
**custom scroll-progress tween** on top for the MD3 look:

- On every Embla `scroll` / `reInit`, read `emblaApi.scrollProgress()`,
  `emblaApi.scrollSnapList()`, and `emblaApi.slidesInView()`.
- For each slide, compute its distance to the nearest keyline and map it to a
  **container width** (large/medium/small) — this is the mask.
- Counter-translate the inner `<Image fill>` so the artwork stays cover-cropped
  and centered while the mask resizes (the parallax + "no squish" guarantee).
- Embla already handles snapping to the computed keylines and the arrow
  controls.

> Tension to call out: "use shadcn" + "exactly like MD3" can't both be taken
> literally — shadcn alone gives swipe/snap/arrows but not the resize-mask. The
> resolution is shadcn/Embla **plus** the custom tween above.

**Verify on implementation:** the exact Embla scroll-progress API against the
installed Embla version (Context7 quota was exhausted at spec time, so this is
from established knowledge, not a fresh doc pull). Confirm the project already
has a shared Carousel wrapper (HeroCarousel/PairCarousel use `useEmblaCarousel`)
and whether a custom tween plugin already exists before adding one.

---

## Data

- **Backend source**: `GET /api/v1/public/categories` (`PublicGetActiveCategories`)
  — public / `AllowAnonymous`, `ContentBrowsing` rate limit. Returns
  `{ categories: CategoryDto[] }` (all **active** categories). Takes an optional
  `?contentTypeId=<id>` filter — pass the **Video** content type id to get only
  the video "shows". (Categories are active/inactive; there is no published
  state.)
- Each card uses `id`, `name`, `slug`, and `posterUrl` (card artwork) from
  `CategoryDto` — all already present in the response, so **no backend change is
  needed** for this section.
- Dummy data first (deterministic, like the other sections) until wired to the
  endpoint.

## Fetch strategy

- **Typical client-side request** — same pattern as the video feed section: a
  `"use client"` container with a loading state that calls the browser
  `apiClient`, rendering a **skeleton while loading**, then the carousel.
- A `ShowsSection.Loading` skeleton mirrors the section (centered title + a row
  of card placeholders) and shows while the request is in flight.

---

## i18n — title copy

Centered title, must be translatable. It should signal **"these are shows /
things to watch"** through the act of watching — **without** literally using the
word "shows" or "émissions".

**Chosen title:**

| EN                      | FR                               |
|-------------------------|----------------------------------|
| Everyone's Watching Now | Tout le monde regarde maintenant |

Social-proof angle — "watching" implies shows/content worth your time, and the
"everyone" creates FOMO, all without saying "shows". (FR casing normalized to
sentence case for display; the title can still be uppercased via CSS.)

Other options considered: Now Showing / À l'affiche · Press Play / Appuyez sur
Play · Ready to Binge? / Prêt à binger ? · Tune In / Branchez-vous.

Plus the supporting string:
- View-all button label (e.g. "View all shows" / "Voir toutes les émissions").

---

## Status — spec frozen

All decisions are locked; this is ready to implement.

- **Carousel layout**: MD3 **multi-browse** (one-line swiper; large focal card +
  medium neighbours + masked/resized cards at the trailing edge — per the
  reference image), arrows, no autoplay.
- **Card**: 4:5 portrait, full-bleed poster + title + 2-line description
  (`CategoryDto.description`), no count.
- **Title**: "Everyone's Watching Now" / "Tout le monde regarde maintenant".
- **Data**: `GET /api/v1/public/categories` filtered to the video content type
  (no backend change).
- **Fetch**: client-side request with a loading skeleton.
- **View-all**: dedicated **shows page** — a grid of all video categories,
  reusing the same data source and card design.
