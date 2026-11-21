"use client";

import { Button } from "@/shared/presentation/components/ui/Button";
import { XIcon } from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

import type { SearchFieldClearProps } from "./types";

/**
 * SearchField.Clear
 *
 * @description
 * Empties the field. Holds its slot when `hidden`, so a shell does not reflow the moment
 * the first character lands.
 *
 * @param label - Accessible label for the control.
 * @param onClear - Empties the field.
 * @param hidden - Keeps the slot but renders nothing.
 * @param className - Extra classes merged onto the control.
 */
export function SearchFieldClear({ label, onClear, hidden, className }: SearchFieldClearProps) {
    if (hidden) return <span className="size-7 shrink-0" />;

    return (
        <Button
            size="icon"
            type="button"
            variant="ghost"
            onClick={onClear}
            aria-label={label}
            className={cn("size-7 shrink-0 rounded-full text-subtle-foreground/65", className)}
        >
            <XIcon />
        </Button>
    );
}
