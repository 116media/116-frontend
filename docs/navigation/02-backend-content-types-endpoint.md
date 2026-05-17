# Backend Gap — Public Content Types Endpoint

## The Problem

The `GET /api/v1/public/categories` endpoint accepts a `contentTypeId` query parameter (a `Guid`) to filter categories by content type. This is necessary to show only article categories in the news mega menu and only video categories in the videos mega menu.

However, there is no public endpoint to resolve the content type GUID by name. Content types are seeded with `Guid.NewGuid()` — random per environment — so the frontend cannot hardcode them.

The only existing endpoint for content types is admin-only:

```text
GET /api/v1/admin/content-types   ← requires authentication
```

## The Fix

Add `GET /api/v1/public/content-types` to the backend, following the exact same structure as the admin version.

### Files to Create

Under `src/Modules/Content/Content/Application/Lookup/UseCases/Public/Queries/GetAllContentTypes/`:

```text
PublicGetAllContentTypesQuery.cs
PublicGetAllContentTypesResult.cs
PublicGetAllContentTypesHandler.cs
V1/
  PublicGetAllContentTypesEndpointV1.cs
```

### Query

```csharp
// PublicGetAllContentTypesQuery.cs
public record PublicGetAllContentTypesQuery() : IQuery<PublicGetAllContentTypesResult>;
```

### Result

```csharp
// PublicGetAllContentTypesResult.cs
public record PublicGetAllContentTypesResult(IReadOnlyList<ContentTypeDto> ContentTypes);
```

### Handler

```csharp
// PublicGetAllContentTypesHandler.cs
public class PublicGetAllContentTypesHandler(ILookupRepository lookupRepository, IMapper mapper)
    : IQueryHandler<PublicGetAllContentTypesQuery, PublicGetAllContentTypesResult>
{
    public async Task<PublicGetAllContentTypesResult> Handle(
        PublicGetAllContentTypesQuery query,
        CancellationToken cancellationToken)
    {
        IReadOnlyList<ContentTypeEntity> contentTypes =
            await lookupRepository.GetAllContentTypesAsync(cancellationToken: cancellationToken);

        IReadOnlyList<ContentTypeDto> dtoList = contentTypes.ToContentTypeDtos(mapper);
        return new PublicGetAllContentTypesResult(ContentTypes: dtoList);
    }
}
```

### Endpoint

```csharp
// V1/PublicGetAllContentTypesEndpointV1.cs
public class PublicGetAllContentTypesEndpointV1 : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        RouteGroupBuilder group = app.MapApiVersionGroup(1)
            .MapGroup($"{ContentConstants.Public}/{LookupRouteConstants.ContentTypes}")
            .WithTags($"{ContentConstants.Public}::{LookupRouteConstants.ContentTypes}");

        group
            .MapGet(
                "/",
                async (IDispatcher dispatcher) =>
                {
                    var query = new PublicGetAllContentTypesQuery();
                    PublicGetAllContentTypesResult result = await dispatcher.Send(request: query);
                    var response = new PublicGetAllContentTypesResponse(ContentTypes: result.ContentTypes);
                    return Results.Ok(response);
                }
            )
            .WithName(endpointName: PublicGetAllContentTypesMetaField.PublicGetAllContentTypes.Name)
            .WithSummary(summary: PublicGetAllContentTypesMetaField.PublicGetAllContentTypes.Summary)
            .WithDescription(description: PublicGetAllContentTypesMetaField.PublicGetAllContentTypes.Description)
            .AllowAnonymous()
            .RequireRateLimiting(policyName: RateLimitPolicies.ContentBrowsing)
            .Produces<PublicGetAllContentTypesResponse>(statusCode: StatusCodes.Status200OK)
            .ProducesProblem(statusCode: StatusCodes.Status429TooManyRequests);
    }
}
```

No new route constants or repository methods are needed. `LookupRouteConstants.ContentTypes` already exists. The handler reuses the existing `ILookupRepository.GetAllContentTypesAsync()` already used by the admin handler.

## Response Shape

The endpoint reuses the existing `ContentTypeDto`:

```csharp
public record ContentTypeDto(Guid Id, string Name, bool IsActive);
```

Example response:

```json
{
  "contentTypes": [
    { "id": "a3f2...", "name": "Article", "isActive": true },
    { "id": "b91c...", "name": "Video",   "isActive": true },
    { "id": "cc47...", "name": "Short",   "isActive": true }
  ]
}
```

## How the Frontend Uses It

The articles repository resolves the Article content type ID at runtime:

```typescript
// modules/articles/infrastructure/repositories/articles.repository.impl.ts
const contentTypesResponse = await apiClient.api.publicGetAllContentTypes();
const articleType = contentTypesResponse.data.contentTypes.find(
    (ct) => ct.name === "Article"
);
const categories = await apiClient.api.publicGetActiveCategories({
    contentTypeId: articleType?.id,
});
```

The videos repository does the same with `"Video"`.

Both repository calls are made in parallel with the promoted content fetch, so the extra round-trip does not add latency on its own. See [Articles Module](04-articles-module.md) for the full implementation.
