"use client";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

import { SearchFieldIcon } from "./SearchField.Icon";
import { searchFieldTextVariants, searchFieldVariants } from "./searchFieldVariants";
import type { SearchFieldTriggerProps } from "./types";

/**
 * SearchField.Trigger
 *
 * @description
 * Stands in for the field before its surface opens, wearing the same shell so the swap
 * reads as the control waking up rather than one box replacing another.
 *
 * @param label - Accessible name, announced in place of the placeholder copy.
 * @param placeholder - The prompt shown where typed text would sit.
 * @param onOpen - Opens the surface that carries the real field.
 * @param variant - How the shell presents itself.
 * @param size - The shell's height.
 * @param className - Extra classes merged onto the shell.
 */
export function SearchFieldTrigger({
    label,
    placeholder,
    onOpen,
    variant,
    size,
    className
}: SearchFieldTriggerProps) {
    return (
        <button
            type="button"
            onClick={onOpen}
            aria-label={label}
            className={cn(
                searchFieldVariants({ variant, size }),
                "cursor-pointer focus-visible:outline-none",
                className
            )}
        >
            <SearchFieldIcon />
            <span className={cn(searchFieldTextVariants({ tone: "placeholder" }), "text-base")}>
                {placeholder}
            </span>
        </button>
    );
}
