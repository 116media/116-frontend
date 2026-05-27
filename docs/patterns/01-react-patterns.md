# React Design Patterns

## Patterns Used in the 116 Frontend

### 1. Server/Client Split

The most important pattern. Covered in detail in [Server vs Client Components](../architecture/04-server-vs-client.md). In summary: fetch data in Server Components, handle interactivity in Client Components. Push `"use client"` as far down as possible.

### 2. Container/Presentational

Containers own data fetching logic. Presentational components receive data via props and render UI. This is the same pattern as the dashboard but adapted for Server Components.

```text
Container (Server Component)
  -> fetches data
  -> passes to Presentational (can be Server or Client)
    -> renders UI
```

### 3. Custom Hook Extraction

One hook per concern. Never put API calls, state management, and side effects in the same component body.

```typescript
// Each hook is focused
const comments = useArticleComments(articleId);
const postComment = usePostComment(articleId);
const deleteComment = useDeleteComment(articleId);
```

### 4. Composition over Inheritance

React does not use class inheritance. Compose smaller components into larger ones:

```typescript
// Build complex UI from simple parts
<PageContainer>
    <PageHeader title="Articles" />
    <FilterBar categories={categories} />
    <ArticleGrid articles={articles} />
    <Pagination currentPage={page} totalPages={total} />
</PageContainer>
```

### 5. Render Props and Children

For components that need to control how their children render:

```typescript
<InfiniteScroll
    hasMore={hasNextPage}
    loadMore={fetchNextPage}
    loader={<Spinner />}
>
    {items.map(item => <ShortCard key={item.id} short={item} />)}
</InfiniteScroll>
```

### 6. Context for Cross-Cutting State

Only for truly global state that many components need:

- `AuthContext` (user info, isAuthenticated)
- `ThemeContext` (light/dark mode via next-themes)

Do NOT use Context for server data. That is React Query's job.

### 7. Discriminated Unions for State

Instead of multiple booleans, use a single state with discriminated types:

```typescript
type AsyncState<T> =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; data: T }
    | { status: "error"; error: Failure };
```

React Query already implements this pattern internally (`isLoading`, `isError`, `isSuccess`, `data`, `error`).

### 8. Colocation

Keep related files together. A component's styles, tests, types, and stories live next to the component, not in a separate global folder.

```text
ArticleCard/
  index.tsx          # Component
  skeleton.tsx       # Loading skeleton
  article-card.test.tsx  # Tests (when added)
```

### 9. Forwarded Refs

For components that wrap HTML elements, forward the ref so parent components can access the DOM node:

```typescript
const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
    return <input ref={ref} className={cn("...", className)} {...props} />;
});
```

This is especially important for form libraries (React Hook Form) and focus management.

### 10. Lazy Loading for Heavy Components

For components that are large and not immediately visible:

```typescript
import dynamic from "next/dynamic";

const VideoPlayer = dynamic(() => import("./VideoPlayer"), {
    ssr: false,
    loading: () => <VideoPlayerSkeleton />,
});

const CommentSection = dynamic(() => import("./CommentSection"), {
    loading: () => <CommentSectionSkeleton />,
});
```
