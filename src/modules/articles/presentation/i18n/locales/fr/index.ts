import { home } from "@/modules/articles/presentation/i18n/locales/fr/home";

/**
 * fr
 *
 * @description
 * French translation catalog for the articles module, mirror of the English barrel.
 * Composes the module's namespaces (one per usage area, e.g. `home`) into a single
 * locale object that the composition root nests under the `articles` key. Must stay
 * key-aligned with the English mirror.
 */
export const fr = {
    home
} as const;
