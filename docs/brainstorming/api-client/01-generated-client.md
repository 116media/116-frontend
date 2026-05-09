# Generated API Client

## Overview

The frontend uses the same `swagger-typescript-api` tool as the dashboard to generate a typed Axios client from the backend's Swagger spec. This guarantees type safety between the backend and frontend.

## Generation

```bash
yarn api:generate
```

This runs:

```bash
swagger-typescript-api generate \
  -p http://localhost:5025/swagger/v1/swagger.json \
  -o ./src/shared/infrastructure/api/generated/ \
  -n 116.api.ts \
  --axios --responses
```

The output is a single `116.api.ts` file containing:

- All enums (ContentStatus, PaymentStatus, AuthProvider, etc.)
- All request/response interfaces
- An `Api` class with typed methods for every endpoint

## Client Setup

### Browser Client (Client Components)

```typescript
// src/shared/infrastructure/api/client.ts
import { Api } from "@/shared/infrastructure/api/generated/116.api";

export const apiClient = new Api({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,  // Send HttpOnly cookies
    headers: {
        "Accept-Language": "fr",
    },
});
```

### Server Client (Server Components)

Server Components need to forward the incoming request's cookies to the API:

```typescript
// src/shared/infrastructure/api/server-client.ts
import { cookies } from "next/headers";
import { Api } from "@/shared/infrastructure/api/generated/116.api";

export async function createServerApiClient() {
    const cookieStore = await cookies();

    return new Api({
        baseURL: process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL,
        headers: {
            Cookie: cookieStore.toString(),
            "Accept-Language": "fr",
        },
    });
}
```

Use `API_INTERNAL_URL` for server-to-server calls within the same network (faster, no public DNS). Fall back to `NEXT_PUBLIC_API_URL` for development.

## Usage in Repository

```typescript
// Server-side (in Server Component containers)
import { createServerApiClient } from "@/shared/infrastructure/api/server-client";

export class ArticlesRepositoryImpl implements IArticlesRepositoryPort {
    async getArticleBySlug(slug: string): Promise<Result<IArticleEntity>> {
        try {
            const client = await createServerApiClient();
            const response = await client.api.getArticleBySlug(slug);
            return ok(ArticlesMapper.articleFromDto(response.data.article));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }
}
```

```typescript
// Client-side (in React Query hooks)
import { apiClient } from "@/shared/infrastructure/api/client";

export function useLikeArticle(articleId: string) {
    return useMutation({
        mutationFn: () => apiClient.api.likeArticle(articleId),
    });
}
```

## Environment Variables

```env
# Public (exposed to browser)
NEXT_PUBLIC_API_URL=https://api.116.cd

# Private (server only)
API_INTERNAL_URL=http://api-service:5025
```

## When to Regenerate

Run `yarn api:generate` whenever:

- A new backend endpoint is added
- Request/response shapes change
- New enums are added

The generated file should be committed to git (same as the dashboard). This ensures the build works without a running backend.
