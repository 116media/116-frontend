# Reusable Component Library

## Layered Component Strategy

Components are organized in three tiers:

### Tier 1: shadcn/ui Primitives

Located in `src/shared/presentation/components/ui/`. These are the building blocks: Button, Card, Dialog, Input, Badge, Skeleton, etc. They know nothing about 116 business logic.

### Tier 2: Shared Domain Components

Located in `src/shared/presentation/components/`. These compose shadcn primitives into reusable patterns specific to 116 but not to any single module:

| Component | Purpose |
| --- | --- |
| `ContentCard` | Generic card with image, title, description, footer |
| `AuthorBadge` | Avatar + username + role |
| `CategoryBadge` | Colored badge for content categories |
| `TagList` | Horizontal list of clickable tags |
| `Pagination` | Page navigation with prev/next and numbered pages |
| `EmptyState` | Illustration + message for empty lists |
| `ErrorMessage` | Formatted error display from Failure type |
| `ShareButton` | Share modal with copy link, social buttons |
| `LikeButton` | Heart icon with count, animated toggle |
| `BookmarkButton` | Bookmark icon with toggle |
| `ReadTime` | Clock icon + "5 min de lecture" |
| `PublishedDate` | Formatted relative date ("il y a 3 jours") |
| `SearchBar` | Debounced search input with clear button |
| `InfiniteScrollTrigger` | Intersection observer wrapper |

### Tier 3: Module Components

Located in `src/modules/[module]/presentation/components/`. These are specific to one content type:

| Component | Module | Purpose |
| --- | --- | --- |
| `ArticleCard` | articles | Article preview card for grids |
| `ArticleBody` | articles | Rich HTML renderer with prose styles |
| `ArticleComments` | articles | Comment list + form |
| `VideoCard` | videos | Video thumbnail card with duration |
| `VideoPlayer` | videos | YouTube embed or Plyr player |
| `ShortCard` | shorts | Vertical video thumbnail |
| `ShortPlayer` | shorts | Full-screen short video player |
| `LyricsDisplay` | lyrics | Formatted lyrics text with language badge |

## Component API Guidelines

### Props over Configuration

Every component should accept className for style overrides:

```typescript
interface ArticleCardProps {
    article: IArticleSummaryEntity;
    className?: string;
    priority?: boolean; // for above-the-fold images
}
```

### Compound Components for Complex UI

```typescript
// Usage
<ContentCard>
    <ContentCard.Image src={...} alt={...} />
    <ContentCard.Body>
        <ContentCard.Title>...</ContentCard.Title>
        <ContentCard.Description>...</ContentCard.Description>
    </ContentCard.Body>
    <ContentCard.Footer>...</ContentCard.Footer>
</ContentCard>
```

### Skeleton Variants

Every component that displays async data should have a matching skeleton:

```typescript
// ArticleCard has ArticleCardSkeleton
export function ArticleCardSkeleton() {
    return (
        <Card>
            <Skeleton className="aspect-video w-full" />
            <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </CardContent>
        </Card>
    );
}
```

## Naming Conventions

- Component folders: PascalCase (`ArticleCard/`)
- Component files: `index.tsx` inside the folder
- Skeleton variant: exported from the same file or `skeleton.tsx`
- Hooks: camelCase with `use` prefix (`useLikeArticle.ts`)
- Types: PascalCase with `I` prefix for interfaces (`IArticleCardProps`)
