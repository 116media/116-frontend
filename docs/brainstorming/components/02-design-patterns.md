# Component Design Patterns

## Server vs Client Components

The most important pattern decision in the entire frontend. Get this wrong and you ship unnecessary JavaScript to the client or lose interactivity.

### Rule of Thumb

- **Server Component** (default): Anything that renders static content, fetches data, or does not need browser APIs
- **Client Component** (`"use client"`): Anything with `useState`, `useEffect`, event handlers, browser APIs, or third-party client libraries

### The Boundary Pattern

Keep the client boundary as low as possible in the component tree. The page-level container is a Server Component. Only the interactive parts are Client Components.

```typescript
// Server Component (no "use client")
export async function ArticleDetailContainer({ slug }: { slug: string }) {
    const article = await fetchArticle(slug);

    return (
        <article>
            {/* Server-rendered, zero JS */}
            <ArticleHeader article={article} />
            <ArticleBody content={article.body} />
            <ArticleTags tags={article.tags} />

            {/* Client boundary starts here */}
            <ArticleInteractions articleId={article.id} />
        </article>
    );
}

// Client Component
"use client";
function ArticleInteractions({ articleId }: { articleId: string }) {
    const like = useLikeArticle(articleId);
    const bookmark = useBookmarkArticle(articleId);

    return (
        <div className="flex gap-4">
            <LikeButton onClick={like.mutate} />
            <BookmarkButton onClick={bookmark.mutate} />
            <ShareButton articleId={articleId} />
        </div>
    );
}
```

## Composition Pattern

Prefer composition over configuration. Instead of one component with 15 props, compose smaller components.

```typescript
// Bad: one monolith
<ArticleCard
    title={article.title}
    headline={article.headline}
    coverImage={article.coverImageUrl}
    author={article.author}
    publishedAt={article.publishedAt}
    categoryName={article.categoryName}
    tags={article.tags}
    readTime={article.readTimeInMinutes}
    isPromoted={article.isPromoted}
    slug={article.slug}
/>

// Good: composed from smaller parts
<ArticleCard href={`/articles/${article.slug}`}>
    <ArticleCard.Image src={article.coverImageUrl} alt={article.title} />
    <ArticleCard.Badge>{article.categoryName}</ArticleCard.Badge>
    <ArticleCard.Title>{article.title}</ArticleCard.Title>
    <ArticleCard.Description>{article.headline}</ArticleCard.Description>
    <ArticleCard.Footer>
        <ArticleCard.Author author={article.author} />
        <ArticleCard.ReadTime minutes={article.readTimeInMinutes} />
    </ArticleCard.Footer>
</ArticleCard>
```

## Container/Presentational Pattern

Same as the dashboard. Containers handle data, presentational components handle rendering.

```text
containers/
  ArticleListContainer.tsx    # Fetches data, passes to components
  ArticleDetailContainer.tsx

components/
  ArticleCard/                # Pure UI, receives props
  ArticleGrid/
  ArticleBody/
  ArticleComments/
```

Containers are typically Server Components. Presentational components can be either, depending on whether they need interactivity.

## Render Props for Flexibility

When a component needs to render different content in different contexts:

```typescript
interface DataListProps<T> {
    items: T[];
    renderItem: (item: T) => React.ReactNode;
    emptyState?: React.ReactNode;
    className?: string;
}

function DataList<T>({ items, renderItem, emptyState, className }: DataListProps<T>) {
    if (items.length === 0) {
        return emptyState || <p className="text-muted-foreground">Aucun résultat.</p>;
    }

    return (
        <div className={className}>
            {items.map((item, index) => (
                <Fragment key={index}>{renderItem(item)}</Fragment>
            ))}
        </div>
    );
}

// Usage
<DataList
    items={articles}
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    renderItem={(article) => <ArticleCard article={article} />}
    emptyState={<EmptyArticles />}
/>
```

## Custom Hook Pattern

Extract complex logic into hooks. One hook per concern.

```typescript
// Bad: all logic in the component
function CommentSection({ articleId }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    // ... 50 more lines of logic

    return <div>...</div>;
}

// Good: logic in hooks
function CommentSection({ articleId }) {
    const { comments, loading } = useArticleComments(articleId);
    const { submit, submitting } = usePostComment(articleId);

    return <div>...</div>;
}
```

## Forwarding Refs and Polymorphic Components

For UI primitives that need to compose with other libraries or HTML elements:

```typescript
import { forwardRef } from "react";
import { cn } from "@/shared/presentation/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "destructive";
    size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-lg font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    "disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";
```

## Error State Pattern

Every component that displays data should handle three states: loading, error, and empty.

```typescript
interface AsyncContentProps<T> {
    data: T | undefined;
    loading: boolean;
    error: Error | null;
    skeleton: React.ReactNode;
    empty: React.ReactNode;
    children: (data: T) => React.ReactNode;
}

function AsyncContent<T>({ data, loading, error, skeleton, empty, children }: AsyncContentProps<T>) {
    if (loading) return skeleton;
    if (error) return <ErrorMessage error={error} />;
    if (!data || (Array.isArray(data) && data.length === 0)) return empty;
    return children(data);
}
```
