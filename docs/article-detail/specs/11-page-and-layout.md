# Spec 11 — Page, Layout & Metadata

Design ref: [../04-page-composition.md](../04-page-composition.md),
[../02-architecture.md](../02-architecture.md), [../17-seo-and-metadata.md](../17-seo-and-metadata.md).

The route (RSC + `generateMetadata`), the client container that hydrates the query, and
the `ArticleDetail` assembler that holds the whole entity and distributes scoped props to
the sub-composers specced in [04](04-cover-and-header.md)–[10](10-comments.md).

> **This Next.js is customized.** Read the current page / `params` / `generateMetadata`
> API in `node_modules/next/dist/docs/` before writing this route (see
> `apps/frontend/AGENTS.md`). At the time of writing: `params` is a **`Promise`** that
> must be `await`ed; pages and metadata may be typed with the global
> `PageProps<'/articles/[slug]'>` helper; `notFound()` is callable from both the page and
> `generateMetadata`. Do not assume the older synchronous-`params` shape.

---

## 1. `ArticleDetail` (presentation assembler)

`src/modules/articles/presentation/components/ArticleDetail/ArticleDetail.tsx`.

The only component that holds the whole `IArticleDetailEntity`. It lays out the two-column
reading shell and passes each sub-composer **only the fields it renders**. The engagement
comment button and the comments section are wired through a shared `commentsRef`.

```tsx
"use client";

import { useEffect, useRef } from "react";

import type { IArticleDetailEntity } from "@/modules/articles/domain/entities/IArticleDetailEntity";

import { ArticleDetailBody } from "./ArticleDetail.Body";
import { ArticleDetailComments } from "./ArticleDetail.Comments";
import { ArticleDetailEngagement } from "./ArticleDetail.Engagement";
import { ArticleDetailHero } from "./ArticleDetail.Hero";
import { ArticleDetailPopularSidebar } from "./ArticleDetail.PopularSidebar";
import { ArticleDetailReadingProgress } from "./ArticleDetail.ReadingProgress";
import { ArticleDetailShareRail } from "./ArticleDetail.ShareRail";
import { ArticleDetailTags } from "./ArticleDetail.Tags";

/**
 * ArticleDetail
 *
 * @description
 * The presentation assembler for the single-article page. Holds the whole
 * `IArticleDetailEntity` and distributes scoped props to each sub-composer — reading
 * progress, share rail, hero, body, tags, engagement, comments, and the popular sidebar —
 * laying them out in the two-column reading shell (a sticky share rail on the left, the
 * reading column in the center, the popular sidebar on the right; all stacked on mobile).
 * This is the only component that receives the entire entity; every child takes only the
 * fields it renders. A `commentsRef` links the engagement comment button to the comments
 * section so the button scrolls the reader to the composer instead of navigating.
 *
 * @param article - The fully resolved article to render.
 */
export function ArticleDetail({ article }: { article: IArticleDetailEntity }) {
    const commentsRef = useRef<HTMLElement>(null);

    const scrollToComments = () => {
        commentsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("comments") === "1") scrollToComments();
    }, []);

    return (
        <div className="relative flex flex-col gap-8">
            <ArticleDetailReadingProgress />

            <div className="lg:grid lg:grid-cols-[auto_minmax(0,1fr)_20rem] lg:gap-8">
                <aside className="lg:sticky lg:top-24 lg:h-fit">
                    <ArticleDetailShareRail
                        articleId={article.id}
                        slug={article.slug}
                        title={article.title}
                    />
                </aside>

                <article className="flex min-w-0 flex-col gap-8">
                    <ArticleDetailHero
                        categoryName={article.categoryName}
                        title={article.title}
                        headline={article.headline}
                        coverImageUrl={article.coverImageUrl}
                        author={article.author}
                        publishedAt={article.publishedAt}
                        readTimeInMinutes={article.readTimeInMinutes}
                    />
                    <ArticleDetailBody
                        body={article.body}
                        images={article.images}
                    />
                    <ArticleDetailTags tags={article.tags} />
                    <ArticleDetailEngagement
                        articleId={article.id}
                        likeCount={article.likeCount}
                        commentCount={article.commentCount}
                        bookmarkCount={article.bookmarkCount}
                        onCommentClick={scrollToComments}
                    />
                    <ArticleDetailComments
                        ref={commentsRef}
                        articleId={article.id}
                        commentCount={article.commentCount}
                    />
                </article>

                <aside className="mt-12 lg:mt-0">
                    <ArticleDetailPopularSidebar currentArticleId={article.id} />
                </aside>
            </div>
        </div>
    );
}
```

