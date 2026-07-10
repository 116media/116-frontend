"use client";

import type useEmblaCarousel from "embla-carousel-react";
import { createContext, useContext } from "react";

type UseEmblaCarouselType = ReturnType<typeof useEmblaCarousel>;

/**
 * CarouselContextValue
 *
 * @description
 * Internal context value shared between Carousel compound components: the Embla
 * carousel ref, API instance, and scroll helpers.
 */
export interface CarouselContextValue {
    emblaRef: UseEmblaCarouselType[0];
    api: UseEmblaCarouselType[1];
    scrollPrev: () => void;
    scrollNext: () => void;
    canScrollPrev: boolean;
    canScrollNext: boolean;
}

/**
 * The context the `Carousel` root provides to its compound parts.
 */
export const CarouselContext = createContext<CarouselContextValue | null>(null);

/**
 * useCarousel
 *
 * @description
 * Accesses the Carousel context from child components. Must be used within a
 * `<Carousel>` component.
 *
 * @returns The carousel context value
 * @throws If used outside of a Carousel component
 */
export function useCarousel(): CarouselContextValue {
    const context = useContext(CarouselContext);
    if (!context) {
        throw new Error("useCarousel must be used within a <Carousel />");
    }
    return context;
}
