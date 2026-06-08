# Caching Strategy

## Three Levels of Cache

### 1. Next.js Data Cache (Server)

Next.js caches server-side fetch results. Since we use Axios (not native fetch), we need to opt in manually using `unstable_cache` or rely on route-level caching.

For content pages that do not change often:

```typescript
// Revalidate this page every 60 seconds
export const revalidate = 60;
```

For content that changes frequently (trending, promoted):

```typescript
export const revalidate = 0; // No cache, always fresh
```

### 2. React Query Cache (Client)

React Query manages client-side cache with these defaults:

- `staleTime`: 60 seconds (data considered fresh for 1 minute)
- `gcTime`: 5 minutes (garbage collect unused data after 5 minutes)

Adjust per query:

```typescript
// Categories rarely change
useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000,  // 10 minutes
});

// Comments change often
useQuery({
    queryKey: ["comments", articleId],
    queryFn: fetchComments,
    staleTime: 30 * 1000,  // 30 seconds
});
```

### 3. Browser Cache (CDN / Cloudinary)

Images and videos from Cloudinary are cached by the CDN. No action needed on the frontend. `next/image` handles cache headers automatically.

## Cache Invalidation

After a mutation, invalidate related queries:

```typescript
onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["comments", articleId] });
    queryClient.invalidateQueries({ queryKey: ["article", articleId] });
}
```

## Static Generation

For pages that can be fully static (home page, category pages), use `generateStaticParams`:

```typescript
// app/(public)/articles/[slug]/page.tsx
export async function generateStaticParams() {
    const slugs = await fetchAllArticleSlugs();
    return slugs.map((slug) => ({ slug }));
}
```

This pre-renders article pages at build time. Combined with `revalidate`, they refresh periodically without a full rebuild.
