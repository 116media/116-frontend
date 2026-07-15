# Spec 07 — Shares

Design ref: [../08-shares.md](../08-shares.md). Both share hooks are **shipped** — documented
here as the contract, including the inert `platform` label and the fire-and-forget rule.

---

## 1. `useShareArticle` (shipped)

`src/modules/articles/presentation/hooks/useShareArticle.ts`

```ts
"use client";

import container from "@/shared/infrastructure/service.locator";

/**
 * useShareArticle
 *
 * @description
 * Opens the native share sheet for an article and, when available, records the share via
 * the share use case (fire-and-forget telemetry — failures are swallowed). Falls back to
 * copying the URL when the Web Share API is unavailable.
 *
 * @param articleId - The article being shared.
 * @param slug - The article slug (used to build the share URL).
 * @returns An async function that runs the share flow.
 */
export function useShareArticle(articleId: string, slug: string) {
    return async () => {
        const url = `${window.location.origin}/articles/${slug}`;
        if (navigator.share) {
            try {
                await navigator.share({ url });
            } catch {
                return;
            }
            container.cradle.shareArticleUseCase.execute({ articleId, platform: "web-share" });
            return;
        }
        await navigator.clipboard.writeText(url);
        container.cradle.shareArticleUseCase.execute({ articleId, platform: "clipboard" });
    };
}
```

---

## 2. `useShareVideo` (shipped)

`src/modules/videos/presentation/hooks/useShareVideo.ts`

```ts
"use client";

import { useQueryClient } from "@tanstack/react-query";

import type { IVideoDetailEntity } from "@/modules/videos/domain/entities/IVideoDetailEntity";
import { videoKeys } from "@/modules/videos/presentation/constants/videoKeys";
import container from "@/shared/infrastructure/service.locator";

/**
 * useShareVideo
 *
 * @description
 * Records a share event against the video, fire-and-forget: failures are swallowed so
 * telemetry never blocks the share surface, and the cached detail entity's `shareCount`
 * is bumped optimistically.
 *
 * @param videoId - The video the backend share event is recorded against.
 * @param slug - The video slug keying the cached detail entity.
 * @returns A `recordShare(platform)` function for the share modal.
 */
export function useShareVideo(videoId: string, slug: string) {
    const queryClient = useQueryClient();

    return (platform: string) => {
        void container.cradle.shareVideoUseCase.execute({ videoId, platform });
        queryClient.setQueryData<IVideoDetailEntity>(videoKeys.detail(slug), (current) =>
            current ? { ...current, shareCount: current.shareCount + 1 } : current
        );
    };
}
```

---

## Contract notes

- **`platform` is inert at the backend.** Both hooks pass a label; the repository impl sends
  only the content id (see [02-repository-and-usecases.md](02-repository-and-usecases.md)).
  Keep the label — it documents which target was used and is analytics-ready. Do not remove it.
- **Fire-and-forget.** The recording call is not awaited for feedback; its errors are caught
  (`useShareArticle`) or discarded via `void` (`useShareVideo`). No spinner, no failure toast.
- **Anonymous.** Share endpoints are `AllowAnonymous`; the hooks never gate through
  `useRequireAuth`.
- **Optimistic count.** `useShareVideo` bumps `shareCount` in the cache; it reconciles on the
  next detail fetch even if recording failed.

Share targets and copy (Facebook · X · WhatsApp · copy) live in the share rail
(`ArticleDetailShareRail`) and share modal (`VideoShareModal`) — both shipped, both resolving
labels through i18n ([09-i18n-and-notifications.md](09-i18n-and-notifications.md)).

---

## Tasks

- [ ] `useShareArticle` — Web Share API + clipboard fallback; records fire-and-forget.
- [ ] `useShareVideo` — records fire-and-forget; optimistic `shareCount` bump.
- [ ] `platform` label retained end-to-end but dropped before the network call.
- [ ] No auth gate on share; no failure toast.
- [ ] Share targets resolve through i18n; brand icons from `@icons-pack/react-simple-icons`.
- [ ] `tsc` + biome clean.
