import { HeartIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for the ShortsPlayerLikeBurst component.
 *
 * @interface ShortsPlayerLikeBurstProps
 * @property {boolean} show - Whether the burst is currently playing.
 */
export interface ShortsPlayerLikeBurstProps {
    show: boolean;
}

/**
 * ShortsPlayerLikeBurst
 *
 * @description
 * The centered, pointer-transparent heart that animates on a double-tap like. It
 * mounts only while the burst is active; reduced-motion callers never set `show`.
 */
export function ShortsPlayerLikeBurst({ show }: ShortsPlayerLikeBurstProps) {
    if (!show) return null;

    return (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <HeartIcon className="size-24 animate-short-like-burst fill-destructive text-destructive drop-shadow-lg" />
        </div>
    );
}
