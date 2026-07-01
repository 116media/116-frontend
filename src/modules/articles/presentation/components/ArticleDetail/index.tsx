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
