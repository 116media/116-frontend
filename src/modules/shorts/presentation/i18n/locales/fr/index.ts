import { actions } from "@/modules/shorts/presentation/i18n/locales/fr/actions";
import { player } from "@/modules/shorts/presentation/i18n/locales/fr/player";
import { section } from "@/modules/shorts/presentation/i18n/locales/fr/section";
import { share } from "@/modules/shorts/presentation/i18n/locales/fr/share";

/**
 * fr
 *
 * @description
 * French translation catalog for the shorts module, mirror of the English catalog.
 * Must hold the exact same keys as its English counterpart.
 */
export const fr = {
    section,
    player,
    actions,
    share
} as const;
