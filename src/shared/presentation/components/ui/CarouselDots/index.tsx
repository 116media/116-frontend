"use client";

import { useCallback, useEffect, useState } from "react";

import { useCarousel } from "@/shared/presentation/components/ui/Carousel";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * CarouselDots
 *
 * @description
 * Dot indicator for the Carousel compound. Reads the Embla API from context for the slide
 * count and selected index; each dot scrolls to its slide. The row carries its own scrim so
 * the accent dot holds over any slide image, bright or dark. Positioned via `className`.
 */
export function CarouselDots({ className }: { className?: string }) {
    const { api } = useCarousel();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const onSelect = useCallback(() => {
        if (!api) return;
        setSelectedIndex(api.selectedScrollSnap());
    }, [api]);

    useEffect(() => {
        if (!api) return;
        setScrollSnaps(api.scrollSnapList());
        onSelect();
        api.on("select", onSelect);
        api.on("reInit", onSelect);
        return () => {
            api.off("select", onSelect);
            api.off("reInit", onSelect);
        };
    }, [api, onSelect]);

    if (scrollSnaps.length <= 1) return null;

    return (
        <div
            className={cn(
                "flex items-center gap-1.5 rounded-full px-2 py-1 backdrop-blur-sm",
                className
            )}
        >
            {scrollSnaps.map((snap, index) => (
                <button
                    type="button"
                    key={snap}
                    onClick={() => api?.scrollTo(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={cn(
                        "h-1.5 cursor-pointer rounded-full transition-all",
                        index === selectedIndex ? "w-5 bg-secondary" : "w-1.5 bg-white/50"
                    )}
                />
            ))}
        </div>
    );
}
