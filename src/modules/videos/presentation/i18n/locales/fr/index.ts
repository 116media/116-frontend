import { exclusiveShow } from "@/modules/videos/presentation/i18n/locales/fr/exclusiveshow";
import { home } from "@/modules/videos/presentation/i18n/locales/fr/home";
import { videoDetail } from "@/modules/videos/presentation/i18n/locales/fr/video-detail";

/**
 * fr
 *
 * @description
 * French translation catalog for the videos module, mirror of the English barrel.
 * Composes the module's namespaces (one per usage area, e.g. `home`, `exclusiveShow`)
 * and spreads the video-detail bundle (whose top-level `detail` key resolves as
 * `videos.detail.*`) into a single locale object that the composition root nests
 * under the `videos` key. Must stay key-aligned with the English mirror.
 */
export const fr = {
    home,
    exclusiveShow,
    ...videoDetail
} as const;
