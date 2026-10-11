import Link from "next/link";

import { ChevronRightIcon } from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for the MegaMenuRow component.
 *
 * @interface MegaMenuRowProps
 * @property {string} href - Where the row navigates.
 * @property {string} label - The row's visible text.
 * @property {number} [count] - Published item count, shown before the chevron. Omitted
 * on the rows that stand for every category.
 */
export interface MegaMenuRowProps {
    href: string;
    label: string;
    count?: number;
}

/**
 * MegaMenuRow
 *
 * @description
 * One row of a mega menu column: the label on the left, an optional count and the
 * chevron on the right.
 */
export function MegaMenuRow({ href, label, count }: MegaMenuRowProps) {
    return (
        <div className="border-b border-border/50 first:border-b-0 py-1">
        <Link
            href={href}
            className={cn(
                "group flex items-center justify-between rounded-md p-3 transition-colors",
                "hover:bg-accent"
            )}
        >
            <span className="font-medium text-foreground text-xs group-hover:text-accent-foreground lg:text-sm">
                {label}
            </span>
            <div className="flex shrink-0 items-center gap-1.5">
                {count !== undefined && (
                    <span className="text-muted-foreground text-sm font-semibold tabular-nums group-hover:text-accent-foreground">
                        {count}
                    </span>
                )}
                <ChevronRightIcon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent-foreground" />
            </div>
        </Link>
        </div>
    );
}
