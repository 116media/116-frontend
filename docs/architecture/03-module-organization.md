# Module Organization

## Module List

Based on the backend's public API endpoints, the frontend needs these modules:

| Module | Content | Routes |
| --- | --- | --- |
| `articles` | Published articles, featured, comments, likes, bookmarks | `/articles`, `/articles/[slug]` |
| `videos` | Published videos, featured, likes, ratings | `/videos`, `/videos/[slug]` |
| `shorts` | Short video clips, likes, bookmarks, views | `/shorts`, `/shorts/[slug]` |
| `lyrics` | Song lyrics pages | `/lyrics/[songTitle]/[artistName]` |
| `auth` | Login, signup, forgot password, OTP | `/login`, `/signup`, `/forgot-password` |
| `playlists` | User playlists (CRUD, add/remove videos) | `/playlists` |
| `catalog` | Categories, tags (navigation data) | Used across modules |

## Module Structure

Every module follows the same 4-layer pattern. Here is the articles module as a complete example:

```text
src/modules/articles/
  domain/
    entities/
      IArticleEntity.ts              # Full article (detail page)
      IArticleSummaryEntity.ts       # Lightweight (list/card)
      IArticleCommentEntity.ts       # Comment with author
  application/
    repositories/
      articles.repository.port.ts    # Interface
    usecases/
      getpublishedarticles.usecase.ts
      getarticlebyslug.usecase.ts
      getfeaturedarticles.usecase.ts
  infrastructure/
    repositories/
      articles.repository.impl.ts    # API calls
    mappers/
      articles.mapper.ts             # DTO to entity
  presentation/
    containers/
      ArticleListContainer.tsx       # Server Component
      ArticleDetailContainer.tsx     # Server Component
    components/
      ArticleCard/index.tsx          # Shared card component
      ArticleBody/index.tsx          # Rich HTML renderer
      ArticleComments/index.tsx      # Client Component (interactive)
      ArticleInteractions/index.tsx  # Client Component (like, bookmark, share)
    hooks/
      useLikeArticle.ts             # React Query mutation
      useBookmarkArticle.ts
      useArticleComments.ts
```

## Shared Module

Cross-cutting code that every module depends on:

```text
src/shared/
  domain/
    entities/
      IAuthorEntity.ts
      ITagEntity.ts
    types/
      pagination.ts
    results/
      result.ts
    failures/
      failure.ts
  application/
    usecases/
      IUseCase.ts
  infrastructure/
    api/
      client.ts
      server-client.ts              # Server-side API client with cookies
      generated/
        116.api.ts
    mappers/
      problem.mapper.ts
    constants/
      languages.ts
  presentation/
    components/ui/                   # shadcn/ui components
    hooks/
      useMediaQuery.ts
      useDebounce.ts
      useInfiniteScroll.ts
    layouts/
      Header/
      Footer/
      UserSidebar/
    providers/
      ThemeProvider.tsx
      QueryProvider.tsx
      AuthProvider.tsx
    styles/
      globals.css
    utils/
      cn.ts                          # clsx + tailwind-merge
      format-date.ts
      structured-data.ts
```

## Creating a New Module

When adding a new module (e.g., `playlists`):

1. Create the folder structure under `src/modules/playlists/`
2. Define entities in `domain/entities/`
3. Define the repository port in `application/repositories/`
4. Implement the repository in `infrastructure/repositories/`
5. Create the mapper in `infrastructure/mappers/`
6. Build containers and components in `presentation/`
7. Add the route in `app/`

The module never imports from another module's infrastructure or presentation layers. Cross-module communication goes through shared entities or the API.
