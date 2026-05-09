import { Check } from "lucide-react";
import {
    DropdownMenuContent,
    DropdownMenuItem
} from "@/shared/presentation/components/ui/DropdownMenu";
import { LANGUAGE_LIST } from "@/shared/presentation/constants/languages";
import { cn } from "@/shared/presentation/utils/cn";
import type { LanguageDropdownMenuProps } from "./types";

/**
 * LanguageDropdownMenu
 *
 * @description
 * Renders the list of selectable language options inside the language dropdown.
 * Each item shows a flag icon, the language name, and a checkmark for the active selection.
 *
 * @param placement - Controls whether the menu opens above or below the trigger
 * @param currentCode - The currently active language code
 * @param onSelect - Callback fired with the selected language code
 */
export function LanguageDropdownMenu({
    placement,
    currentCode,
    onSelect
}: LanguageDropdownMenuProps) {
    return (
        <DropdownMenuContent
            align="start"
            className="min-w-36 p-1"
            side={placement === "bottom" ? "bottom" : "top"}
        >
            {LANGUAGE_LIST.map((lang) => (
                <DropdownMenuItem
                    key={lang.code}
                    onClick={() => onSelect(lang.code)}
                    className="flex items-center gap-2 px-2 py-2 text-sm text-foreground"
                >
                    <span className="flex size-4 shrink-0 items-center justify-center">
                        <lang.FlagIcon />
                    </span>
                    <span className="flex-1">{lang.name}</span>
                    <Check
                        size={14}
                        className={cn(
                            "ml-auto shrink-0 text-secondary transition-opacity",
                            lang.code === currentCode ? "opacity-100" : "opacity-0"
                        )}
                    />
                </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
    );
}
