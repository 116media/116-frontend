import { DEVICE_ID_STORAGE_KEY } from "@/modules/session/infrastructure/constants/storage.constants";

/**
 * getDeviceId
 *
 * @description
 * Returns a stable per-browser device id (UUID v4), creating and persisting one on
 * first read. The id is a tracking identifier (not a secret), so localStorage is
 * acceptable. Returns `null` during SSR (no `window`), in which case the header is
 * simply omitted.
 *
 * @returns The persisted device id, or null on the server.
 */
export function getDeviceId(): string | null {
    if (typeof window === "undefined") return null;
    let id = localStorage.getItem(DEVICE_ID_STORAGE_KEY);
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(DEVICE_ID_STORAGE_KEY, id);
    }
    return id;
}
