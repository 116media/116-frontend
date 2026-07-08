import { ClockIcon } from "@/shared/presentation/components/ui/Icon";
import { RelativeDate } from "@/shared/presentation/components/ui/RelativeDate";

/**
 * Props for VideoCardDate.
 *
 * @interface VideoCardDateProps
 * @property {string | null} publishedAt - ISO publication date, or null.
 * @property {boolean} [withIcon] - Whether to show a leading clock icon.
 */
export interface VideoCardDateProps {
    publishedAt: string | null;
    withIcon?: boolean;
}

/**
 * VideoCardDate
 *
 * @description
 * The relative published date for a VideoCard, rendered via the shared RelativeDate. An
 * optional leading clock icon is shown for the episode-row layout; the poster layout omits it.
 */
export function VideoCardDate({ publishedAt, withIcon }: VideoCardDateProps) {
    return (
        <span className="flex items-center gap-1">
            {withIcon && <ClockIcon className="size-3" />}
            <RelativeDate date={publishedAt} />
        </span>
    );
}
