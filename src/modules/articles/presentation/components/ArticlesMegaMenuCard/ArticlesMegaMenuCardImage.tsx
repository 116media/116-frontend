"use client";

import Image from "next/image";

import { cn } from "@/shared/presentation/utils/cn";
import type { ArticlesMegaMenuCardImageProps } from "./types";

/**
 * ArticlesMegaMenuCardImage
 *
 * @description
 * Shared image piece composed into both ArticlesMegaMenuCard.Featured and
 * ArticlesMegaMenuCard.Compact. Renders a Next.js Image with a gradient
 * overlay and a category pill at the bottom-left.
 * - size="full"  → full-width aspect-video block (Featured top section)
 * - size="thumb" → fixed w-28 thumbnail filling 100% height (Compact left column)
 * Falls back to a muted placeholder when src is null.
 */
export function ArticlesMegaMenuCardImage({
    src,
    alt,
    categoryName,
    size
}: ArticlesMegaMenuCardImageProps) {
    return (
        <div
            className={cn(
                "relative shrink-0 overflow-hidden bg-muted",
                size === "full" && "aspect-video w-full",
                size === "thumb" && "w-28 self-stretch rounded-md"
            )}
        >
            {src ? (
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes={size === "full" ? "(max-width: 1280px) 50vw, 320px" : "112px"}
                />
            ) : (
                <div className="h-full w-full bg-muted" />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            <span className="absolute bottom-1.5 left-1.5 rounded px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white bg-primary/80">
                {categoryName}
            </span>
        </div>
    );
}
