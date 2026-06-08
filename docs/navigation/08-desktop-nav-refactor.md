# DesktopNav Refactor

## Overview

The current `DesktopNav` renders all four navigation items as plain `<Link>` elements and shows a static `<ChevronDown>` icon for items with `hasMegaMenu: true`. The icon is cosmetic only — there is no panel behaviour.

The refactor replaces the plain links for NEWS and VIDEOS with a `NavigationMenuTrigger` + `NavigationMenuContent` pair. LYRICS and ARTISTES remain as plain `NavigationMenuLink` wrappers. The search button and divider are unchanged.

All mega menu data is fetched server-side in the root layout and passed down through `Header` → `DesktopNav` → the individual mega menu components. See [Server Prefetch](09-server-prefetch.md) for the full fetch strategy.

## Before

```typescript
// src/shared/presentation/layouts/Navigation/DesktopNav.tsx (before)
export function DesktopNav() {
    return (
        <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map(({ label, href, hasMegaMenu }) => (
                <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                    {label}
                    {hasMegaMenu && (
                        <ChevronDown size={14} className="text-muted-foreground" />
                    )}
                </Link>
            ))}
            <div className="ml-2 h-8 w-px bg-border" aria-hidden="true" />
            <Button size="icon" variant="ghost" aria-label="Rechercher">
                <Search />
            </Button>
        </div>
    );
}
```

## After

```typescript
// src/shared/presentation/layouts/Navigation/DesktopNav.tsx (after)
"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/shared/presentation/components/ui/Button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport
} from "@/shared/presentation/components/ui/NavigationMenu";
import { ArticlesMegaMenu } from "@/modules/articles/presentation/components/ArticlesMegaMenu";
import { VideosMegaMenu } from "@/modules/videos/presentation/components/VideosMegaMenu";
import { NAV_LINKS } from "@/shared/presentation/layouts/Header/constants";
import type { IArticleCategoryEntity } from "@/modules/articles/domain/entities/IArticleCategoryEntity";
import type { IArticleSummaryEntity } from "@/modules/articles/domain/entities/IArticleSummaryEntity";
import type { IArticlePopularTagEntity } from "@/modules/articles/domain/entities/IArticlePopularTagEntity";
import type { IVideoCategoryEntity } from "@/modules/videos/domain/entities/IVideoCategoryEntity";
import type { IVideoSummaryEntity } from "@/modules/videos/domain/entities/IVideoSummaryEntity";
import type { IVideoPopularTagEntity } from "@/modules/videos/domain/entities/IVideoPopularTagEntity";

interface DesktopNavProps {
    articleCategories: IArticleCategoryEntity[];
    promotedArticles: IArticleSummaryEntity[];
    articlePopularTags: IArticlePopularTagEntity[];
    videoCategories: IVideoCategoryEntity[];
    promotedVideos: IVideoSummaryEntity[];
    videoPopularTags: IVideoPopularTagEntity[];
}

/**
 * DesktopNav
 *
 * @description
 * Centre section of the Header for desktop viewports.
 * NEWS and VIDEOS open a mega menu panel on hover via NavigationMenu (Radix UI).
 * LYRICS and ARTISTES are plain links with no sub-panel.
 * All mega menu data is prefetched server-side in the root layout and passed in
 * as props — no data fetching happens inside this component.
 */
export function DesktopNav({
    articleCategories,
    promotedArticles,
    articlePopularTags,
    videoCategories,
    promotedVideos,
    videoPopularTags
}: DesktopNavProps) {
    return (
        <div className="hidden items-center gap-1 md:flex">
            <NavigationMenu>
                <NavigationMenuList>
                    {NAV_LINKS.map(({ label, href, hasMegaMenu }) => (
                        <NavigationMenuItem key={href}>
                            {hasMegaMenu ? (
                                <>
                                    <NavigationMenuTrigger>{label}</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        {label === "NEWS" ? (
                                            <ArticlesMegaMenu
                                                categories={articleCategories}
                                                promotedArticles={promotedArticles}
                                                popularTags={articlePopularTags}
                                            />
                                        ) : (
                                            <VideosMegaMenu
                                                categories={videoCategories}
                                                promotedVideos={promotedVideos}
                                                popularTags={videoPopularTags}
                                            />
                                        )}
                                    </NavigationMenuContent>
                                </>
                            ) : (
                                <NavigationMenuLink asChild>
                                    <Link href={href}>{label}</Link>
                                </NavigationMenuLink>
                            )}
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
                <NavigationMenuViewport />
            </NavigationMenu>

            <div className="ml-2 h-8 w-px bg-border" aria-hidden="true" />

            <Button
                size="icon"
                variant="ghost"
                aria-label="Rechercher"
                className="text-muted-foreground hover:text-foreground"
            >
                <Search />
            </Button>
        </div>
    );
}
```

## Why "use client"

`DesktopNav` becomes a client component because `NavigationMenu` from `@radix-ui/react-navigation-menu` manages hover/open state internally using React state. The mega menu components themselves are now purely presentational and do not use any client-only APIs — but since they are rendered inside `DesktopNav`, they inherit the `"use client"` boundary.

The `Header` component that imports `DesktopNav` remains a server component — the boundary does not propagate upward.

## Popular Tags Are Per-Module, Not Shared

`articlePopularTags` and `videoPopularTags` are fetched separately in the layout and passed to their respective mega menu components. The popular tags endpoint accepts an optional `contentType` filter — the articles panel passes `contentType=Article` and the videos panel passes `contentType=Video`, so each panel shows tags that are actually popular within its own content type.

## NAV_LINKS Constants

No changes to `NAV_LINKS`. The `hasMegaMenu` boolean is already correct:

```typescript
// src/shared/presentation/layouts/Header/constants.ts
export const NAV_LINKS = [
    { label: "NEWS",     href: ARTICLES_PATH, hasMegaMenu: true  },
    { label: "VIDEOS",   href: VIDEOS_PATH,   hasMegaMenu: true  },
    { label: "LYRICS",   href: LYRICS_PATH,   hasMegaMenu: false },
    { label: "ARTISTES", href: ARTISTES_PATH, hasMegaMenu: false }
] as const;
```

## Mega Menu Panel Identification

The `label === "NEWS"` check inside `NavigationMenuContent` maps the nav label to its mega menu component. If the nav labels ever change, this check must be updated. A more robust alternative is to add a `MegaMenu` component key to `NAV_LINKS`:

```typescript
// alternative — add optional MegaMenu key to NAV_LINKS
import type { ComponentType } from "react";
import type { ArticlesMegaMenuProps } from "@/modules/articles/presentation/components/ArticlesMegaMenu/types";
import type { VideosMegaMenuProps } from "@/modules/videos/presentation/components/VideosMegaMenu/types";

export const NAV_LINKS = [
    { label: "NEWS",     href: ARTICLES_PATH, MegaMenu: ArticlesMegaMenu },
    { label: "VIDEOS",   href: VIDEOS_PATH,   MegaMenu: VideosMegaMenu   },
    { label: "LYRICS",   href: LYRICS_PATH                               },
    { label: "ARTISTES", href: ARTISTES_PATH                             }
];
```

This keeps `DesktopNav` decoupled from the module import path logic. Either approach works.
