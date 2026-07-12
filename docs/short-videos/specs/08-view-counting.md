# Spec 08 — View Counting

Design ref: [../08-view-counting.md](../08-view-counting.md). The engagement gate that fires
one deduplicated view per short per modal session. Uses `useRecordShortView`
([03-hooks-and-keys.md](03-hooks-and-keys.md)); the `X-Device-Id` header is already attached
by the existing `deviceIdInterceptor`.

---

## 1. Constant

```ts
/**
 * Continuous active-playback time (ms) a short must accrue before a view event
 * fires — the engagement gate.
 */
export const VIEW_ENGAGEMENT_MS = 2000;
```

## 2. The gate — `useShortViewGate`

Lives in the player (owned by `ShortsPlayer` or the slide). Fires once per short per modal
session; a `Set` guards re-fires while swiping back and forth. Held in the provider so it
persists across slide mounts, or in a ref at the shell level.

```tsx
"use client";

import { useEffect, useRef } from "react";

import { VIEW_ENGAGEMENT_MS } from "@/modules/shorts/presentation/constants/gestures";
import { useRecordShortView } from "@/modules/shorts/presentation/hooks/useRecordShortView";

/**
 * useShortViewGate
 *
 * @description
 * Fires a single deduplicated view event for a short once it has been the active,
 * playing slide for VIEW_ENGAGEMENT_MS. A per-session Set prevents re-firing when
 * the reader swipes back to an already-counted short; the timer resets if the
 * short is paused or swiped away before the threshold.
 *
 * @param shortId - The active short.
 * @param isActive - Whether this short is in view.
 * @param isPlaying - Whether playback is running.
 */
export function useShortViewGate(shortId: string, isActive: boolean, isPlaying: boolean) {
    const recordView = useRecordShortView();
    const fired = useRef<Set<string>>(new Set());
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const clear = () => {
            if (timer.current) {
                clearTimeout(timer.current);
                timer.current = null;
            }
        };

        if (isActive && isPlaying && !fired.current.has(shortId)) {
            timer.current = setTimeout(() => {
                fired.current.add(shortId);
                recordView(shortId);
            }, VIEW_ENGAGEMENT_MS);
        } else {
            clear();
        }

        return clear;
    }, [shortId, isActive, isPlaying, recordView]);
}
```

Usage in the slide (or driven from the provider's active index):

```tsx
useShortViewGate(short.id, isActive, isPlaying);
```

## 3. What does not happen

- **No view count in the request path** — the endpoint reads `X-Device-Id` / IP /
  `User-Agent` server-side; nothing extra is sent from the call site.
- **No optimistic bump** of `viewCount` — the dedup window means an optimistic increment is
  often wrong; views reconcile on the next feed fetch.
- **Strip tiles never fire views** — only active playback in the player counts.

---

## Tasks

- [ ] `VIEW_ENGAGEMENT_MS = 2000` constant added.
- [ ] `useShortViewGate` fires once per short per session (Set guard); timer resets on pause/leave.
- [ ] Fires only for the active, playing slide; strip never fires.
- [ ] `X-Device-Id` confirmed attached by `deviceIdInterceptor` (no per-call work).
- [ ] Fire-and-forget; `{ isCounted:false }` not treated as an error; no optimistic view bump.
- [ ] `tsc` + biome clean.
</content>
