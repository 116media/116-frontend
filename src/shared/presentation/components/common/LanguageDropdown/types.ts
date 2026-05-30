/**
 * LanguageDropdownProps
 *
 * @property placement - Direction the dropdown menu opens relative to the trigger
 */
export interface LanguageDropdownProps {
    placement?: "top" | "bottom";
}

/**
 * LanguageDropdownMenuProps
 *
 * @property placement - Controls whether the menu opens above or below the trigger
 * @property currentCode - The currently active language code
 * @property onSelect - Callback fired with the selected language code
 */
export interface LanguageDropdownMenuProps {
    currentCode: string;
    placement: "top" | "bottom";
    onSelect: (lang: string) => void;
}
