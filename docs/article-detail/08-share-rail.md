# 08 — Share Rail

`ArticleDetail.ShareRail` is the article's share affordance: a small cluster of circular
icon buttons for **Facebook**, **X (Twitter)**, **WhatsApp**, and **copy link**. On wide
screens it is a **vertical, sticky rail** that rides the left edge of the two-column body
([04-page-composition.md](04-page-composition.md)); on mobile it collapses to a **horizontal
row** placed under the hero. Same buttons, two layouts — driven by responsive classes, not
two components.

Every button does two things: it opens the platform's share surface **and** pings the
backend so the article's `shareCount` grows. The platform choice is client-side context
only — the backend records a share event and does not store which network was used (see
[03-backend-api-reference.md](03-backend-api-reference.md) §3).

---

## Anatomy

```text
ArticleDetail.ShareRail          sticky vertical rail (lg+) / horizontal row (mobile)
 ├─ ShareRailButton  Facebook    SiFacebook   → Facebook sharer
 ├─ ShareRailButton  X           SiX          → X (Twitter) intent
 ├─ ShareRailButton  WhatsApp    SiWhatsapp   → WhatsApp send
 └─ ShareRailButton  Copy link   LinkIcon     → clipboard + toast
```

Each `ShareRailButton` is a `Button variant="ghost" size="icon"` rendered circular
(`rounded-full`), muted at rest and **brand-tinted on hover**. The brand marks come from
`@icons-pack/react-simple-icons` (`SiFacebook`, `SiX`, `SiWhatsapp`) — already a project
dependency. The copy-link button uses a lucide icon from the barrel.

> **Barrel note.** The barrel (`@/shared/presentation/components/ui/Icon`) does **not**
> currently re-export a link/copy glyph. Add **`Link as LinkIcon`** (or `Copy as CopyIcon`)
> to `Icon/lucide.ts` before wiring the copy-link button. The design uses **`LinkIcon`**.
> Tracked in [19-open-questions.md](19-open-questions.md).

---

## Layout — sticky vertical, responsive horizontal

The rail mirrors the placement pattern the two-column body establishes: on `lg+` it is a
narrow sticky column (`sticky top-24`) beside the article body; below `lg` it becomes a
centered horizontal row.

```tsx
<div className="flex flex-row items-center gap-2 lg:sticky lg:top-24 lg:flex-col">
    {/* four ShareRailButton — full body in specs/07 */}
</div>
```

- `flex-row … lg:flex-col` — horizontal on mobile, vertical on desktop.
- `lg:sticky lg:top-24` — the rail stays in view as the body scrolls (only pinned on the
  wide layout, where there is a column for it).
- Buttons are `size-9 rounded-full` with a muted foreground; the `ShareCount` figure may
  optionally cap the rail (reusing the entity's `shareCount`).

---

## Colors — the one documented brand exception

Icons and hover tints follow **theme tokens** at rest (`text-muted-foreground`, hover
`bg-muted`). Brand recognizability is the single allowed hardcoded-color exception: a
button may tint to its network's brand color on hover (Facebook blue, WhatsApp green, X
foreground). Prefer `currentColor` + a muted hover where the brand is still recognizable
from the mark alone; where an explicit brand hue is wanted, document it inline as the
exception. This is the only place in the detail page that may reference a non-token color,
and only for the share brand marks. See [16-i18n.md](16-i18n.md) and
[19-open-questions.md](19-open-questions.md).

| Platform | Mark | Brand tint (hover, exception) |
|---|---|---|
| Facebook | `SiFacebook` | `#1877F2` |
| X (Twitter) | `SiX` | `currentColor` (foreground) |
| WhatsApp | `SiWhatsapp` | `#25D366` |
| Copy link | `LinkIcon` | token only (`text-primary` on hover) |

---

## The share flow — native first, per-platform fallback

Two paths, one intent:

1. **Native Web Share API** — when `navigator.share` exists (mobile, some desktop), the
   button offers the OS share sheet with the article URL and title. This is the preferred
   path because it reaches every installed app, not just the four we surface.
2. **Per-platform fallback** — when the Web Share API is unavailable, the button opens the
   platform's intent URL in a new window (`window.open(url, "_blank", "noopener")`).

The absolute article URL is built from `window.location.href`, or, for SSR-safe
construction, an env base + `/articles/{slug}`:

```ts
const url =
    typeof window !== "undefined"
        ? window.location.href
        : `${process.env.NEXT_PUBLIC_SITE_URL}/articles/${slug}`;
```

### `buildShareUrl(platform, url, title)`

A small **pure helper** returns the intent URL per platform, so the button component stays
declarative and the URL shapes are unit-testable in isolation:

```ts
type SharePlatform = "facebook" | "x" | "whatsapp";

/**
 * Builds the share-intent URL for one network from the absolute article URL and title.
 */
function buildShareUrl(platform: SharePlatform, url: string, title: string): string {
    const u = encodeURIComponent(url);
    const t = encodeURIComponent(title);
    switch (platform) {
        case "facebook":
            return `https://www.facebook.com/sharer/sharer.php?u=${u}`;
        case "x":
            return `https://twitter.com/intent/tweet?url=${u}&text=${t}`;
        case "whatsapp":
            return `https://api.whatsapp.com/send?text=${t}%20${u}`;
    }
}
```

Copy-link has no intent URL — it writes `url` to the clipboard
(`navigator.clipboard.writeText`) and confirms with a **toast**.

---

## Backend ping — fire-and-forget on every share

Whichever path fires (native, per-platform, or copy), the button **also** records the
share against the article, fire-and-forget. The platform label is passed through as
client-side context; the backend records a bare share event
([03-backend-api-reference.md](03-backend-api-reference.md) §3).

The reused feed hook is `useShareArticle(articleId, slug)`, which returns an **async
function** that runs its own native-share-with-clipboard-fallback and calls
`shareArticleUseCase.execute(articleId, platform)`:

```ts
export function useShareArticle(articleId: string, slug: string) {
    return async () => {
        const url = `${window.location.origin}/articles/${slug}`;
        if (navigator.share) {
            try { await navigator.share({ url }); } catch { return; }
            container.cradle.shareArticleUseCase.execute(articleId, "web-share");
            return;
        }
        await navigator.clipboard.writeText(url);
        container.cradle.shareArticleUseCase.execute(articleId, "clipboard");
    };
}
```

The rail needs **per-platform** buttons (Facebook / X / WhatsApp / copy) rather than one
generic share, so it uses the hook's underlying use case directly for the ping —
`container.cradle.shareArticleUseCase.execute(articleId, platform)` — and reserves the
hook's own function for a native "share" affordance if one is added. Every button, on
click, calls this ping fire-and-forget (no await, errors swallowed) so telemetry never
blocks the share surface. Scoped props for the rail are `articleId`, `slug`, `title`.

> **On the two-arg surface.** `shareArticleUseCase.execute(articleId, platform)` keeps a
> two-arg shape, but the generated client's `publicShareArticle(id)` takes **no platform**.
> `platform` is client context only — it never reaches the wire. See
> [03-backend-api-reference.md](03-backend-api-reference.md) §3.

---

## Accessibility

- Each button has an `aria-label` from the i18n catalog (`articles.share.facebook`,
  `.x`, `.whatsapp`, `.copy`), since the buttons are icon-only.
- Copy-link's toast is polite (sonner default) and announces success.
- The rail is `role`-neutral (a plain flex container); the buttons carry the semantics.

The full component, `buildShareUrl`, and the copy-link toast wiring are in
[specs/07-share-rail.md](specs/07-share-rail.md).
