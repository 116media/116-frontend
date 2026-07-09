"use client";

import { type ReactNode, useRef, useState } from "react";
import { Button } from "@/shared/presentation/components/ui/Button";
import { ChevronLeftIcon, ChevronRightIcon } from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Shared width/opacity transition driving the hero expand/collapse. The
 * cubic-bezier matches the Material 3 emphasized-decelerate easing.
 */
const SLOT_TRANSITION =
    "transition-[width,opacity] duration-500 ease-[cubic-bezier(0.05,0.7,0.1,1)]";

/**
 * Minimum horizontal pointer travel (px) that counts as a swipe, not a tap.
 */
const SWIPE_THRESHOLD = 40;

/**
 * Render state passed to `renderItem` so the consumer can style the focal
 * "hero" cards vs the small edge "children" differently.
 *
 * @property {boolean} isHero - True when this item is one of the focal (large) cards
 * @property {boolean} isChild - True when this item is a small edge (keyline) card
 */
export interface Md3CarouselSlotState {
    isHero: boolean;
    isChild: boolean;
}

/**
 * Props for the Md3Carousel component.
 *
 * @template T - The item type
 * @property {T[]} items - The items to render as cards
 * @property {(item: T) => string} getKey - Stable React key for an item
 * @property {(item: T, state: Md3CarouselSlotState) => ReactNode} renderItem - Renders a card's inner content
 * @property {(item: T, index: number) => void} [onHeroActivate] - Called when a hero card is clicked
 * @property {number} [heroCount] - How many focal (large) cards show at once (default 3)
 * @property {number} [visibleChildren] - How many small edge cards show in total (default 2)
 * @property {string} [heroClassName] - Width classes (e.g. a %) for a hero card
 * @property {string} [childClassName] - Width classes (e.g. a %) for a small edge card
 * @property {string} [heightClassName] - Tailwind height classes for the strip
 * @property {string} [ariaLabel] - Accessible label for the carousel region
 */
export interface Md3CarouselProps<T> {
    items: T[];
    getKey: (item: T) => string;
    renderItem: (item: T, state: Md3CarouselSlotState) => ReactNode;
    onHeroActivate?: (item: T, index: number) => void;
    heroCount?: number;
    visibleChildren?: number;
    heroClassName?: string;
    childClassName?: string;
    gapClassName?: string;
    heightClassName?: string;
    ariaLabel?: string;
}

/**
 * Md3Carousel
 *
 * @description
 * Generic Material 3 multi-browse carousel: a fixed window of `heroCount` focal
 * cards plus `visibleChildren` small keyline cards, advanced by click, swipe, or
 * the corner arrows. Consumers supply card content via `renderItem`.
 */
export function Md3Carousel<T>({
    items,
    getKey,
    renderItem,
    onHeroActivate,
    heroCount = 3,
    visibleChildren = 2,
    heroClassName = "w-[calc((100%_-_32px)_*_0.2917)]",
    childClassName = "w-[calc((100%_-_32px)_*_0.0625)]",
    gapClassName = "ml-2",
    heightClassName = "h-72 sm:h-80 lg:h-96",
    ariaLabel
}: Md3CarouselProps<T>) {
    const [current, setCurrent] = useState(0);

    const windowSize = heroCount + visibleChildren;
    const maxCurrent = Math.max(0, items.length - windowSize);

    const hasBefore = current > 0;
    const hasAfter = items.length - (current + windowSize) > 0;
    const smallLeft = !hasBefore
        ? 0
        : !hasAfter
          ? visibleChildren
          : Math.floor(visibleChildren / 2);
    const heroStartPos = smallLeft;
    const heroEndPos = smallLeft + heroCount;

    const dragStartX = useRef<number | null>(null);
    const justSwiped = useRef(false);

    const goNext = () => setCurrent((index) => (index >= maxCurrent ? 0 : index + 1));
    const goPrev = () => setCurrent((index) => (index <= 0 ? maxCurrent : index - 1));

    const onPointerDown = (event: React.PointerEvent) => {
        dragStartX.current = event.clientX;
        justSwiped.current = false;
    };

    const onPointerUp = (event: React.PointerEvent) => {
        const start = dragStartX.current;
        dragStartX.current = null;
        if (start === null) return;

        const delta = event.clientX - start;
        if (Math.abs(delta) > SWIPE_THRESHOLD) {
            justSwiped.current = true;
            if (delta < 0) goNext();
            else goPrev();
        }
    };

    return (
        <div className="px-1">
            <section
                aria-label={ariaLabel}
                aria-roledescription="carousel"
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onPointerLeave={() => {
                    dragStartX.current = null;
                }}
                className={cn(
                    "relative flex w-full touch-pan-y select-none items-stretch overflow-hidden",
                    heightClassName
                )}
            >
                {items.map((item, index) => {
                    const pos = index - current;
                    const inWindow = pos >= 0 && pos < windowSize;
                    const isHero = inWindow && pos >= heroStartPos && pos < heroEndPos;
                    const isChild = inWindow && !isHero;
                    const isInteractive = isHero || isChild;

                    const onActivate = () => {
                        // A drag that ended as a swipe also fires a click — ignore it once.
                        if (justSwiped.current) {
                            justSwiped.current = false;
                            return;
                        }
                        if (isHero) onHeroActivate?.(item, index);
                        else if (isChild) {
                            // Click a leading small to go back, a trailing small to advance.
                            if (pos < heroStartPos) goPrev();
                            else goNext();
                        }
                    };

                    return (
                        <div
                            key={getKey(item)}
                            role={isInteractive ? "button" : undefined}
                            tabIndex={isInteractive ? 0 : -1}
                            aria-hidden={!isInteractive}
                            onClick={isInteractive ? onActivate : undefined}
                            onKeyDown={(event) => {
                                if (isInteractive && (event.key === "Enter" || event.key === " ")) {
                                    event.preventDefault();
                                    onActivate();
                                }
                            }}
                            className={cn(
                                "group relative h-full shrink-0 overflow-hidden rounded-3xl bg-muted outline-none",
                                SLOT_TRANSITION,
                                isHero && heroClassName,
                                isChild && cn(childClassName, "cursor-pointer"),
                                isInteractive && pos > 0 && gapClassName,
                                !isInteractive && "w-0 opacity-0"
                            )}
                        >
                            {renderItem(item, { isHero, isChild })}
                        </div>
                    );
                })}

                {items.length > windowSize && (
                    <>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={goPrev}
                            aria-label="Previous"
                            className="absolute left-2 top-1/2 z-30 size-14 -translate-y-1/2 bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 hover:text-white [&_svg]:size-7"
                        >
                            <ChevronLeftIcon />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={goNext}
                            aria-label="Next"
                            className="absolute right-2 top-1/2 z-30 size-14 -translate-y-1/2 bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 hover:text-white [&_svg]:size-7"
                        >
                            <ChevronRightIcon />
                        </Button>
                    </>
                )}
            </section>
        </div>
    );
}
