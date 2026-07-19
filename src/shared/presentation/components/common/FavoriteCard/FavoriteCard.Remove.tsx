import type { MouseEvent } from "react";

import { Button } from "@/shared/presentation/components/ui/Button";
import { BookmarkIcon, TrashIcon } from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for FavoriteCard.Remove.
 *
 * @interface FavoriteCardRemoveProps
 * @property {() => void} onRemove - Runs the unbookmark/unsave/remove mutation.
 * @property {string} label - Accessible label for the icon button.
 * @property {"trash" | "bookmark"} [icon] - Which glyph to show; defaults to the trash icon.
 * @property {string} [className] - Extra classes to reposition the button.
 */
export interface FavoriteCardRemoveProps {
    label: string;
    className?: string;
    onRemove: () => void;
    icon?: "trash" | "bookmark";
}

/**
 * FavoriteCard.Remove
 *
 * @description
 * An overlay icon button (top-right of the media) that removes the tile from its
 * collection. Stops click propagation so activating it never triggers the media open,
 * and turns destructive on hover.
 */
export function FavoriteCardRemove({
    onRemove,
    label,
    icon = "trash",
    className
}: FavoriteCardRemoveProps) {
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        onRemove();
    };

    const Glyph = icon === "bookmark" ? BookmarkIcon : TrashIcon;

    return (
        <Button
            size="icon"
            variant="ghost"
            aria-label={label}
            onClick={handleClick}
            className={cn(
                "absolute top-2 right-2 z-10 size-8 rounded-full bg-black/60 text-white hover:bg-destructive hover:text-destructive-foreground",
                className
            )}
        >
            <Glyph className="size-4" />
        </Button>
    );
}
