# Project Structure

## Overview

The frontend follows the same Clean Architecture approach as the dashboard, adapted for Next.js 16 App Router. The key difference: Next.js owns the routing layer via `app/`, while all business logic, shared UI, and data access live in `src/`.

## Directory Layout

```text
apps/frontend/
  app/                          # Next.js App Router (routing + pages only)
    (public)/                   # Public routes (no auth required)
      articles/
        [slug]/
          page.tsx              # Article detail page
        page.tsx                # Articles listing page
      videos/
        [slug]/
          page.tsx
        page.tsx
      shorts/
        [slug]/
          page.tsx
        page.tsx
      lyrics/
        [songTitle]/
          [artistName]/
            page.tsx
      page.tsx                  # Home page
    (user)/                     # Authenticated user routes
      profile/
        page.tsx
      playlists/
        page.tsx
      bookmarks/
        page.tsx
      settings/
        page.tsx
    layout.tsx                  # Root layout (providers, metadata)
    not-found.tsx               # 404 page
    error.tsx                   # Global error boundary
    loading.tsx                 # Global loading state
  src/
    modules/                    # Feature modules (Clean Architecture)
      articles/
        domain/
        application/
        infrastructure/
        presentation/
      videos/
      shorts/
      lyrics/
      auth/
      playlists/
      catalog/                  # Categories, tags
    shared/
      domain/                   # Shared entities, types, failures
      application/              # Shared interfaces (IUseCase, etc.)
      infrastructure/           # API client, mappers, service locator
      presentation/
        components/             # Shared UI components (shadcn wrappers)
        hooks/                  # Shared React hooks
        layouts/                # Layout components (header, footer, sidebar)
        providers/              # Context providers (theme, auth, query)
        styles/                 # Global styles, CSS variables
        utils/                  # Formatting, date, text utilities
  public/                       # Static assets (favicon, OG images)
  biome.json
  tailwind.config.ts            # Tailwind v4 config (if needed beyond CSS)
  next.config.ts
  tsconfig.json
```

## Why This Structure

### `app/` is thin

The `app/` directory only contains route definitions, layouts, and page components. Each `page.tsx` is a thin shell that imports a container or server component from `src/modules/`. This keeps Next.js routing concerns separate from business logic.

```typescript
// app/(public)/articles/[slug]/page.tsx
import { ArticleDetailContainer } from "@/modules/articles/presentation/containers/ArticleDetailContainer";

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function ArticleDetailPage({ params }: Props) {
    const { slug } = await params;
    return <ArticleDetailContainer slug={slug} />;
}
```

### `src/modules/` mirrors the dashboard

Each module follows the same 4-layer structure as the dashboard:

```text
modules/articles/
  domain/
    entities/           # IArticleEntity, IArticleSummary
  application/
    repositories/       # IArticlesRepositoryPort
    usecases/           # GetArticleBySlugUseCase, GetPublishedArticlesUseCase
  infrastructure/
    repositories/       # ArticlesRepositoryImpl (calls API client)
    mappers/            # ArticlesMapper (DTO to entity)
  presentation/
    containers/         # Smart components (data fetching + rendering)
    components/         # Dumb components (pure UI)
    hooks/              # Module-specific hooks
```

### Route Groups

Next.js route groups `(public)` and `(user)` share different layouts without affecting the URL:

- `(public)` routes get the full header + footer layout. All content is publicly accessible.
- `(user)` routes get the header + sidebar layout and require authentication.

There is no `(auth)` route group. All auth forms (login, signup, forgot password, reset password, OTP) are modals rendered at the root layout level. They are triggered via the `AuthDialogProvider` context from any component (header login button, like button, comment form, etc.).

## Path Aliases

Configured in `tsconfig.json`:

```json
{
    "paths": {
        "@/*": ["./src/*"],
        "@/app/*": ["./app/*"]
    }
}
```

All imports from `src/` use the `@/` prefix, same as the dashboard.
