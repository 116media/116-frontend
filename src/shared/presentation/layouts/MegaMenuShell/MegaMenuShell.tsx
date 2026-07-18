"use client";

import { useTranslation } from "react-i18next";
import { Tag } from "@/shared/presentation/components/ui/Tag";

/**
 * @interface MegaMenuTagItem
 *
 * @property {string} id - Unique identifier
 * @property {string} name - Display name of the tag
 */
export interface MegaMenuTagItem {
    id: string;
    name: string;
}

/**
 * @interface MegaMenuShellProps
 *
 * @property {string} tagsBasePath - Base path used to build tag filter URLs
 * @property {MegaMenuTagItem[]} popularTags - Popular tags rendered in the right column
 * @property {React.ReactNode} children - Column slots: MegaMenuShell.Categories + MegaMenuShell.Cards
 */
export interface MegaMenuShellProps {
    tagsBasePath: string;
    children: React.ReactNode;
    popularTags: MegaMenuTagItem[];
}

/**
 * MegaMenuShell
 *
 * @description
 * Root compound component for the shared 3-column mega menu layout. Owns the wrapper
 * and right-column tags; MegaMenuShell.Categories and MegaMenuShell.Cards fill the slots.
 */
export function MegaMenuShell({ tagsBasePath, popularTags, children }: MegaMenuShellProps) {
    const { t } = useTranslation();

    return (
        <div className="w-full">
            <div className="mx-auto grid max-w-7xl grid-cols-[2fr_5fr] gap-0 px-4 sm:px-6 lg:grid-cols-[3fr_5fr_3fr] lg:px-8 xl:px-10 3xl:max-w-8xl">
                {children}

                {popularTags.length > 0 && (
                    <div className="hidden lg:flex lg:flex-col lg:gap-2 lg:p-3 lg:pl-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {t("general.popularTags")}
                        </p>
                        <div className="mb-1 h-px bg-border/60" />
                        <div className="flex flex-wrap gap-1.5">
                            {popularTags.slice(0, 16).map((tag) => (
                                <Tag
                                    size="lg"
                                    prefix="#"
                                    shape="pill"
                                    key={tag.id}
                                    variant="default"
                                    href={`${tagsBasePath}?tagId=${tag.id}`}
                                >
                                    {tag.name}
                                </Tag>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
