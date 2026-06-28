/**
 * home (en)
 *
 * @description
 * English strings for the videos home/mega-menu surface. Owned by the videos
 * module presentation layer and exposed under the `home` namespace by the
 * locale barrel, so call sites reference them as `t("videos.home.<key>")`.
 * Must hold the exact same keys as the French mirror.
 */
export const home = {
    watchNow: "Watch Now",
    categories: "Categories",
    showsTitle: "Everyone's Watching Now",
    showsViewAll: "View all shows"
} as const;
