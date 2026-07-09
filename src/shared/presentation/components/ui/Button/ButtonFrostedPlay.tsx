"use client";

import { PlayIcon } from "@/shared/presentation/components/ui/Icon";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for the ButtonFrostedPlay component.
 *
 * @interface ButtonFrostedPlayProps
 *
 * @property {"sm" | "md" | "lg"} [size] - Size preset controlling button and icon dimensions
 */
export interface ButtonFrostedPlayProps {
    size?: "sm" | "md" | "lg";
}

/**
 * ButtonFrostedPlay
 *
 * @description
 * Frosted-glass circular play button for overlaying on video thumbnails.
 * Scales up on parent group hover. Shared across all VideosMegaMenuCard variants.
 * Exported from the Button barrel alongside Button and buttonVariants.
 */
export function ButtonFrostedPlay({ size = "md" }: ButtonFrostedPlayProps) {
    return (
        <div
            className={cn(
                "flex items-center justify-center rounded-full",
                "bg-white/20 backdrop-blur-md border border-white/30",
                "transition-transform duration-200 group-hover:scale-110",
                size === "sm" && "h-9 w-9",
                size === "md" && "h-10 w-10",
                size === "lg" && "h-12 w-12"
            )}
        >
            <PlayIcon
                className={cn(
                    "fill-white text-white",
                    size === "sm" && "h-3.5 w-3.5",
                    size === "md" && "h-4 w-4",
                    size === "lg" && "h-5 w-5"
                )}
            />
        </div>
    );
}
