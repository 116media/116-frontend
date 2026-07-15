import { browse } from "@/modules/videos/presentation/i18n/locales/fr/browse";
import { exclusiveShow } from "@/modules/videos/presentation/i18n/locales/fr/exclusiveshow";
import { home } from "@/modules/videos/presentation/i18n/locales/fr/home";
import { shows } from "@/modules/videos/presentation/i18n/locales/fr/shows";
import { videoDetail } from "@/modules/videos/presentation/i18n/locales/fr/video-detail";

/**
 * fr
 *
 * @description
 * French translation catalog for the videos module: composes the per-area
 * namespaces and spreads the video-detail bundle (resolving as
 * `videos.detail.*`). Must stay key-aligned with the English mirror.
 */
export const fr = {
    home,
    shows,
    browse,
    exclusiveShow,
    ...videoDetail
} as const;
