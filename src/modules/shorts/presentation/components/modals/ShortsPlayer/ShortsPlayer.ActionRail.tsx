"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useRequireAuth } from "@/modules/auth/presentation/hooks/useRequireAuth";
import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";
import { ShortShareSheet } from "@/modules/shorts/presentation/components/modals/ShortShareSheet";
import { useToggleShortBookmark } from "@/modules/shorts/presentation/hooks/useToggleShortBookmark";
import { Button } from "@/shared/presentation/components/ui/Button";
import { BookmarkIcon, HeartIcon, ShareIcon } from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";
import { formatCount } from "@/shared/presentation/utils/format/format.utils";

const RAIL_BUTTON_CLASS =
    "flex h-auto w-auto items-center justify-center gap-1 px-2.5 py-2 text-white hover:bg-white/25 hover:text-white [&_svg]:size-7";

const ACTIVE_ICON_CLASS = "fill-primary text-primary dark:fill-secondary dark:text-secondary";

/**
 * Props for the ShortsPlayerActionRail component.
 *
 * @interface ShortsPlayerActionRailProps
 * @property {IShortVideoEntity} short - The slide's short.
 * @property {boolean} liked - Session-local liked state (shared with the double-tap burst).
 * @property {number} likeCount - Live like count.
 * @property {() => void} onToggleLike - Auth-gated like toggle.
 */
export interface ShortsPlayerActionRailProps {
    liked: boolean;
    likeCount: number;
    short: IShortVideoEntity;
    onToggleLike: () => void;
}

/**
 * ShortsPlayerActionRail
 *
 * @description
 * Right-edge rail of frosted ghost buttons: an auth-gated like toggle, an auth-gated
 * bookmark toggle, and a share action, each stacked over its live count. No comment
 * control — comments are not part of the shorts contract.
 */
export function ShortsPlayerActionRail({
    short,
    liked,
    likeCount,
    onToggleLike
}: ShortsPlayerActionRailProps) {
    const { t } = useTranslation();
    const requireAuth = useRequireAuth();
    const [shareOpen, setShareOpen] = useState(false);

    const {
        bookmarked,
        count: bookmarkCount,
        toggle: toggleBookmark
    } = useToggleShortBookmark(short.id, short.bookmarkCount, short.isBookmarked);
    const onToggleBookmark = () => requireAuth(toggleBookmark);

    return (
        <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-2">
            <Button
                variant="ghost"
                aria-pressed={liked}
                onClick={onToggleLike}
                className={RAIL_BUTTON_CLASS}
                aria-label={t("shorts.actions.like")}
            >
                <span className="flex flex-col items-center gap-1">
                    <HeartIcon className={cn("drop-shadow", liked && ACTIVE_ICON_CLASS)} />
                    <span className="text-xs tabular-nums drop-shadow">
                        {formatCount(likeCount)}
                    </span>
                </span>
            </Button>

            <Button
                variant="ghost"
                aria-pressed={bookmarked}
                onClick={onToggleBookmark}
                className={RAIL_BUTTON_CLASS}
                aria-label={t("shorts.actions.bookmark")}
            >
                <span className="flex flex-col items-center gap-1">
                    <BookmarkIcon className={cn("drop-shadow", bookmarked && ACTIVE_ICON_CLASS)} />
                    <span className="text-xs tabular-nums drop-shadow">
                        {formatCount(bookmarkCount)}
                    </span>
                </span>
            </Button>

            <Button
                variant="ghost"
                className={RAIL_BUTTON_CLASS}
                onClick={() => setShareOpen(true)}
                aria-label={t("shorts.actions.share")}
            >
                <span className="flex flex-col items-center gap-1">
                    <ShareIcon className="drop-shadow" />
                    <span className="text-xs tabular-nums drop-shadow">
                        {formatCount(short.shareCount)}
                    </span>
                </span>
            </Button>

            <ShortShareSheet
                short={short}
                open={shareOpen}
                onOpenChange={setShareOpen}
            />
        </div>
    );
}
