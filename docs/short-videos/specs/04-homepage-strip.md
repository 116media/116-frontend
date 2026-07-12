# Spec 04 — Homepage Strip

Design ref: [../04-homepage-strip.md](../04-homepage-strip.md). The island container, the
horizontal scroll-snap strip, the 9:16 tile, and the homepage wiring.

---

## 1. Homepage wiring

`app/(public)/page.tsx` — insert one `<Suspense>` between the promotion feed and the
exclusive show. Read `node_modules/next/dist/docs/` first (customized Next 16).

```tsx
<Suspense fallback={<ArticlePromotionFeedLoading />}>
    <ArticlePromotionFeedContainer />
</Suspense>

<Suspense fallback={<ShortsFeedSectionLoading />}>
    <ShortsFeedSectionContainer />
</Suspense>

<Suspense fallback={<VideoExclusiveShowSplitLoading />}>
    <VideoExclusiveShowContainer variant="split" />
</Suspense>
```

## 2. `ShortsFeedSectionContainer` (island container)

`src/modules/shorts/presentation/containers/ShortsFeedSectionContainer/ShortsFeedSectionContainer.tsx`

Owns the client feed query, the modal open state, and the state fallbacks. `"use client"`
because it holds interaction state and the modal.

```tsx
"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { ShortsPlayer } from "@/modules/shorts/presentation/components/modals/ShortsPlayer";
import { ShortsStrip } from "@/modules/shorts/presentation/components/sections/ShortsStrip";
import { useShortsFeed } from "@/modules/shorts/presentation/hooks/useShortsFeed";

/**
 * ShortsFeedSectionContainer
 *
 * @description
 * Homepage shorts section: owns the infinite feed query shared by the strip and
 * the player, and the modal open index. Renders nothing when the feed is empty so
 * the homepage simply skips the section.
 */
export function ShortsFeedSectionContainer() {
    const { t } = useTranslation();
    const { data, isPending, isError, hasNextPage, fetchNextPage } = useShortsFeed();
    const [openAt, setOpenAt] = useState<number | null>(null);

    const shorts = useMemo(
        () => data?.pages.flatMap((page) => page.items) ?? [],
        [data]
    );

    if (isPending || isError) return null;
    if (shorts.length === 0) return null;

    return (
        <section aria-label={t("shorts.section.title")} className="flex flex-col gap-3">
            <header className="flex flex-col gap-0.5">
                <h2 className="font-semibold text-lg">{t("shorts.section.title")}</h2>
                <p className="text-muted-foreground text-sm">{t("shorts.section.subtitle")}</p>
            </header>

            <ShortsStrip shorts={shorts} onOpen={setOpenAt} />

            {openAt !== null && (
                <ShortsPlayer
                    shorts={shorts}
                    initialIndex={openAt}
                    hasNextPage={hasNextPage}
                    onLoadMore={fetchNextPage}
                    onClose={() => setOpenAt(null)}
                />
            )}
        </section>
    );
}
```

State handling: while `isPending`, the homepage shows `ShortsFeedSectionLoading` (the
`<Suspense>` / query fallback); on error or empty the section returns `null` (never an empty
shell). The loading shimmer:

`ShortsFeedSectionContainer.Loading.tsx` — a row of shimmer tiles at the strip dimensions.

## 3. `ShortsStrip`

`src/modules/shorts/presentation/components/sections/ShortsStrip/ShortsStrip.tsx`

A plain horizontal scroll-snap row — **not** a carousel.

```tsx
import { ShortCard } from "@/modules/shorts/presentation/components/cards/ShortCard";
import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";

/**
 * Props for the ShortsStrip component.
 *
 * @interface ShortsStripProps
 * @property {IShortVideoEntity[]} shorts - The shorts to show as tiles.
 * @property {(index: number) => void} onOpen - Opens the player at the tapped index.
 */
export interface ShortsStripProps {
    shorts: IShortVideoEntity[];
    onOpen: (index: number) => void;
}

/**
 * ShortsStrip
 *
 * @description
 * Horizontally scroll-snapping row of short tiles. Simple overflow scroll with
 * snap points — no arrows, dots, or carousel motion.
 */
export function ShortsStrip({ shorts, onOpen }: ShortsStripProps) {
    return (
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {shorts.map((short, index) => (
                <ShortCard
                    key={short.id}
                    short={short}
                    onOpen={() => onOpen(index)}
                    className="w-36 shrink-0 snap-start sm:w-40"
                />
            ))}
        </div>
    );
}
```

## 4. `ShortCard`

`src/modules/shorts/presentation/components/cards/ShortCard/ShortCard.tsx`

The 9:16 tile reusing the dashboard's short styling.

```tsx
import Image from "next/image";

import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";
import { PlayIcon } from "@/shared/presentation/components/ui/Icon";
import { formatCount } from "@/shared/presentation/utils/format/format.utils";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for the ShortCard component.
 *
 * @interface ShortCardProps
 * @property {IShortVideoEntity} short - The short this tile represents.
 * @property {() => void} onOpen - Opens the player focused on this short.
 * @property {string} [className] - Sizing/snap classes from the strip.
 */
export interface ShortCardProps {
    short: IShortVideoEntity;
    onOpen: () => void;
    className?: string;
}

/**
 * ShortCard
 *
 * @description
 * A 9:16 poster tile with a bottom scrim, title clamp, and view count. Tapping it
 * opens the full-screen player at this short.
 */
export function ShortCard({ short, onOpen, className }: ShortCardProps) {
    return (
        <button
            type="button"
            onClick={onOpen}
            className={cn(
                "group relative aspect-[9/16] overflow-hidden rounded-lg bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                className
            )}
        >
            {short.thumbnailUrl && (
                <Image
                    fill
                    src={short.thumbnailUrl}
                    alt={short.title}
                    sizes="160px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-2 text-left">
                <span className="line-clamp-2 font-medium text-sm text-white">{short.title}</span>
                <span className="flex items-center gap-1 text-white/80 text-xs">
                    <PlayIcon className="size-3" />
                    {formatCount(short.viewCount)}
                </span>
            </div>
        </button>
    );
}
```

---

## Tasks

- [ ] `<ShortsFeedSectionContainer>` inserted after the promotion Suspense, before the exclusive-show Suspense.
- [ ] Container owns `useShortsFeed`, flattens pages, holds `openAt`; returns `null` when empty/error.
- [ ] `ShortsStrip` is a scroll-snap row (no carousel); scrollbar hidden; edge-bleed handled.
- [ ] `ShortCard` is a 9:16 button with poster, scrim, title clamp, view count; keyboard-focusable ring.
- [ ] `ShortsFeedSectionLoading` shimmer row at tile dimensions.
- [ ] Tapping a tile opens `ShortsPlayer` at the right index.
- [ ] `next/image` usage verified against the customized Next 16 docs.
- [ ] `tsc` + biome clean.
</content>
