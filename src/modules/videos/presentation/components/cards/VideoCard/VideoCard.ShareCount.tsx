import { ShareIcon } from "@/shared/presentation/components/ui/Icon";
import { formatCount } from "@/shared/presentation/utils/format/format.utils";

/**
 * Props for VideoCardShareCount.
 *
 * @interface VideoCardShareCountProps
 * @property {number} shareCount - The number of shares to display.
 */
export interface VideoCardShareCountProps {
    shareCount: number;
}

/**
 * VideoCardShareCount
 *
 * @description
 * The share tally shown in a VideoCard meta row: a share glyph followed by the abbreviated
 * share count. Inherits its text size and color from the surrounding row.
 */
export function VideoCardShareCount({ shareCount }: VideoCardShareCountProps) {
    return (
        <span className="flex items-center gap-1">
            <ShareIcon className="size-3.5" />
            {formatCount(shareCount)}
        </span>
    );
}
