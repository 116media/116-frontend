# Spec 06 — Reading Progress

Design ref: [../07-reading-progress.md](../07-reading-progress.md).

The shared `Progress` primitive, the shared `useReadingProgress` hook, and
`ArticleDetail.ReadingProgress`. `Progress` and the hook are **generic** and live in
`shared`; only the bar wiring lives in the `articles` slice. JSDoc-only, theme tokens only.

---

## 1. `Progress` primitive

`src/shared/presentation/components/ui/Progress/index.tsx` — none exists.

```tsx
import type { HTMLAttributes } from "react";

import { cn } from "@/shared/presentation/utils/cn";

/**
 * Props for the Progress component.
 *
 * @interface ProgressProps
 * @augments HTMLAttributes<HTMLDivElement>
 * @property {number} value - The current progress, 0..100 (clamped).
 */
export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
    value: number;
}

/**
 * Progress
 *
 * @description
 * A slim themed progress bar. A muted track holds a primary-colored indicator whose width
 * tracks `value` (0..100, clamped). Exposes the progressbar ARIA role and value bounds.
 * Colors are theme tokens; only the indicator width is inline, a computed geometric value.
 *
 * @param value - The current progress, 0..100 (clamped).
 * @param className - Extra classes merged onto the track.
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

---

## 2. `useReadingProgress` hook

`src/shared/presentation/hooks/useReadingProgress.ts`. Generic, SSR-safe, rAF-throttled,
passive listeners, full cleanup.

```ts
import { type RefObject, useEffect, useState } from "react";

/**
 * useReadingProgress
 *
 * @description
 * Tracks how far a target element (typically the article body) has scrolled past the
 * viewport, as a 0..100 percentage. The percentage is the fraction of the element that has
 * passed the bottom of the viewport: 0 at the element's top, 100 once its bottom reaches
 * the viewport bottom. Scroll and resize handlers are rAF-throttled and passive; all window
 * access is guarded so the hook is SSR-safe and returns 0 on the server. Listeners and any
 * pending animation frame are cleaned up on unmount.
 *
 * @param targetRef - A ref to the element whose reading progress is measured.
 * @returns The reading progress, 0..100.
 */
export function useReadingProgress(targetRef: RefObject<HTMLElement | null>): number {
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

## 3. `ArticleDetail.ReadingProgress.tsx`

`src/modules/articles/presentation/components/ArticleDetail/ArticleDetail.ReadingProgress.tsx`.

```tsx
import type { RefObject } from "react";

import { Progress } from "@/shared/presentation/components/ui/Progress";
import { useReadingProgress } from "@/shared/presentation/hooks/useReadingProgress";

/**
 * Props for the ArticleDetail.ReadingProgress component.
 *
 * @interface ArticleDetailReadingProgressProps
 * @property {RefObject<HTMLDivElement | null>} bodyRef - Ref to the article body element,
 * shared with ArticleDetail.Body so both measure the same element.
 */
export interface ArticleDetailReadingProgressProps {
    bodyRef: RefObject<HTMLDivElement | null>;
}

/**
 * ArticleDetail.ReadingProgress
 *
 * @description
 * The slim reading-progress bar fixed under the site header. It reads the article body's
 * scroll position via useReadingProgress and renders the Progress primitive, filling
 * 0..100% as the body scrolls past the viewport. The body ref is shared with
 * ArticleDetail.Body so both measure the same element. A circular percent readout is a
 * possible enhancement but is intentionally left out to keep a single quiet progress signal.
 *
 * @param bodyRef - Ref to the article body element.
 */
export function ArticleDetailReadingProgress({
    bodyRef
}: ArticleDetailReadingProgressProps) {
    const progress = useReadingProgress(bodyRef);
    return (
        <div className="fixed inset-x-0 top-0 z-40">
            <Progress value={progress} className="rounded-none" />
        </div>
    );
}
```

> **Shared ref.** `ArticleDetail` (the assembler, page-and-layout spec) creates the body
> ref with `useRef<HTMLDivElement>(null)` and passes it to both `ArticleDetail.Body` and
> `ArticleDetail.ReadingProgress`. Because `ArticleDetail.ReadingProgress` reads scroll
> position, the assembler renders it inside a client boundary.

---

## Tasks

- [ ] `Progress` primitive created — `bg-muted` track, `bg-primary` indicator, `h-1`,
      `rounded`, value clamped 0..100, `role="progressbar"` + `aria-valuenow/min/max`.
- [ ] `Progress` indicator width is the only inline style; all colors are theme tokens.
- [ ] `useReadingProgress` created in shared hooks — takes a ref, returns 0..100.
- [ ] Handler is rAF-throttled; `scroll` and `resize` listeners are passive.
- [ ] SSR-safe — `window`/`document` access guarded; returns 0 on the server.
- [ ] Cleanup removes both listeners and cancels any pending frame on unmount.
- [ ] `ArticleDetail.ReadingProgress` renders the bar `fixed` under the header (`z-40`),
      fed by `useReadingProgress`.
- [ ] Bar reads 0 at the article top and reaches 100 when the body bottom hits the viewport
      bottom; verified by scrolling.
- [ ] `tsc` + biome clean.
