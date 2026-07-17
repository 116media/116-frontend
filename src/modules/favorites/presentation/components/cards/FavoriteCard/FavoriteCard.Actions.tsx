import type { ReactNode } from "react";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for FavoriteCard.Actions.
 *
 * @interface FavoriteCardActionsProps
 * @property {ReactNode} children - The action buttons.
 * @property {string} [className] - Extra classes merged onto the row.
 */
export interface FavoriteCardActionsProps {
    children: ReactNode;
    className?: string;
}

/**
 * FavoriteCard.Actions
 *
 * @description
 * The bottom-anchored action row inside the body: a wrapping flex of buttons separated
 * from the content above by a top border. `mt-auto` keeps it aligned to the card bottom
 * so rows of cards share one action baseline.
 */
export function FavoriteCardActions({ children, className }: FavoriteCardActionsProps) {
    return (
        <div
            className={cn(
                "mt-auto flex flex-wrap gap-2 border-foreground/5 border-t pt-2",
                className
            )}
        >
            {children}
        </div>
    );
}
