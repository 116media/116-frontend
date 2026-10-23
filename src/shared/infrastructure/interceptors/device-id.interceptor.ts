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
    // Reading or minting the id touches storage, which a private window or a blocked
    // site-data setting can refuse. The header is an attribution aid, so the request
    // goes out without it rather than failing before it reaches the network.
    try {
        const deviceId = getDeviceId();
        if (deviceId) {
            config.headers.set(X_DEVICE_ID_HEADER, deviceId);
        }
    } catch {
        return config;
    }

    return config;
};
