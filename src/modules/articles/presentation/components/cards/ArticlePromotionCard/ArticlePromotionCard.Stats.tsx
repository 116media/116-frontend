import { HeartIcon, MessageSquareIcon, ShareIcon } from "@/shared/presentation/components/ui/Icon";
import { formatCount } from "@/shared/presentation/utils/format/format.utils";

import type { ArticlePromotionCardStatsProps } from "./types";

/**
 * Stats
 *
 * @description
 * The engagement stat row (comments, likes, shares) shared by the Hero, Side, and Pair
 * variants. Renders the three icon+count spans inside the caller's row wrapper, which
 * carries the variant-specific spacing and colors.
 */
export function Stats({
    article,
    iconClassName = "size-3.5 sm:size-4"
}: ArticlePromotionCardStatsProps) {
    return (
        <>
            <span className="flex items-center gap-1">
                <MessageSquareIcon className={iconClassName} />
                {formatCount(article.commentCount)}
            </span>
            <span className="flex items-center gap-1">
                <HeartIcon className={iconClassName} />
                {formatCount(article.likeCount)}
            </span>
            <span className="flex items-center gap-1">
                <ShareIcon className={iconClassName} />
                {formatCount(article.shareCount)}
            </span>
        </>
    );
}
