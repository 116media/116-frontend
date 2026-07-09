"use client";

import { useCallback, useEffect, useState } from "react";

import { useCarousel } from "@/shared/presentation/components/ui/Carousel";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * CarouselDots
 *
 * @description
 * Dot indicator for the Carousel compound. Reads the Embla API from context for
 * the slide count and selected index; each dot scrolls to its slide. Positioned
 * via the `className` prop (e.g. `absolute bottom-3 right-3`).
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
        <div className={cn("flex gap-1.5", className)}>
            {scrollSnaps.map((snap, index) => (
                <button
                    type="button"
                    key={snap}
                    onClick={() => api?.scrollTo(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={cn(
                        "size-1.5 cursor-pointer rounded-full transition-colors",
                        index === selectedIndex ? "bg-white" : "bg-white/40"
                    )}
                />
            ))}
        </div>
    );
}
