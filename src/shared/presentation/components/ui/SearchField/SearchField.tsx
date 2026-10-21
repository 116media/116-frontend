"use client";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

import { searchFieldVariants } from "./searchFieldVariants";
import type { SearchFieldProps } from "./types";

/**
 * SearchField
 *
 * @description
 * The shell every search in the app is typed into: one border, one fill, one height
 * scale. It owns the look and nothing else — what is searched, and how, stays with the
 * hook the caller already has.
 *
 * @param children - The parts that fill the shell, in reading order.
 * @param variant - How the shell presents itself.
 * @param size - The shell's height.
 * @param className - Extra classes merged onto the shell.
 */
export function SearchField({ children, variant, size, className }: SearchFieldProps) {
    return <div className={cn(searchFieldVariants({ variant, size }), className)}>{children}</div>;
}
