# Spec 04 — Likes

Design ref: [../05-likes.md](../05-likes.md). The article like is **shipped** — reproduced
here as the contract. Reused: `useToggle`, `useRequireAuth`, the barrel `HeartIcon`.

---

## 1. `useToggleArticleLike` (shipped)

`src/modules/articles/presentation/hooks/useToggleArticleLike.ts`

```ts
"use client";

import container from "@/shared/infrastructure/service.locator";
import { runInteraction, useToggle } from "@/shared/presentation/hooks/useToggle";

/**
 * useToggleArticleLike
 *
 * @description
 * Optimistic like toggle for one article, wrapping {@link useToggle} over the like /
 * unlike use cases. `initialLiked` seeds the toggle from the entity's per-user `isLiked`
 * flag; it defaults to false on surfaces without the flag.
 *
 * @param articleId - The article to like/unlike.
 * @param initialCount - The entity's `likeCount` baseline.
 * @param initialLiked - The entity's per-user `isLiked` baseline. Defaults to false.
 * @returns `{ liked, count, toggle }` for the like button.
 */
export function useToggleArticleLike(
    articleId: string,
    initialCount: number,
    initialLiked = false
) {
    const { on, count, toggle } = useToggle(
        initialCount,
        (next) =>
            runInteraction(() =>
                (next
                    ? container.cradle.likeArticleUseCase
                    : container.cradle.unlikeArticleUseCase
                ).execute(articleId)
            ),
        initialLiked
    );
    return { liked: on, count, toggle };
}
```

---

## 2. The like button (pattern)

Wherever a like is actionable (`ArticleCard.Engagement`, `ArticleDetail.Engagement`), the
button is auth-gated and token-styled. Contract:

```tsx
"use client";

import { useRequireAuth } from "@/modules/auth/presentation/hooks/useRequireAuth";
import { useToggleArticleLike } from "@/modules/articles/presentation/hooks/useToggleArticleLike";
import { HeartIcon } from "@/shared/presentation/components/ui/Icon";
import { formatCount } from "@/shared/presentation/utils/format/format.utils";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for the InteractionLikeButton component.
 *
 * @interface InteractionLikeButtonProps
 * @property {string} articleId - The article to like.
 * @property {number} likeCount - The baseline like count.
 * @property {boolean} [isLiked] - The per-viewer like baseline (detail surfaces only).
 */
export interface InteractionLikeButtonProps {
    articleId: string;
    likeCount: number;
    isLiked?: boolean;
}

/**
 * InteractionLikeButton
 *
 * @description
 * Auth-gated optimistic like button: fills the heart while liked, shows the live count,
 * and opens the auth modal for logged-out taps before resuming the like.
 */
export function InteractionLikeButton({ articleId, likeCount, isLiked }: InteractionLikeButtonProps) {
    const requireAuth = useRequireAuth();
    const { liked, count, toggle } = useToggleArticleLike(articleId, likeCount, isLiked);

    return (
        <button
            type="button"
            aria-pressed={liked}
            aria-label="Like"
            onClick={() => requireAuth(toggle)}
            className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
            <HeartIcon className={cn("size-5", liked && "fill-destructive text-destructive")} />
            <span className="text-sm tabular-nums">{formatCount(count)}</span>
        </button>
    );
}
```

---

## Behaviour notes

- **No toast.** Success and failure are both silent; the flip / rollback is the feedback.
- **Idempotency isn't relied on** for article likes (the backend 409s a re-like) — the UI
  never re-likes because the icon already reflects `liked`. If a rollback puts the icon back,
  a subsequent tap is a fresh, correct request.
- **`aria-pressed`** reflects the liked state for assistive tech.

---

## Tasks

- [ ] `useToggleArticleLike` present and wired to the like/unlike use cases (shipped).
- [ ] Like button auth-gated via `useRequireAuth`.
- [ ] Active state `fill-destructive`; count via `formatCount`; `aria-pressed` + `aria-label`.
- [ ] No success/failure toast on like.
- [ ] `tsc` + biome clean.
