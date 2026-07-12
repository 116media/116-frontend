import type { InternalAxiosRequestConfig } from "axios";

import { X_DEVICE_ID_HEADER } from "@/modules/session/infrastructure/constants/storage";
import { getDeviceId } from "@/modules/session/infrastructure/storage/device-id.storage";

/**
 * deviceIdInterceptor
 *
 * @description
 * Axios request interceptor that attaches the `X-Device-Id` header so the backend
 * can attribute sessions per device. Omitted on the server, where no device id exists.
 *
 * @param config - Axios request configuration.
 * @returns The config with the `X-Device-Id` header attached when available.
 */
export const deviceIdInterceptor = (
    config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
    const deviceId = getDeviceId();
    if (deviceId) {
        config.headers.set(X_DEVICE_ID_HEADER, deviceId);
    }
    return config;
};
