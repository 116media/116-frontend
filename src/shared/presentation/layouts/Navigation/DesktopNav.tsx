"use client";

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { ArticlesMegaMenu } from "@/modules/articles/presentation/components/ArticlesMegaMenu";
import type { ArticlesMegaMenuProps } from "@/modules/articles/presentation/components/ArticlesMegaMenu/types";
import { VideosMegaMenu } from "@/modules/videos/presentation/components/VideosMegaMenu";
import type { VideosMegaMenuProps } from "@/modules/videos/presentation/components/VideosMegaMenu/types";
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
import { cn } from "@/shared/presentation/utils/cn";

interface DesktopNavProps {
    articles: ArticlesMegaMenuProps;
    videos: VideosMegaMenuProps;
}

/**
 * DesktopNav
 *
 * @description
 * Centre section of the Header for desktop viewports.
 * Renders primary nav links using Radix UI NavigationMenu so that
 * NEWS and VIDEOS items open mega menu panels on hover.
 * LYRICS and ARTISTES remain plain links with no sub-menu.
 * All mega menu data is prefetched server-side in PublicLayout and
 * passed in as props — no data fetching happens inside this component.
 * A search icon button sits to the right of the link group.
 */
export function DesktopNav({ articles, videos }: DesktopNavProps) {
    return (
        <div className="hidden items-center gap-1 md:flex">
            <NavigationMenu>
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
                                    <NavigationMenuContent>
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
