import Image from "next/image";

import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";
import { ShortCardOverlay } from "@/modules/shorts/presentation/components/cards/ShortCard/ShortCard.Overlay";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for the ShortCard component.
 *
 * @interface ShortCardProps
 * @property {IShortVideoEntity} short - The short this tile represents.
 * @property {() => void} onOpen - Opens the player focused on this short.
 * @property {string} [className] - Sizing/snap classes from the strip.
 */
export interface ShortCardProps {
    short: IShortVideoEntity;
    onOpen: () => void;
    className?: string;
}

/**
 * ShortCard
 *
 * @description
 * A 9:16 poster tile with a bottom scrim, title clamp, and view count. Tapping it
 * opens the full-screen player at this short.
 */
export function ShortCard({ short, onOpen, className }: ShortCardProps) {
    return (
        <button
            type="button"
            onClick={onOpen}
            className={cn(
                "group relative aspect-9/16 overflow-hidden rounded-lg bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                className
            )}
        >
            {short.thumbnailUrl && (
                <Image
                    fill
                    sizes="160px"
                    alt={short.title}
                    src={short.thumbnailUrl}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
            )}
            <ShortCardOverlay
                title={short.title}
                viewCount={short.viewCount}
            />
        </button>
    );
}
