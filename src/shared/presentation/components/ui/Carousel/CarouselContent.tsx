"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/shared/presentation/utils/cn";
import { useCarousel } from "./Carousel";

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
interface CarouselContentProps extends ComponentPropsWithoutRef<"div"> {
    overlay?: ReactNode;
    wrapperClassName?: string;
}

/**
 * CarouselContent
 *
 * @description
 * Scrollable container for carousel slides. Attaches the Embla ref
 * to an inner div for scroll tracking. The outer wrapper provides
 * `relative` + `overflow-hidden` + `rounded-xl` as the positioning
 * boundary for the overlay (e.g. dots). All layers use `h-full` so
 * the carousel fills its grid cell.
 */
export function CarouselContent({
    className,
    overlay,
    wrapperClassName,
    ...props
}: CarouselContentProps) {
    const { emblaRef } = useCarousel();

    return (
        <div className={cn("relative h-full overflow-hidden rounded-xl", wrapperClassName)}>
            <div
                ref={emblaRef}
                className="h-full"
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
