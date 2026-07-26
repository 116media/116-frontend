import type { ReactNode } from "react";

import { PlayIcon } from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";
import { formatCount } from "@/shared/presentation/utils/format/format.utils";

/**
 * Props for ShortCard.Overlay.
 *
 * @interface ShortCardOverlayProps
 * @property {string} title - Short title displayed over the poster.
 * @property {number} viewCount - View total displayed below the title.
 * @property {ReactNode} [children] - Optional metadata rendered at the bottom of the poster.
 */
export interface ShortCardOverlayProps {
    title: string;
    viewCount: number;
    children?: ReactNode;
}

/**
 * ShortCard.Overlay
 *
 * @description
 * Shared non-interactive poster scrim with a two-line title, formatted view count, and
 * an optional metadata footer.
 */
export function ShortCardOverlay({ title, viewCount, children }: ShortCardOverlayProps) {
    return (
        <>
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 to-transparent"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col text-left">
                <div className={cn("flex flex-col gap-1 px-2", !children && "pb-2")}>
                    <span className="line-clamp-2 font-medium text-sm text-white">{title}</span>
                    <span className="flex items-center gap-1 text-white/80 text-xs">
                        <PlayIcon className="size-3" />
                        {formatCount(viewCount)}
                    </span>
                </div>
                {children}
            </div>
        </>
    );
}
