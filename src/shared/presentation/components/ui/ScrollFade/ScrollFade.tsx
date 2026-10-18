"use client";

import { type ReactNode, type UIEvent, useCallback, useEffect, useRef, useState } from "react";

import { ChevronDownIcon } from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * How close to an edge still counts as being at it, in pixels. Absorbs the sub-pixel
 * rounding a zoomed or scaled viewport introduces.
 */
const EDGE_SLACK = 8;

/**
 * Props for the ScrollFade component.
 *
 * @interface ScrollFadeProps
 * @property {ReactNode} children - The content that may overflow.
 * @property {string} [className] - Extra classes merged onto the scroll container.
 * @property {string} [hint] - Label announced and shown beside the cue.
 */
export interface ScrollFadeProps {
    children: ReactNode;
    className?: string;
    hint?: string;
}

/**
 * ScrollFade
 *
 * @description
 * Wraps a scrolling region and tells the reader there is more below: a fade over the
 * bottom edge and a cue that is itself the control — pressing it pages down, so the hint
 * is not merely decorative on a device with no obvious scrollbar. Both appear only while
 * content remains. Without them a panel that clips its last row reads as the end of the
 * list rather than the middle of it.
 */
export function ScrollFade({ children, className, hint }: ScrollFadeProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [hasMore, setHasMore] = useState(false);

    /**
     * Pages the region down by most of its height, leaving a sliver of what was on
     * screen so the reader keeps their place.
     */
    const scrollOn = useCallback(() => {
        const node = ref.current;
        if (!node) return;

        node.scrollBy({ top: node.clientHeight * 0.8, behavior: "smooth" });
    }, []);

    const measure = useCallback(() => {
        const node = ref.current;
        if (!node) return;

        setHasMore(node.scrollTop + node.clientHeight < node.scrollHeight - EDGE_SLACK);
    }, []);

    useEffect(() => {
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    });

    return (
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
            <div
                ref={ref}
                className={cn("min-h-0 flex-1 overflow-y-auto", className)}
                onScroll={(event: UIEvent<HTMLDivElement>) => {
                    const node = event.currentTarget;
                    setHasMore(node.scrollTop + node.clientHeight < node.scrollHeight - EDGE_SLACK);
                }}
            >
                {children}
            </div>

            <div
                aria-hidden="true"
                className={cn(
                    "pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-background to-transparent transition-opacity",
                    hasMore ? "opacity-100" : "opacity-0"
                )}
            />

            {hasMore && (
                <button
                    type="button"
                    onClick={scrollOn}
                    className="-translate-x-1/2 absolute bottom-1 left-1/2 flex animate-bounce items-center gap-1.5 rounded-full border border-outlined bg-background px-3 py-1.5 font-medium text-muted-foreground text-xs shadow-sm transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                    <ChevronDownIcon
                        aria-hidden="true"
                        className="size-3.5"
                    />
                    {hint}
                </button>
            )}
        </div>
    );
}