> The `PopularSidebar` aside sits **after** the reading column in source order, so on
> mobile (single column) it naturally stacks below the comments; on `lg+` the grid places
> it in the right track. The share-rail `aside` becomes a horizontal row on mobile inside
> `ArticleDetail.ShareRail` (see [07-share-rail.md](07-share-rail.md)).

---

## 2. `ArticleDetailContainer` (client)

`src/modules/articles/presentation/components/ArticleDetail/index.tsx`. Marked
`"use client"`. Hydrates the query from the server-fetched `initialData` (no refetch on
mount) and selects the loading / error / data view. Because the page already fetched and
gated on `notFound()`, `initialData` is present on first render; the container's own
loading/error states cover client-side refetches and invalidations.

```tsx
"use client";

import type { IArticleDetailEntity } from "@/modules/articles/domain/entities/IArticleDetailEntity";
import { useArticleDetail } from "@/modules/articles/presentation/hooks/useArticleDetail";

import { ArticleDetail } from "./ArticleDetail";
import { ArticleDetailError } from "./ArticleDetail.Error";
import { ArticleDetailLoading } from "./ArticleDetail.Loading";

/**
 * Props for ArticleDetailContainer.
 *
 * @interface ArticleDetailContainerProps
 * @property {string} slug - The article slug, used as the query key and refetch target.
 * @property {IArticleDetailEntity} initialData - The server-fetched article that seeds the
 * client query so it hydrates without a refetch on mount.
 */
export interface ArticleDetailContainerProps {
    slug: string;
    initialData: IArticleDetailEntity;
}

/**
 * ArticleDetailContainer
 *
 * @description
 * The client container for the single-article page. Seeds {@link useArticleDetail} with
 * the server-fetched `initialData`, so the interactive shell hydrates without a second
 * network round-trip, and selects the loading / error / data view. Renders
 * {@link ArticleDetail} with the resolved entity. The route already gated a missing
 * article via `notFound()`, so `initialData` is always present on first paint; the
 * loading/error branches cover client refetches and cache invalidations.
 *
 * @param slug - The article slug.
 * @param initialData - The server-fetched article seeding the query.
 */
export function ArticleDetailContainer({ slug, initialData }: ArticleDetailContainerProps) {
    const { data, isLoading, isError, refetch } = useArticleDetail(slug, { initialData });

    if (isLoading) return <ArticleDetailLoading />;
    if (isError || !data) return <ArticleDetailError onRetry={() => refetch()} />;

    return <ArticleDetail article={data} />;
}
```

Loading / error views (`ArticleDetail.Loading`, `ArticleDetail.Error`) are specced in
[../15-loading-empty-error.md](../15-loading-empty-error.md). `useArticleDetail`'s
`initialData` option is defined in [03-hooks-and-keys.md](03-hooks-and-keys.md).

---

## 3. The route + `generateMetadata`

`app/(public)/articles/[slug]/page.tsx`.

The page awaits the dynamic `slug`, resolves the server cradle exactly as
`ArticlePromotionFeedContainer` does, fetches the article server-side, gates a
missing/unpublished article through `notFound()`, and seeds the client container with the
result. `generateMetadata` fetches the same slug for SEO. The full SEO surface (JSON-LD,
author/section tags, image dimensions) is in [../17-seo-and-metadata.md](../17-seo-and-metadata.md);
this spec shows only the `generateMetadata` skeleton.

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleDetailContainer } from "@/modules/articles/presentation/components/ArticleDetail";
import { createServerCradle } from "@/shared/infrastructure/server.cradle";

