# Client-Side Data Fetching

## When to Fetch on the Client

Client-side fetching is for data that:

- Changes based on user interaction (comments after posting)
- Is user-specific (bookmarks, playlists, like status)
- Needs real-time updates (view counts on shorts)
- Requires pagination controlled by the user (load more, infinite scroll)

## React Query Setup

```typescript
// src/shared/presentation/providers/QueryProvider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,       // 1 minute
                        gcTime: 5 * 60 * 1000,      // 5 minutes
                        retry: 1,
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
```

## Query Pattern

```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/infrastructure/api/client";

export function useArticleComments(articleId: string, page: number) {
    return useQuery({
        queryKey: ["comments", articleId, page],
        queryFn: async () => {
            const response = await apiClient.api.getArticleComments(articleId, {
                pageIndex: page,
                pageSize: 10,
            });
            return response.data;
        },
    });
}
```

## Mutation Pattern

```typescript
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/infrastructure/api/client";

export function usePostComment(articleId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: string) =>
            apiClient.api.addArticleComment(articleId, { body }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", articleId] });
        },
    });
}
```

## Optimistic Updates

For actions where the user expects instant feedback (likes, bookmarks):

```typescript
export function useLikeArticle(articleId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => apiClient.api.likeArticle(articleId),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["article-like", articleId] });

            const previous = queryClient.getQueryData(["article-like", articleId]);

            queryClient.setQueryData(["article-like", articleId], (old: any) => ({
                ...old,
                isLiked: true,
                likeCount: (old?.likeCount ?? 0) + 1,
            }));

            return { previous };
        },
        onError: (_err, _vars, context) => {
            queryClient.setQueryData(["article-like", articleId], context?.previous);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["article-like", articleId] });
        },
    });
}
```

## Infinite Scroll

For content feeds (shorts, comments):

```typescript
import { useInfiniteQuery } from "@tanstack/react-query";

export function usePublicShorts() {
    return useInfiniteQuery({
        queryKey: ["shorts"],
        queryFn: async ({ pageParam = 0 }) => {
            const response = await apiClient.api.getPublicShorts({
                pageIndex: pageParam,
                pageSize: 12,
            });
            return response.data.shorts;
        },
        getNextPageParam: (lastPage) => {
            const nextIndex = lastPage.pageIndex + 1;
            const totalPages = Math.ceil(lastPage.count / lastPage.pageSize);
            return nextIndex < totalPages ? nextIndex : undefined;
        },
        initialPageParam: 0,
    });
}
```
