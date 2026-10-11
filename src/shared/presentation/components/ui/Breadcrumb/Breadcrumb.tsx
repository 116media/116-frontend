import Link from "next/link";
import { Fragment } from "react";

import { ChevronRightIcon } from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * One entry in a breadcrumb trail.
 *
 * @interface BreadcrumbItem
 * @property {string} label - The visible text.
 * @property {string} [href] - Destination; a crumb without one renders as plain text.
 */
export interface BreadcrumbItem {
    label: string;
    href?: string;
}

/**
 * Props for the Breadcrumb component.
 *
 * @interface BreadcrumbProps
 * @property {BreadcrumbItem[]} items - The trail, outermost first.
 * @property {string} [className] - Extra classes merged onto the nav.
 */
export interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

/**
 * Breadcrumb
 *
 * @description
 * Trail of links back up the hierarchy, separated by chevrons. The last entry is
 * the current page and is marked `aria-current`.
 */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            className={cn("min-w-0 text-sm", className)}
        >
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <Fragment key={`${item.label}-${item.href ?? index}`}>
                            <li className="min-w-0">
                                {item.href && !isLast ? (
                                    <Link
                                        href={item.href}
                                        className="transition-colors hover:text-foreground"
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <span
                                        aria-current={isLast ? "page" : undefined}
                                        className={cn("block truncate", isLast && "text-foreground")}
                                    >
                                        {item.label}
                                    </span>
                                )}
                            </li>
                            {!isLast && (
                                <li aria-hidden="true">
                                    <ChevronRightIcon className="size-3.5 shrink-0" />
                                </li>
                            )}
                        </Fragment>
                    );
                })}
            </ol>
        </nav>
    );
}
