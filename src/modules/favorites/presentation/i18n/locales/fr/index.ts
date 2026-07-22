import { favorites } from "@/modules/favorites/presentation/i18n/locales/fr/favorites";

/**
 * fr
 *
 * @description
 * French translation catalog for the favorites module, mirror of the English catalog. The
 * composition root nests the result under the `favorites` key. Must hold the exact same
 * keys as the English catalog.
 */
export const fr = {
    ...favorites
} as const;
