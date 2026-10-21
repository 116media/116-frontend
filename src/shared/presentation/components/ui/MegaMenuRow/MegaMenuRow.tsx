"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { Badge } from "@/shared/presentation/components/ui/Badge";
import { ChevronRightIcon } from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for the MegaMenuRow component.
 *
 * @interface MegaMenuRowProps
 * @property {string} href - Where the row navigates.
 * @property {string} label - The row's visible text.
 * @property {ReactNode} [icon] - Glyph leading the row, naming the kind of content behind it.
 * @property {string} [description] - Supporting line under the label, clamped to one line.
 * @property {number} [count] - Published item count, shown before the chevron. Omitted
 * on the rows that stand for every category.
 * @property {() => void} [onNavigate] - Fired after the row navigates, so a host
 * surface such as the mobile menu can close itself.
 */
export interface MegaMenuRowProps {
    href: string;
    label: string;
    icon?: ReactNode;
    description?: string;
    count?: number;
    onNavigate?: () => void;
}

/**
 * MegaMenuRow
 *
 * @description
 * One row of a mega menu column: an optional leading glyph, the label over a one-line
 * description, and the count badge and chevron on the right. Category copy runs to a
 * paragraph, so the description is clamped rather than allowed to set the row height.
 */
export function MegaMenuRow({
    href,
    label,
    icon,
    description,
    count,
    onNavigate
}: MegaMenuRowProps) {
    return (
        <div className="border-b border-outlined/50 py-1">
            <Link
                href={href}
                onClick={onNavigate}
                className={cn(
                    "group flex items-center gap-3 rounded-base p-3 transition-colors",
                    "hover:bg-accent"
                )}
            >
                {icon && (
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-base bg-muted text-muted-foreground transition-colors group-hover:text-accent-foreground [&_svg]:size-4">
                        {icon}
                    </span>
                )}

                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate font-medium text-foreground text-xs group-hover:text-accent-foreground lg:text-sm">
                        {label}
                    </span>
                    {description && (
                        <span className="truncate text-subtle-foreground/65 text-xs">
                            {description}
                        </span>
                    )}
                </span>

                <div className="flex shrink-0 items-center gap-1.5">
                    {count !== undefined && (
                        <Badge
                            variant="brand-outline"
                            className="tabular-nums"
                        >
                            {count}
                        </Badge>
                    )}
                    <ChevronRightIcon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent-foreground" />
                </div>
            </Link>
        </div>
    );
}
