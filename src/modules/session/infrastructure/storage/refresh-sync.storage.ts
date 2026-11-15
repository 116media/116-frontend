import { LAST_REFRESH_STORAGE_KEY } from "@/modules/session/infrastructure/constants/storage";

/**
 * getLastRefreshAt
 *
 * @description
 * Epoch ms of the last token refresh completed by any tab of this origin. Returns 0 when
 * nothing has been recorded or storage is unavailable.
 *
 * @returns The timestamp, or 0.
 */
export function getLastRefreshAt(): number {
    if (typeof window === "undefined") return 0;
    try {
        return Number(localStorage.getItem(LAST_REFRESH_STORAGE_KEY)) || 0;
    } catch {
        return 0;
    }
}

/**
 * markRefreshedAt
 *
 * @description
 * Records that a refresh just completed, so sibling tabs skip their own. Holds no secret,
 * only a timestamp.
 *
 * @param at - Epoch ms to record.
 */
export function markRefreshedAt(at: number): void {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(LAST_REFRESH_STORAGE_KEY, String(at));
    } catch {
        return;
    }
}
