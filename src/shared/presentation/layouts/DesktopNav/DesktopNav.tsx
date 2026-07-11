"use client";

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { type MouseEvent, useState } from "react";
import { ArticlesMegaMenu } from "@/modules/articles/presentation/components/navigation/ArticlesMegaMenu";
import type { ArticlesMegaMenuProps } from "@/modules/articles/presentation/components/navigation/ArticlesMegaMenu/types";
import { VideosMegaMenu } from "@/modules/videos/presentation/components/navigation/VideosMegaMenu";
import type { VideosMegaMenuProps } from "@/modules/videos/presentation/components/navigation/VideosMegaMenu/types";
import { Button } from "@/shared/presentation/components/ui/Button";
import { ChevronDownIcon, SearchIcon } from "@/shared/presentation/components/ui/Icon";

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuViewport
} from "@/shared/presentation/components/ui/NavigationMenu";
import { NAV_LINKS } from "@/shared/presentation/layouts/Header/constants";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for the DesktopNav component.
 *
 * @interface DesktopNavProps
 * @property {VideosMegaMenuProps} videos - Prefetched data for the videos mega menu.
 * @property {ArticlesMegaMenuProps} articles - Prefetched data for the articles mega menu.
 */
export interface DesktopNavProps {
    videos: VideosMegaMenuProps;
    articles: ArticlesMegaMenuProps;
}

/**
 * DesktopNav
 *
 * @description
 * Centre section of the Header for desktop viewports: primary nav links via Radix
 * NavigationMenu, with mega menu panels on hover for NEWS and VIDEOS. Mega menu data
 * is prefetched server-side in PublicLayout and passed in as props.
 */
export function DesktopNav({ articles, videos }: DesktopNavProps) {
    const [openMenu, setOpenMenu] = useState("");

    const closeOnLinkClick = (event: MouseEvent<HTMLDivElement>) => {
        if ((event.target as HTMLElement).closest("a")) setOpenMenu("");
    };

    return (
        <div className="hidden items-center gap-1 md:flex">
            <NavigationMenu
                value={openMenu}
                onValueChange={setOpenMenu}
            >
                <NavigationMenuList>
                    {NAV_LINKS.map(({ label, href, hasMegaMenu }) => (
                        <NavigationMenuItem
                            key={href}
                            value={hasMegaMenu ? label : undefined}
                        >
                            {hasMegaMenu ? (
                                <>
                                    <NavigationMenuPrimitive.Trigger asChild>
                                        <Link
                                            href={href}
                                            className={cn(
                                                "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors",
                                                "hover:bg-accent hover:text-accent-foreground",
                                                "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                                            )}
                                        >
                                            {label}
                                            <ChevronDownIcon
                                                size={14}
                                                className="text-muted-foreground transition-transform duration-200 data-[state=open]:rotate-180"
                                                aria-hidden="true"
                                            />
                                        </Link>
                                    </NavigationMenuPrimitive.Trigger>
                                    <NavigationMenuContent onClick={closeOnLinkClick}>
                                        {label === "NEWS" ? (
                                            <ArticlesMegaMenu {...articles} />
                                        ) : (
                                            <VideosMegaMenu {...videos} />
                                        )}
                                    </NavigationMenuContent>
                                </>
                            ) : (
                                <NavigationMenuLink asChild>
                                    <Link
                                        href={href}
                                        className={cn(
                                            "flex items-center rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors",
                                            "hover:bg-accent hover:text-accent-foreground"
                                        )}
                                    >
                                        {label}
                                    </Link>
                                </NavigationMenuLink>
                            )}
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
                <NavigationMenuViewport />
            </NavigationMenu>

            <div
                aria-hidden="true"
                className="ml-2 h-8 w-px bg-border"
            />

            <Button
                size="icon"
                variant="ghost"
                aria-label="Rechercher"
                className="text-muted-foreground hover:text-foreground"
            >
                <SearchIcon />
            </Button>
        </div>
    );
}
