"use client";

import { type ChangeEvent, forwardRef, type KeyboardEvent } from "react";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

import { searchFieldTextVariants } from "./searchFieldVariants";
import type { SearchFieldInputProps } from "./types";

/**
 * SearchField.Input
 *
 * @description
 * The control itself. Enter submits where a caller leaves for a results route, Escape
 * empties where the field should clear rather than close; both are opt-in, so a field
 * inside a dialog leaves Escape to the dialog.
 */
export const SearchFieldInput = forwardRef<HTMLInputElement, SearchFieldInputProps>(
    ({ value, onValueChange, onSubmit, onClear, className, onKeyDown, ...props }, ref) => {
        const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter" && onSubmit) {
                event.preventDefault();
                onSubmit();
            }

            if (event.key === "Escape" && onClear && value) {
                event.preventDefault();
                event.stopPropagation();
                onClear();
            }

            onKeyDown?.(event);
        };

        return (
            <input
                ref={ref}
                type="search"
                value={value}
                autoComplete="off"
                enterKeyHint="search"
                onKeyDown={handleKeyDown}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    onValueChange(event.target.value)
                }
                className={cn(
                    searchFieldTextVariants(),
                    "[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
                    className
                )}
                {...props}
            />
        );
    }
);
SearchFieldInput.displayName = "SearchFieldInput";
