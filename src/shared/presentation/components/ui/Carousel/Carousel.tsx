"use client";

import type useEmblaCarousel from "embla-carousel-react";
import type { ComponentPropsWithoutRef } from "react";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

import { CarouselContext } from "./useCarousel";

type UseEmblaCarouselType = ReturnType<typeof useEmblaCarousel>;

/**
 * CarouselProps
 *
 * @description
 * Props for the root Carousel component.
 *
 * @property {Parameters<typeof useEmblaCarousel>[0]} [opts] - Embla carousel options (loop, align, etc.)
 * @property {Parameters<typeof useEmblaCarousel>[1]} [plugins] - Embla plugins (autoplay, etc.)
 */
export interface CarouselProps extends ComponentPropsWithoutRef<"div"> {
    opts?: Parameters<typeof useEmblaCarousel>[0];
    plugins?: Parameters<typeof useEmblaCarousel>[1];
    emblaRef: UseEmblaCarouselType[0];
    api: UseEmblaCarouselType[1];
}

/**
 * Carousel
 *
 * @description
 * Root container for the Carousel compound component. Exposes the Embla API,
 * scroll helpers, and ref to child components via context; accepts a pre-created
 * emblaRef and api from the consuming client component.
 */
export function Carousel({ emblaRef, api, className, children, ...props }: CarouselProps) {
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
    const scrollNext = useCallback(() => api?.scrollNext(), [api]);

    const onSelect = useCallback(() => {
        if (!api) return;
        setCanScrollPrev(api.canScrollPrev());
        setCanScrollNext(api.canScrollNext());
    }, [api]);

    useEffect(() => {
        if (!api) return;
        onSelect();
        api.on("reInit", onSelect);
        api.on("select", onSelect);
        return () => {
            api.off("reInit", onSelect);
            api.off("select", onSelect);
        };
    }, [api, onSelect]);

    return (
        <CarouselContext.Provider
            value={{ emblaRef, api, scrollPrev, scrollNext, canScrollPrev, canScrollNext }}
        >
            <section
                className={cn("h-full min-w-0 overflow-hidden", className)}
                {...props}
            >
                {children}
            </section>
        </CarouselContext.Provider>
    );
}
