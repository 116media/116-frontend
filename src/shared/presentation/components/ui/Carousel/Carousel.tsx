"use client";

import type useEmblaCarousel from "embla-carousel-react";
import type { ComponentPropsWithoutRef } from "react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { cn } from "@/shared/presentation/utils/cn";

type UseEmblaCarouselType = ReturnType<typeof useEmblaCarousel>;

/**
 * CarouselContextValue
 *
 * @description
 * Internal context value shared between Carousel compound components.
 * Provides the Embla carousel ref, API instance, and scroll helpers.
 */
interface CarouselContextValue {
    emblaRef: UseEmblaCarouselType[0];
    api: UseEmblaCarouselType[1];
    scrollPrev: () => void;
    scrollNext: () => void;
    canScrollPrev: boolean;
    canScrollNext: boolean;
}

const CarouselContext = createContext<CarouselContextValue | null>(null);

/**
 * useCarousel
 *
 * @description
 * Hook to access the Carousel context from child components.
 * Must be used within a `<Carousel>` component.
 *
 * @returns {CarouselContextValue} The carousel context value
 * @throws {Error} If used outside of a Carousel component
 */
export function useCarousel(): CarouselContextValue {
    const context = useContext(CarouselContext);
    if (!context) {
        throw new Error("useCarousel must be used within a <Carousel />");
    }
    return context;
}

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
 * Root container for the Carousel compound component.
 * Wraps children in a context provider that exposes the Embla API,
 * scroll helpers, and ref to all child components.
 * Accepts pre-created emblaRef and api from the parent (created via
 * useEmblaCarousel in the consuming client component).
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
                className={cn("h-full", className)}
                {...props}
            >
                {children}
            </section>
        </CarouselContext.Provider>
    );
}
