import { actions } from "@/modules/shorts/presentation/i18n/locales/en/actions";
import { player } from "@/modules/shorts/presentation/i18n/locales/en/player";
import { section } from "@/modules/shorts/presentation/i18n/locales/en/section";
import { share } from "@/modules/shorts/presentation/i18n/locales/en/share";

/**
 * en
 *
 * @description
 * English translation catalog for the shorts module: composes the per-surface
 * namespaces (resolving as `shorts.section.*`, `shorts.player.*`, etc.). Must stay
 * key-aligned with the French mirror.
 */
export const en = {
    section,
    player,
    actions,
    share
} as const;
