import type { ComponentType } from "react";
import { EnglishFlagIcon } from "@/shared/presentation/icons/EnglishFlagIcon";
import { FrenchFlagIcon } from "@/shared/presentation/icons/FrenchFlagIcon";

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
 * USER_LANG
 *
 * @description
 * localStorage key used to persist the user's selected language across sessions.
 */
export const USER_LANG = "116-lang";

/**
 * LANGUAGE_LIST
 *
 * @description
 * Ordered list of supported languages. The first entry is the default fallback.
 */
export const LANGUAGE_LIST: ILanguage[] = [
    { code: "fr", name: "Français", FlagIcon: FrenchFlagIcon },
    { code: "en", name: "English", FlagIcon: EnglishFlagIcon }
];
