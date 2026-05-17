# API Client Setup

## Overview

The frontend uses a typed Axios client generated from the backend's Swagger spec. This is the same approach used in the dashboard. Two client variants exist — one for browser (client components) and one for the server (server components and route handlers).

This document focuses on what is needed for the mega menu. For the full API client documentation, see [Generated API Client](../brainstorming/api-client/01-generated-client.md).

## Generating the Client

```bash
yarn api:generate
```

This requires the backend to be running at `http://localhost:5025`. The output is committed to git so the build works without a running backend.

Output: `src/shared/infrastructure/api/generated/116.api.ts`

Regenerate whenever a backend endpoint is added or a request/response shape changes.

## Browser Client

Used in client components and custom hooks.

```typescript
// src/shared/infrastructure/api/client.ts
import { Api } from "@/shared/infrastructure/api/generated/116.api";

export const apiClient = new Api({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: { "Accept-Language": "fr" }
});
```

The browser client is available for future client-side use. Mega menu data is currently fetched server-side — see [Server Prefetch](09-server-prefetch.md).

## Server Client

Used in server components and layout fetches.

```typescript
// src/shared/infrastructure/api/server-client.ts
import { cookies } from "next/headers";
import { Api } from "@/shared/infrastructure/api/generated/116.api";

export async function createServerApiClient() {
    const cookieStore = await cookies();

    return new Api({
        baseURL: process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL,
        withCredentials: true,
        headers: {
            Cookie: cookieStore.toString(),
            "Accept-Language": "fr"
        }
    });
}
```

## Environment Variables

```env
# Public — exposed to the browser
NEXT_PUBLIC_API_URL=https://api.116.cd

# Private — server-to-server only (optional, falls back to NEXT_PUBLIC_API_URL)
API_INTERNAL_URL=http://api-service:5025
```

## Public Endpoints Used by the Mega Menu

All four endpoints are anonymous — no authentication token is required.

| Endpoint | Purpose |
| --- | --- |
| `GET /api/v1/public/content-types` | Resolve Article and Video content type GUIDs |
| `GET /api/v1/public/categories?contentTypeId={id}` | Fetch active categories scoped to a content type |
| `GET /api/v1/public/articles/promoted` | Fetch all promoted articles (frontend slices to 4) |
| `GET /api/v1/public/videos/promoted` | Fetch all promoted videos (frontend slices to 4) |
| `GET /api/v1/public/tags/popular?limit=10&contentType=Article` | Fetch the 10 most-used article tags for the articles panel right column (cached 10 min server-side) |
| `GET /api/v1/public/tags/popular?limit=10&contentType=Video` | Fetch the 10 most-used video tags for the videos panel right column (cached 10 min server-side) |

The content-types endpoint is new — see [Backend Gap — Public Content Types Endpoint](02-backend-content-types-endpoint.md) for the backend change required.
