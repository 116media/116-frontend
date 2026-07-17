# Spec 07 — Interactions (Like + Share)

Design ref: [../07-interactions.md](../07-interactions.md). The action rail, the like button
(auth-gated, with double-tap burst), the share sheet, and the deferred bookmark drop-in.

---

## 1. Action rail

`src/modules/shorts/presentation/components/modals/ShortsPlayer/ShortsPlayer.ActionRail.tsx`

A vertical rail on the right of the slide: like (with count) and share (with count). Rendered
per slide, so it shows the slide's own counts.

```tsx
"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useRequireAuth } from "@/modules/auth/presentation/hooks/useRequireAuth";
import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";
import { useToggleShortLike } from "@/modules/shorts/presentation/hooks/useToggleShortLike";
import { ShortShareSheet } from "@/modules/shorts/presentation/components/modals/ShortShareSheet";
import { HeartIcon, ShareIcon } from "@/shared/presentation/components/ui/Icon";
import { formatCount } from "@/shared/presentation/utils/format/format.utils";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for the ShortsPlayerActionRail component.
 *
 * @interface ShortsPlayerActionRailProps
 * @property {IShortVideoEntity} short - The slide's short.
 * @property {boolean} liked - Session-local liked state (shared with the double-tap burst).
 * @property {number} likeCount - Live like count.
 * @property {() => void} onToggleLike - Auth-gated like toggle.
 */
export interface ShortsPlayerActionRailProps {
    short: IShortVideoEntity;
    liked: boolean;
    likeCount: number;
    onToggleLike: () => void;
}

/**
 * ShortsPlayerActionRail
 *
 * @description
 * Right-edge rail: an auth-gated like toggle and a share action, each stacked over
 * its live count. Sharing opens the share sheet.
 */
export function ShortsPlayerActionRail({
    short,
    liked,
    likeCount,
    onToggleLike
}: ShortsPlayerActionRailProps) {
    const { t } = useTranslation();
    const [shareOpen, setShareOpen] = useState(false);

    return (
        <div className="absolute right-2 bottom-24 flex flex-col items-center gap-4">
            <button
                type="button"
                onClick={onToggleLike}
                aria-pressed={liked}
                aria-label={t("shorts.actions.like")}
                className="flex flex-col items-center gap-1 text-white drop-shadow"
            >
                <HeartIcon className={cn("size-8", liked && "fill-destructive text-destructive")} />
                <span className="text-xs tabular-nums">{formatCount(likeCount)}</span>
            </button>

            <button
                type="button"
                onClick={() => setShareOpen(true)}
                aria-label={t("shorts.actions.share")}
                className="flex flex-col items-center gap-1 text-white drop-shadow"
            >
                <ShareIcon className="size-8" />
                <span className="text-xs tabular-nums">{formatCount(short.shareCount)}</span>
            </button>

            <ShortShareSheet
                open={shareOpen}
                short={short}
                onOpenChange={setShareOpen}
            />
        </div>
    );
}
```

The rail's like button and the double-tap gesture share **one** `useToggleShortLike`
instance (lifted into the slide), so both reflect the same `liked` / `count`. The slide owns
it and passes `liked` / `count` / an auth-gated `toggle` down to the rail and the tap layer:

```tsx
const requireAuth = useRequireAuth();
const { liked, count, toggle } = useToggleShortLike(short.id, short.likeCount);
const onToggleLike = () => requireAuth(toggle);
```

`useShortLikeWithBurst` (referenced in [06](06-gestures-and-shortcuts.md)) is a thin wrapper
that returns `{ liked, toggle, burst }` where `burst(fn)` shows the heart-burst then runs
`fn()`; it reuses the same `toggle`, so state stays single-sourced.

## 2. Share sheet

`src/modules/shorts/presentation/components/modals/ShortShareSheet/ShortShareSheet.tsx` —
reuses `SocialShareGroup` (emits `facebook`/`x`/`whatsapp`/`clipboard`/`webshare`) and
`useShareShort` to record + optimistically bump. Copy feedback via the notification config
([09](09-i18n-and-notifications.md)).

```tsx
const recordShare = useShareShort(short.id);

<SocialShareGroup
    url={shortShareUrl(short.slug)}
    title={short.title}
    onShared={(channel) => {
        recordShare(channel);
        if (channel === "clipboard") showNotification(ShortShareNotification.linkCopied(t));
    }}
/>
```

`shortShareUrl(slug)` builds the shareable link. With no deep-link route in this cut, use the
homepage URL with a `?short={slug}` param (a small `shorts.utils.ts` helper); swap to
`/shorts/{slug}` when that route ships. Channel identifiers pass straight through — no mapper.

## 3. Deferred — bookmark drop-in

Not built this cut. When enabled: `useToggleShortBookmark` (mirrors `useToggleShortLike` over
`publicBookmarkShortVideo` / `publicUnbookmarkShortVideo`, auth-gated, `initialBookmarked =
false`) and a rail item with `BookmarkIcon` + active `fill-primary`. Backend + DTO
(`bookmarkCount`) already support it.

---

## Tasks

- [ ] Slide owns one `useToggleShortLike`; rail + double-tap share its `liked`/`count`/`toggle`.
- [ ] Like button auth-gated via `useRequireAuth`; `aria-pressed` + `aria-label`; active `fill-destructive`.
- [ ] Like never toasts; seeds unfilled (`initialLiked = false`).
- [ ] Share rail item opens the share sheet; count via `formatCount`.
- [ ] `ShortShareSheet` reuses `SocialShareGroup` + `useShareShort`; channels passed through, no mapper.
- [ ] Clipboard share fires `ShortShareNotification.linkCopied`; other channels silent.
- [ ] `shortShareUrl` helper; interim `?short={slug}` link documented.
- [ ] No comment control anywhere on the rail.
- [ ] Bookmark left deferred (spec noted).
- [ ] `tsc` + biome clean.
</content>
