import { exclusiveShow } from "@/modules/videos/presentation/i18n/locales/en/exclusiveshow";
import { home } from "@/modules/videos/presentation/i18n/locales/en/home";
import { videoDetail } from "@/modules/videos/presentation/i18n/locales/en/video-detail";

/**
 * en
 *
 * @description
 * English translation catalog for the videos module. This barrel composes the
 * module's namespaces (one per usage area, e.g. `home`, `exclusiveShow`) and
 * spreads the video-detail bundle (whose top-level `detail` key resolves as
 * `videos.detail.*`), mirroring the shared locale barrel. The composition
 * root nests it under the `videos` key, so keys resolve as
 * `t("videos.home.watchNow")`. Must stay key-aligned with the French mirror.
 */
export const en = {
    home,
    exclusiveShow,
    ...videoDetail
} as const;
