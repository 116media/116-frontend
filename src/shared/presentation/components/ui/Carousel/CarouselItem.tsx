"use client";

import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/presentation/utils/cn";

/**
 * CarouselItem
 *
 * @description
 * Individual slide within a Carousel. Each item takes the full width
 * and height of the carousel viewport by default (single-slide mode).
 */
export function CarouselItem({ className, ...props }: ComponentPropsWithoutRef<"div">) {
    // biome-ignore lint/a11y/useSemanticElements: use WAI-ARIA, fieldset is for forms, not carousel slides
    return (
        <div
            role="group"
            aria-roledescription="slide"
            className={cn("min-w-0 shrink-0 grow-0 basis-full h-full", className)}
            {...props}
        />
    );
}
