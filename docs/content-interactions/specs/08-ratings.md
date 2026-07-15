# Spec 08 — Ratings

Design ref: [../09-ratings.md](../09-ratings.md). `useRateVideo` and `VideoRatingModal` are
**shipped** — documented here. The stars always open **unselected** (no `myRating` readback).

---

## 1. `useRateVideo` (shipped)

`src/modules/videos/presentation/hooks/useRateVideo.ts`

```ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { useRequireAuth } from "@/modules/auth/presentation/hooks/useRequireAuth";
import { videoKeys } from "@/modules/videos/presentation/constants/videoKeys";
import { RatingNotification } from "@/modules/videos/presentation/utils/notification/videos.rating.notification";
import type { Failure } from "@/shared/domain/failures/failure";
import container from "@/shared/infrastructure/service.locator";
import { showNotification } from "@/shared/presentation/utils/notification/notification.utils";

/**
 * useRateVideo
 *
 * @description
 * Auth-gated mutation that submits the user's star rating (1–5) for a video behind
 * `useRequireAuth`. On success it toasts and invalidates the cached detail entity so the
 * server-recomputed average and count come back.
 *
 * @param videoId - The video being rated.
 * @param slug - The video slug keying the cached detail entity.
 * @returns `{ submit, isPending }` for the rating stars.
 */
export function useRateVideo(videoId: string, slug: string) {
    const { t } = useTranslation();
    const requireAuth = useRequireAuth();
    const queryClient = useQueryClient();

    const mutation = useMutation<boolean, Failure, number>({
        mutationFn: async (stars) => {
            const result = await container.cradle.rateVideoUseCase.execute({ id: videoId, stars });
            if (!result.ok) throw result.error;
            return result.value;
        },
        onSuccess: () => {
            showNotification(RatingNotification.success(t));
            queryClient.invalidateQueries({ queryKey: videoKeys.detail(slug) });
        },
        onError: () => {
            showNotification(RatingNotification.failed(t));
        }
    });

    const submit = (stars: number) => requireAuth(() => mutation.mutate(stars));

    return { submit, isPending: mutation.isPending };
}
```

---

## 2. The star input (pattern)

An interactive 1–5 star row inside `VideoRatingModal`, hover-previewing and submitting on
click. Because there is no `myRating`, the initial selection is always 0.

```tsx
"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { StarIcon } from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for the RatingStars component.
 *
 * @interface RatingStarsProps
 * @property {(stars: number) => void} onRate - Fired with the chosen 1–5 value on click.
 * @property {boolean} disabled - Whether input is locked (submission in flight).
 */
export interface RatingStarsProps {
    onRate: (stars: number) => void;
    disabled: boolean;
}

/**
 * The five selectable star positions.
 */
const STARS = [1, 2, 3, 4, 5];

/**
 * RatingStars
 *
 * @description
 * Interactive 1–5 star input for the rating modal. Hover previews a value; click submits
 * it. Always opens unselected — the API exposes no prior per-user rating to seed from.
 */
export function RatingStars({ onRate, disabled }: RatingStarsProps) {
    const { t } = useTranslation();
    const [hover, setHover] = useState(0);

    return (
        <div className="flex items-center gap-1">
            {STARS.map((value) => (
                <button
                    key={value}
                    type="button"
                    disabled={disabled}
                    aria-label={t("videos.detail.rating.rateAria", { value })}
                    onMouseEnter={() => setHover(value)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => onRate(value)}
                    className="disabled:opacity-50"
                >
                    <StarIcon
                        className={cn(
                            "size-8 transition-colors",
                            value <= hover ? "fill-primary text-primary" : "text-muted-foreground"
                        )}
                    />
                </button>
            ))}
        </div>
    );
}
```

---

## Contract notes

- **Auth-gated.** `submit` runs behind `useRequireAuth`.
- **Not optimistic.** The aggregate is recomputed server-side, so success invalidates the
  detail query rather than guessing the new average.
- **Toasts.** Success + failure both toast via `RatingNotification` (unlike like/bookmark).
- **No prior selection.** With no `myRating`, the stars can't pre-highlight; a returning rater
  re-rates and the backend upserts. Closing this needs a backend `myRating` field
  ([../14-open-questions.md](../14-open-questions.md) G2).

---

## Tasks

- [ ] `useRateVideo` — auth-gated; success toast + detail invalidate; failure toast (shipped).
- [ ] `RatingStars` — hover preview, click submit, disabled while pending, always opens at 0.
- [ ] Aggregate `ratingAverage` / `ratingCount` read back from the invalidated detail entity.
- [ ] No optimistic average; no `myRating` assumption anywhere.
- [ ] `tsc` + biome clean.
