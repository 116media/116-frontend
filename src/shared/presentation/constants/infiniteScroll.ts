/**
 * Stable IntersectionObserver options for infinite-scroll sentinels, pre-loading the next
 * page ~200px before the sentinel enters the viewport. Shared by every infinite feed so
 * the pre-load distance stays consistent across surfaces.
 */
export const INFINITE_SCROLL_SENTINEL_OPTIONS: IntersectionObserverInit = {
    rootMargin: "200px 0px"
};
