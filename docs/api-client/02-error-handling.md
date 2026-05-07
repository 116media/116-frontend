# Error Handling

## Error Types

The backend returns RFC 7807 Problem Details for all errors. The frontend maps these to a `Failure` type, same pattern as the dashboard.

```typescript
// src/shared/domain/failures/failure.ts
export interface Failure {
    readonly title: string;
    readonly detail: string;
}

export interface ServerFailure extends Failure {
    readonly status: number;
    readonly errors?: IValidationError[];
    readonly retryAfter?: number;
}
```

## Error Mapping

```typescript
// src/shared/infrastructure/mappers/problem.mapper.ts
export const ProblemMapper = {
    toFailure(error: unknown): Failure {
        if (isAxiosError(error) && error.response?.data) {
            const problem = error.response.data;
            return {
                title: problem.title || "Erreur",
                detail: problem.detail || "Une erreur inattendue est survenue.",
                status: problem.status || error.response.status,
                errors: problem.errors,
            };
        }
        return {
            title: "Erreur",
            detail: "Une erreur inattendue est survenue.",
        };
    },
};
```

## Error Handling by Context

### Server Components

Use `notFound()` for 404s, throw for other errors (caught by error.tsx):

```typescript
const result = await repository.getArticleBySlug(slug);
if (!result.ok) {
    if (result.error.status === 404) notFound();
    throw new Error(result.error.detail);
}
```

### React Query

Errors are available in the query result:

```typescript
const { data, error, isError } = useArticleComments(articleId);

if (isError) {
    return <ErrorMessage failure={error} />;
}
```

### Mutations

Handle in the `onError` callback:

```typescript
const like = useMutation({
    mutationFn: () => apiClient.api.likeArticle(articleId),
    onError: (error) => {
        toast.error(ProblemMapper.toFailure(error).detail);
    },
});
```

## Rate Limiting (429)

When the API returns 429, show a friendly message and respect the `Retry-After` header:

```typescript
if (failure.status === 429) {
    toast.error(`Trop de requêtes. Réessayez dans ${failure.retryAfter} secondes.`);
}
```
