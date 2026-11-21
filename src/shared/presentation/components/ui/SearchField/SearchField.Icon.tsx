"use client";

import { SearchIcon } from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

import type { SearchFieldIconProps } from "./types";

/**
 * SearchField.Icon
 *
 * @description
 * The magnifier that opens the shell. Decorative: the field carries the accessible name,
 * so this is hidden from assistive technology.
 *
 * @param className - Extra classes merged onto the glyph.
 */
export function SearchFieldIcon({ className }: SearchFieldIconProps) {
    return (
        <SearchIcon
            aria-hidden="true"
            className={cn("size-5 shrink-0 text-subtle-foreground/65", className)}
        />
    );
}
