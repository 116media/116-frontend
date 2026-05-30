"use client";

import { ChevronsUpDown } from "lucide-react";

import { Button } from "@/shared/presentation/components/ui/Button";
import {
    DropdownMenu,
    DropdownMenuTrigger
} from "@/shared/presentation/components/ui/DropdownMenu";
import { useLanguageDropdown } from "@/shared/presentation/hooks/UseLanguageDropdown";
import { LanguageDropdownMenu } from "./LanguageDropdownMenu";
import type { LanguageDropdownProps } from "./types";

/**
 * LanguageDropdown
 *
 * @description
 * Trigger button that opens a language selection menu built on the shadcn
 * DropdownMenu (Radix UI). Shows the active language's flag and code.
 * Persists the selected language to localStorage on change.
 * Closes automatically via Radix focus/click-outside handling.
 *
 * @param placement - Direction the dropdown menu opens ("top" | "bottom"), defaults to "bottom"
 */
export function LanguageDropdown({ placement = "bottom" }: LanguageDropdownProps) {
    const { currentCode, currentLanguage, updateLanguage } = useLanguageDropdown();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    aria-label={`Langue sélectionnée: ${currentLanguage.name}`}
                    className="h-9 gap-1.5 bg-surface-raised px-2.5 hover:bg-surface-hover"
                >
                    <span className="flex size-5 shrink-0 items-center justify-center">
                        <currentLanguage.FlagIcon />
                    </span>
                    <span className="text-sm font-semibold uppercase text-foreground">
                        {currentCode}
                    </span>
                    <ChevronsUpDown
                        size={14}
                        className="shrink-0 text-muted-foreground"
                    />
                </Button>
            </DropdownMenuTrigger>

            <LanguageDropdownMenu
                placement={placement}
                currentCode={currentCode}
                onSelect={updateLanguage}
            />
        </DropdownMenu>
    );
}
