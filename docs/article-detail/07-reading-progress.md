# Reading Progress

The page shows how far the reader has scrolled through the article with a **slim sticky bar
under the site header** that fills `0 → 100 %` as the body scrolls past the viewport. It is
the second of the three requirements that shape this page
([01-overview.md](01-overview.md)): *reading progress must be visualized as you scroll* —
not the static "X min read" badge the references settle for (we keep that figure in the
[hero meta](05-cover-and-header.md) **and** add the live bar).

Three pieces:

1. A shared **`Progress`** primitive — a themed track + indicator.
2. A shared **`useReadingProgress`** hook — turns the body's scroll position into a
   `0..100` number.
3. **`ArticleDetail.ReadingProgress`** — the sticky bar that wires the two together.

---

## The `Progress` primitive

`src/shared/presentation/components/ui/Progress/` — none exists. A minimal, accessible,
themed progress bar: a **`bg-muted` track** with a **`bg-primary` indicator** that scales to
`value`.

- `value` — `0..100`, clamped.
- `h-1`, `rounded`, `overflow-hidden`.
- ARIA: `role="progressbar"`, `aria-valuenow` / `aria-valuemin={0}` / `aria-valuemax={100}`.
- The indicator width is driven by an inline `width: ${value}%` (the one place inline style
  is correct — it's a computed geometric value, not a color).

```tsx
/**
 * Progress
 *
 * @description
 * A slim themed progress bar. A muted track holds a primary-colored indicator whose width
 * tracks `value` (0..100, clamped). Exposes the progressbar ARIA role and value bounds.
 * Colors are theme tokens; only the indicator width is inline (a computed geometric value).
 */
export function Progress({ value, className, ...props }: ProgressProps) {
    const clamped = Math.min(100, Math.max(0, value));
    return (
        <div
            role="progressbar"
            aria-valuenow={Math.round(clamped)}
            aria-valuemin={0}
            aria-valuemax={100}
            className={cn("h-1 w-full overflow-hidden rounded bg-muted", className)}
            {...props}
        >
            <div
                className="h-full bg-primary transition-[width] duration-150 ease-out"
                style={{ width: `${clamped}%` }}
            />
        </div>
    );
}
```

`Progress` is generic — it will serve any determinate progress need (uploads, multi-step
forms), so it lives in `shared`, not the `articles` slice.

---

## `useReadingProgress` — a shared hook

`src/shared/presentation/hooks/useReadingProgress.ts`. It is **generic** (any scrollable
element → a percent), so it lives in shared hooks, not the articles slice.

It takes a `ref` to the element being read (the article body — see
[06-article-body.md](06-article-body.md)) and returns a `0..100` number: the fraction of
that element that has scrolled *past the bottom of the viewport*.

The percent is the ratio of "how much of the element is above the viewport bottom" to the
element's own height:

```text
progress = clamp( ((scrollY + viewportHeight) - elementTop) / elementHeight , 0, 1 ) * 100
```

- At the top of the article (element top at/below the viewport bottom) → `0`.
- When the element's bottom reaches the viewport bottom → `100`.

Mechanics:

- **rAF-throttled** — the scroll handler only schedules a `requestAnimationFrame`; the
  measurement runs once per frame, so fast scrolling never floods layout reads.
- **Passive listeners** — `{ passive: true }` on `scroll` and `resize`, so the bar never
  blocks scrolling.
- **SSR-safe** — every `window` / `document` access is guarded; on the server the hook
  returns `0`. The measurement runs in a `useEffect` (client only).
- **Cleanup** — removes both listeners and cancels any pending frame on unmount.

```ts
/**
 * useReadingProgress
 *
 * @description
 * Tracks how far a target element (typically the article body) has scrolled past the
 * viewport, as a 0..100 percentage. The scroll/resize handlers are rAF-throttled and
 * passive; all window access is guarded so the hook is SSR-safe (returns 0 on the server).
 * Listeners and any pending animation frame are cleaned up on unmount.
 *
 * @param targetRef - A ref to the element whose reading progress is measured.
 * @returns The reading progress, 0..100.
 */
export function useReadingProgress(
    targetRef: RefObject<HTMLElement | null>
): number {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (typeof window === "undefined") return;

        let frame = 0;

        const measure = () => {
            frame = 0;
            const el = targetRef.current;
            if (!el) return;

            const rect = el.getBoundingClientRect();
            const elementTop = rect.top + window.scrollY;
            const elementHeight = rect.height;
            if (elementHeight <= 0) {
                setProgress(0);
                return;
            }

            const scrolled = window.scrollY + window.innerHeight - elementTop;
            const ratio = Math.min(1, Math.max(0, scrolled / elementHeight));
            setProgress(ratio * 100);
        };

        const onScroll = () => {
            if (frame === 0) frame = window.requestAnimationFrame(measure);
        };

        measure();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (frame !== 0) window.cancelAnimationFrame(frame);
        };
    }, [targetRef]);

    return progress;
}
```

---

## `ArticleDetail.ReadingProgress`

The sticky bar. It owns the body `ref`, feeds it to `useReadingProgress`, and renders the
`Progress` primitive **fixed at the top, under the site header**, above page content.

- Position: `fixed top-0 left-0 right-0` (or `sticky` under the header) with a `z-*` above
  content but below any modal/overlay layer.
- Only the top bar is the **primary** indicator. A small circular `%` badge or an
  `"X min left"` label is an **optional enhancement** — recommended to keep the top bar as
  the single, quiet progress signal and add the circular readout only if the design later
  asks for it.

```tsx
/**
 * ArticleDetail.ReadingProgress
 *
 * @description
 * The slim reading-progress bar fixed under the site header. It reads the article body's
 * scroll position via useReadingProgress and renders the Progress primitive, filling
 * 0..100% as the body scrolls past the viewport. The body ref is shared with
 * ArticleDetail.Body so both measure the same element.
 */
export function ArticleDetailReadingProgress({ bodyRef }: ArticleDetailReadingProgressProps) {
    const progress = useReadingProgress(bodyRef);
    return (
        <div className="fixed inset-x-0 top-0 z-40">
            <Progress value={progress} className="rounded-none" />
        </div>
    );
}
```

> **One shared `ref`.** `ArticleDetail` (the assembler) creates the body ref and passes it
> to **both** `ArticleDetail.Body` (which attaches it to the `Prose` wrapper) and
> `ArticleDetail.ReadingProgress` (which measures it). The hook and the body agree on the
> same element by construction.

---

## Reused / new pieces

| Piece | Status | Notes |
|---|---|---|
| `Progress` (`shared/presentation/components/ui/Progress`) | **new** | Themed track + indicator, ARIA |
| `useReadingProgress` (`shared/presentation/hooks/useReadingProgress.ts`) | **new** | Generic, SSR-safe, rAF-throttled |
| `ArticleDetail.ReadingProgress` | **new** | Fixed bar wiring the two |

No new icon is required (the top-bar-only recommendation avoids a percent glyph). If the
optional circular readout is later adopted, no barrel icon is needed either — it is a
numeric label.

Full JSDoc'd snippets and the checklist are in
[specs/06-reading-progress.md](specs/06-reading-progress.md).
