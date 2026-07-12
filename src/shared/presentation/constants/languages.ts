import type { ComponentType } from "react";
import { EnglishFlagIcon, FrenchFlagIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * ILanguage
 *
 * @description
 * Represents a single selectable language option in the language switcher.
 *
 * @property code - BCP 47 language code (e.g. "en", "fr")
 * @property name - Human-readable language name
 * @property FlagIcon - Flag icon component rendered at the usage site
 */
export interface ILanguage {
    code: string;
    name: string;
    FlagIcon: ComponentType;
}

/**
 * localStorage key persisting the user's selected language across sessions.
 */
export const USER_LANG = "116-lang";

/**
 * Ordered list of supported languages; the first entry is the default fallback.
 */
export const LANGUAGE_LIST: ILanguage[] = [
    { code: "fr", name: "Français", FlagIcon: FrenchFlagIcon },
    { code: "en", name: "English", FlagIcon: EnglishFlagIcon }
];
