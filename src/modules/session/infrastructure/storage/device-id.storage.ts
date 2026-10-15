import { DEVICE_ID_STORAGE_KEY } from "@/modules/session/infrastructure/constants/storage";
import { randomUuid } from "@/shared/presentation/utils/uuid/uuid.utils";

/**
 * getDeviceId
 *
 * @description
 * Stable per-browser device id (UUID v4), created and persisted in localStorage on
 * first read (a tracking identifier, not a secret). Returns `null` during SSR.
 *
 * @returns The persisted device id, or null on the server.
 */
export function getDeviceId(): string | null {
    if (typeof window === "undefined") return null;
    let id = localStorage.getItem(DEVICE_ID_STORAGE_KEY);
    if (!id) {
        id = randomUuid();
        localStorage.setItem(DEVICE_ID_STORAGE_KEY, id);
    }
    return id;
}
