"use client";

import { environmentManager, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

/**
 * Creates a `QueryClient` with the app's default query behaviour.
 *
 * @description
 * Auth and content reads are cookie-authenticated and rarely change within a view,
 * so queries get a 1-minute `staleTime`, no window-focus refetch, and no retry
 * (a `401` is handled by the refresh interceptor, not by retrying the query).
 *
 * @returns A configured `QueryClient`.
 */
function makeQueryClient(): QueryClient {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60_000,
                refetchOnWindowFocus: false,
                retry: false
            }
        }
    });
}

let browserQueryClient: QueryClient | undefined;

/**
 * Returns the request-scoped client on the server and a stable singleton in the
 * browser (the TanStack Query App Router pattern), so SSR never leaks state between
 * requests and the client keeps one cache across renders.
 *
 * @returns The appropriate `QueryClient` for the current environment.
 */
function getQueryClient(): QueryClient {
    if (environmentManager.isServer()) return makeQueryClient();

    browserQueryClient ??= makeQueryClient();
    return browserQueryClient;
}

/**
 * QueryProvider
 *
 * @description
 * Mounts the TanStack Query client for the whole app and registers the i18n-aware
 * zod error map (side-effect import) so client-side form validation is localized.
 * Sits high in the provider tree, inside `ThemeProvider`.
 *
 * @param children - The subtree that gains access to the query client.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(getQueryClient);
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