/**
 * generateMetadata
 *
 * @description
 * Server-side SEO for the single-article route. Awaits the `slug`, resolves the server
 * cradle, and fetches the article; a missing article triggers `notFound()`. Returns the
 * title (`metaTitle` first, else the article title), description (`metaDescription` first,
 * else the headline), the canonical `/articles/{slug}` URL, and Open Graph tags (article
 * type, cover image). The full SEO surface (JSON-LD, author/section, image dimensions)
 * is documented separately.
 *
 * @param params - The route params promise carrying the article `slug`.
 * @returns The metadata for the article page.
 */
export async function generateMetadata({
    params
}: PageProps<"/articles/[slug]">): Promise<Metadata> {
    const { slug } = await params;
    const cradle = await createServerCradle();
    const result = await cradle.getArticleBySlugUseCase.execute(slug);

    if (!result.ok) notFound();

    const article = result.value;
    const title = article.metaTitle ?? article.title;
    const description = article.metaDescription ?? article.headline;

    return {
        title,
        description,
        alternates: { canonical: `/articles/${article.slug}` },
        openGraph: {
            type: "article",
            title,
            description,
            images: article.coverImageUrl ? [article.coverImageUrl] : []
        }
    };
}

/**
 * ArticleDetailPage
 *
 * @description
 * The public single-article route (`/articles/[slug]`). Awaits the dynamic `slug`,
 * resolves the server cradle, and fetches the article server-side for SEO and a fast
 * first paint. A missing or unpublished article triggers `notFound()`. The resolved
 * entity seeds the client `ArticleDetailContainer` as `initialData`, so the client query
 * hydrates without a refetch.
 *
 * @param params - The route params promise carrying the article `slug`.
 */
export default async function ArticleDetailPage({ params }: PageProps<"/articles/[slug]">) {
    const { slug } = await params;
    const cradle = await createServerCradle();
    const result = await cradle.getArticleBySlugUseCase.execute(slug);

    if (!result.ok) notFound();

    return (
        <ArticleDetailContainer
            slug={slug}
            initialData={result.value}
        />
    );
}
```

> Confirm `PageProps<'/articles/[slug]'>` is the current type helper in
> `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md` before
> relying on it; if the customized build differs, type `params` as
> `Promise<{ slug: string }>` explicitly and `await` it the same way.

---

## Tasks

- [ ] `ArticleDetail` assembler — holds the whole entity; distributes scoped props to
      Hero / Body / Tags / Engagement / ShareRail / PopularSidebar / Comments; two-column
      `lg` grid (sticky share rail · reading column · popular sidebar), single column on
      mobile with the sidebar below comments.
- [ ] `commentsRef` links the engagement comment button to the comments section
      (`scrollIntoView`); `?comments=1` auto-scrolls once on mount.
- [ ] `ArticleDetailContainer` — `"use client"`; `useArticleDetail(slug, { initialData })`
      hydrates without a refetch; loading / error / data selection.
- [ ] Route `app/(public)/articles/[slug]/page.tsx` — async RSC; `await params`; server
      cradle + `getArticleBySlugUseCase`; `notFound()` on not-ok; seeds the container with
      `initialData`.
- [ ] `generateMetadata` — same slug fetch; `metaTitle ?? title`,
      `metaDescription ?? headline`, canonical, Open Graph (article type + cover image);
      `notFound()` on not-ok. JSON-LD / full SEO lives in
      [../17-seo-and-metadata.md](../17-seo-and-metadata.md).
- [ ] Verified against the current Next API in `node_modules/next/dist/docs/`
      (`params` promise, `PageProps` helper, `notFound()` in metadata).
- [ ] `tsc` + biome clean; direct `/articles/{unknown}` renders the 404; a known slug
      renders server-side and hydrates without a visible refetch.
