"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";
import { useCarousel } from "./useCarousel";

/**
 * CarouselContentProps
 *
 * @description
 * Extends standard div props with an optional `overlay` slot
 * for elements (e.g. dots) that must render inside the same
 * overflow-clipped boundary as the slides.
 *
 * @property {ReactNode} [overlay] - Absolutely-positioned content rendered inside the overflow wrapper
 */
export interface CarouselContentProps extends ComponentPropsWithoutRef<"div"> {
    overlay?: ReactNode;
    wrapperClassName?: string;
}

/**
 * CarouselContent
 *
 * @description
 * Scrollable container for carousel slides. Attaches the Embla ref for scroll
 * tracking; the outer wrapper is the overflow-clipped positioning boundary for
 * the `overlay` slot (e.g. dots).
 */
export function CarouselContent({
    className,
    overlay,
    wrapperClassName,
    ...props
}: CarouselContentProps) {
    const { emblaRef } = useCarousel();

    return (
        <div className={cn("relative h-full min-w-0 overflow-hidden rounded-xl", wrapperClassName)}>
            <div
                ref={emblaRef}
                className="h-full overflow-hidden"
            >
                <div
                    className={cn("flex h-full", className)}
                    {...props}
                />
            </div>
            {overlay}
        </div>
    );
}
