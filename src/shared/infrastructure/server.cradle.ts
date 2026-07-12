import { asValue } from "awilix";

import { createServerApiClient } from "@/shared/infrastructure/api/server-client";
import container, { type Cradle } from "@/shared/infrastructure/service.locator";

/**
 * createServerCradle
 *
 * @description
 * Creates a per-request Awilix scope for SSR, overriding the browser `client`
 * registration with a cookie-aware server API client so every use case
 * resolved from the scope talks to the backend as the current request.
 *
 * @returns The scoped cradle with all use cases ready to call
 */
export async function createServerCradle(): Promise<Cradle> {
    const client = await createServerApiClient();
    const scope = container.createScope();
    scope.register({ client: asValue(client) });
    return scope.cradle;
}
