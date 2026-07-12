import { browse } from "@/modules/videos/presentation/i18n/locales/en/browse";
import { exclusiveShow } from "@/modules/videos/presentation/i18n/locales/en/exclusiveshow";
import { home } from "@/modules/videos/presentation/i18n/locales/en/home";
import { shows } from "@/modules/videos/presentation/i18n/locales/en/shows";
import { videoDetail } from "@/modules/videos/presentation/i18n/locales/en/video-detail";

/**
 * en
 *
 * @description
 * English translation catalog for the videos module: composes the per-area
 * namespaces and spreads the video-detail bundle (resolving as
 * `videos.detail.*`). Must stay key-aligned with the French mirror.
 */
export const en = {
    home,
    shows,
    browse,
    exclusiveShow,
    ...videoDetail
} as const;
