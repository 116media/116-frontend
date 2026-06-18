import { asValue } from "awilix";

import { createServerApiClient } from "@/shared/infrastructure/api/server-client";
import container, { type Cradle } from "@/shared/infrastructure/service.locator";

/**
 * createServerCradle
 *
 * @description
 * Creates a per-request Awilix scope for server-side rendering.
 * Internally calls `createServerApiClient()` to build the SSR client
 * (with cookies and internal URL), then overrides the browser `client`
 * registration so every use case resolved from this scope uses the
 * server client.
 *
 * @returns The scoped cradle with all use cases ready to call
 */
export async function createServerCradle(): Promise<Cradle> {
    const client = await createServerApiClient();
    const scope = container.createScope();
    scope.register({ client: asValue(client) });
    return scope.cradle;
}
