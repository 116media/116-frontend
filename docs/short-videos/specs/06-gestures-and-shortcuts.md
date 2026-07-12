# Spec 06 — Gestures & Shortcuts

Design ref: [../06-gestures-and-shortcuts.md](../06-gestures-and-shortcuts.md). Swipe/arrow/
keyboard navigation, single-tap pause, double-tap like — layered onto the slide and the
shell.

---

## 1. Constants

`src/modules/shorts/presentation/constants/shortKeys.ts` (append) or a small `gestures.ts`:

```ts
/**
 * Max delay (ms) between two taps to register a double tap (like) rather than a
 * single tap (pause).
 */
export const DOUBLE_TAP_MS = 250;

/**
 * Pointer travel (px) beyond which a gesture is treated as a swipe, not a tap.
 */
export const TAP_MOVE_TOLERANCE = 10;
```

## 2. Tap layer — single vs double tap

Inside `ShortsPlayer.Slide`, an absolutely-positioned tap surface sits **under** the action
rail and nav (which `stopPropagation`), so taps on buttons never pause the video.

```tsx
"use client";

import { useRef } from "react";

import { DOUBLE_TAP_MS, TAP_MOVE_TOLERANCE } from "@/modules/shorts/presentation/constants/gestures";

/**
 * useShortTapGestures
 *
 * @description
 * Disambiguates single tap (pause/unpause) from double tap (like). A pending
 * single-tap timer is cleared when a second tap arrives within DOUBLE_TAP_MS, so a
 * double tap never also pauses. Pointer travel beyond the tolerance is ignored as
 * a swipe.
 *
 * @param onSingleTap - Pause/unpause the active short.
 * @param onDoubleTap - Like the active short (with burst).
 * @returns Pointer handlers to spread onto the tap surface.
 */
export function useShortTapGestures(onSingleTap: () => void, onDoubleTap: () => void) {
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const start = useRef<{ x: number; y: number } | null>(null);

    const onPointerDown = (e: React.PointerEvent) => {
        start.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: React.PointerEvent) => {
        const from = start.current;
        start.current = null;
        if (
            from &&
            (Math.abs(e.clientX - from.x) > TAP_MOVE_TOLERANCE ||
                Math.abs(e.clientY - from.y) > TAP_MOVE_TOLERANCE)
        ) {
            return;
        }
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
            onDoubleTap();
            return;
        }
        timer.current = setTimeout(() => {
            timer.current = null;
            onSingleTap();
        }, DOUBLE_TAP_MS);
    };

    return { onPointerDown, onPointerUp };
}
```

Slide usage:

```tsx
const { togglePlay } = useShortsPlayer();
const { liked, toggle, burst } = useShortLikeWithBurst(short);
const tap = useShortTapGestures(togglePlay, () => burst(() => !liked && toggle()));

<div className="absolute inset-0" {...tap} />
```

Double tap always plays the burst; it only calls `toggle()` when not already liked (Instagram
behaviour — double tap never unlikes). Unlike is done from the rail heart.

## 3. Navigation — arrows + keyboard

`ShortsPlayer.Nav.tsx` — the up/down arrow buttons. Note the deliberate glyph/direction
convention: **up chevron → previous**, **down chevron → next** (design doc §Navigation).

```tsx
"use client";

import { useTranslation } from "react-i18next";

import { useShortsPlayer } from "@/modules/shorts/presentation/context/ShortsPlayerProvider";
import { ChevronUpIcon, ChevronDownIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * ShortsPlayerNav
 *
 * @description
 * Up/down arrow buttons stacked at the stage edge: up goes to the previous short,
 * down to the next. Disabled at the feed bounds.
 */
export function ShortsPlayerNav() {
    const { t } = useTranslation();
    const { activeIndex, shorts, goPrev, goNext } = useShortsPlayer();

    return (
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 flex-col gap-2">
            <button
                type="button"
                onClick={goPrev}
                disabled={activeIndex === 0}
                aria-label={t("shorts.player.previous")}
                className="rounded-full bg-black/40 p-2 text-white disabled:opacity-40"
            >
                <ChevronUpIcon className="size-5" />
            </button>
            <button
                type="button"
                onClick={goNext}
                disabled={activeIndex === shorts.length - 1}
                aria-label={t("shorts.player.next")}
                className="rounded-full bg-black/40 p-2 text-white disabled:opacity-40"
            >
                <ChevronDownIcon className="size-5" />
            </button>
        </div>
    );
}
```

Keyboard handling lives in the shell (or a `useShortKeyboardNav` hook): `ArrowDown` → next,
`ArrowUp` → prev, `Space` → togglePlay (preventDefault), `Escape` → close. With the scroll-snap
track, `goTo` scrolls the target slide into view (`scrollIntoView({ behavior: "smooth" })`);
the observer then settles the active index.

## 4. Reduced motion

Respect `prefers-reduced-motion`: the like-burst and smooth `scrollIntoView` degrade to
instant (`behavior: "auto"`, no burst scale animation).

---

## Tasks

- [ ] `DOUBLE_TAP_MS` / `TAP_MOVE_TOLERANCE` constants added.
- [ ] `useShortTapGestures`: single tap pauses, double tap likes+bursts, double never pauses, swipe ignored.
- [ ] Tap surface sits under the rail/nav; buttons `stopPropagation` so they never pause.
- [ ] Double tap bursts always; toggles like only when not already liked (never unlikes).
- [ ] `ShortsPlayer.Nav`: up=prev, down=next, disabled at bounds, `aria-label`ed.
- [ ] Keyboard: `ArrowDown`/`ArrowUp` navigate, `Space` pauses, `Escape` closes.
- [ ] `scrollIntoView` used for arrow/key nav; observer settles the active index.
- [ ] `prefers-reduced-motion` honored.
- [ ] `tsc` + biome clean.
</content>
