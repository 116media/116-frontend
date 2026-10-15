import { ShortCard as ShortCardRoot } from "./ShortCard";
import { ShortCardOverlay } from "./ShortCard.Overlay";

export type { ShortCardProps } from "./ShortCard";
export type { ShortCardOverlayProps } from "./ShortCard.Overlay";

/**
 * ShortCard
 *
 * @description
 * A short's tile: the root frames the thumbnail, `.Overlay` the play affordance and
 * counters drawn over it.
 */
export const ShortCard = {
    Root: ShortCardRoot,
    Overlay: ShortCardOverlay
} as const;
