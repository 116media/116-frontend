# Interceptors

## Overview

The browser API client uses Axios interceptors for cross-cutting concerns. These are simpler than the dashboard's interceptors because HttpOnly cookies eliminate most token management.

## Request Interceptors

### Accept-Language

Already set in the client config. No interceptor needed.

### Device ID (Optional)

If the backend requires a device ID header for analytics:

```typescript
apiClient.instance.interceptors.request.use((config) => {
    config.headers["X-Device-Id"] = getOrCreateDeviceId();
    return config;
});
```

## Response Interceptors

### Token Refresh

The only critical interceptor. When the access token expires, refresh it and retry:

```typescript
let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: any) => void; reject: (e: any) => void }> = [];

apiClient.instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => apiClient.instance(originalRequest));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await apiClient.api.refreshToken();
                failedQueue.forEach(({ resolve }) => resolve(undefined));
                failedQueue = [];
                return apiClient.instance(originalRequest);
            } catch (refreshError) {
                failedQueue.forEach(({ reject }) => reject(refreshError));
                failedQueue = [];
                // Dispatch session expired event
                window.dispatchEvent(new Event("session-expired"));
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);
```

The queue pattern prevents multiple simultaneous refresh calls when several requests fail at once.

## Server-Side: No Interceptors

The server-side API client (`createServerApiClient`) does not use interceptors. If the token is expired, the Server Component simply treats the user as unauthenticated and fetches public data. Token refresh on the server is handled by Next.js middleware.
