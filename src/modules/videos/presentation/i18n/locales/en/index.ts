import { home } from "@/modules/videos/presentation/i18n/locales/en/home";

/**
 * en
 *
 * @description
 * English translation catalog for the videos module. This barrel composes the
 * module's namespaces (one per usage area, e.g. `home`), mirroring the shared
 * locale barrel. The composition root nests it under the `videos` key, so keys
 * resolve as `t("videos.home.watchNow")`. Must stay key-aligned with the French mirror.
 */
export const en = {
    home
} as const;
