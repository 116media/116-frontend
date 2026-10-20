import { APP_NAME } from "@/shared/infrastructure/constants/common";

/**
 * localStorage key holding the per-browser device id (e.g. `116-device-id`).
 */
export const DEVICE_ID_STORAGE_KEY = `${APP_NAME}-device-id`;

/**
 * Header carrying the device id so the backend attributes sessions per device.
 */
export const X_DEVICE_ID_HEADER = "X-Device-Id";

/**
 * localStorage key holding the epoch ms of the last completed token refresh.
 */
export const LAST_REFRESH_STORAGE_KEY = `${APP_NAME}-last-refresh`;

/**
 * Web Locks name serialising token refreshes across every tab of the origin.
 */
export const REFRESH_LOCK_NAME = `${APP_NAME}:refresh-token`;
