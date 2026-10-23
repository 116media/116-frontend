import { LanguageDropdown as LanguageDropdownRoot } from "./LanguageDropdown";
import { LanguageDropdownMenu } from "./LanguageDropdown.Menu";

export type { LanguageDropdownMenuProps, LanguageDropdownProps } from "./types";

/**
 * LanguageDropdown
 *
 * @description
 * Language switcher: the root is the trigger, `.Menu` the list of locales.
 */
export const LanguageDropdown = {
    Root: LanguageDropdownRoot,
    Menu: LanguageDropdownMenu
} as const;
