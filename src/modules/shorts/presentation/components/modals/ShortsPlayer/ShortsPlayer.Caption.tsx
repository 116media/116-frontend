import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";

/**
 * Props for the ShortsPlayerCaption component.
 *
 * @interface ShortsPlayerCaptionProps
 * @property {IShortVideoEntity} short - The slide's short.
 */
export interface ShortsPlayerCaptionProps {
    short: IShortVideoEntity;
}

/**
 * ShortsPlayerCaption
 *
 * @description
 * Bottom-left overlay over a dark scrim showing the short's title, clamped to two
 * lines and inset from the action rail. Non-interactive so it never intercepts the
 * player's controls beneath it.
 */
export function ShortsPlayerCaption({ short }: ShortsPlayerCaptionProps) {
    return (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col gap-1 bg-linear-to-t from-black/70 to-transparent p-4 pr-16 pb-12">
            <span className="line-clamp-2 text-base text-white/90">{short.title}</span>
        </div>
    );
}
