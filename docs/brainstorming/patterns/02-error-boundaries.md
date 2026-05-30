# Error Boundaries

## How They Work in Next.js 16

Every route segment can have an `error.tsx` file that catches errors thrown by its page or nested components. These are Client Components that receive the error and a reset function.

## Route-Level Error Boundaries

```typescript
// app/(public)/articles/[slug]/error.tsx
"use client";

import { Button } from "@/shared/presentation/components/ui/button";

export default function ArticleError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <h2 className="text-2xl font-bold mb-2">Une erreur est survenue</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
                Nous n'avons pas pu charger cet article. Veuillez réessayer.
            </p>
            <Button onClick={reset}>Réessayer</Button>
        </div>
    );
}
```

## Global Error Boundary

```typescript
// app/error.tsx
"use client";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Erreur 500</h1>
                    <p className="text-muted-foreground mt-2">
                        Une erreur inattendue s'est produite.
                    </p>
                    <button onClick={reset} className="mt-4 underline">
                        Réessayer
                    </button>
                </div>
            </body>
        </html>
    );
}
```

## Not Found Pages

```typescript
// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <h1 className="text-6xl font-bold text-brand-primary">404</h1>
            <h2 className="text-2xl font-semibold mt-4">Page introuvable</h2>
            <p className="text-muted-foreground mt-2">
                La page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            <Link href="/" className="mt-6 text-brand-primary hover:underline">
                Retour à l'accueil
            </Link>
        </div>
    );
}
```

## Triggering Not Found

In Server Components, call `notFound()` to render the nearest `not-found.tsx`:

```typescript
import { notFound } from "next/navigation";

export default async function ArticlePage({ params }: Props) {
    const result = await repository.getArticleBySlug(params.slug);
    if (!result.ok) notFound();
    // ...
}
```
