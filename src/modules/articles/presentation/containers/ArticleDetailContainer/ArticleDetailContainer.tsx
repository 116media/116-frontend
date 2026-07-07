"use client";

import type { IArticleDetailEntity } from "@/modules/articles/domain/entities/IArticleDetailEntity";
import { ArticleDetail } from "@/modules/articles/presentation/components/pages/ArticleDetail";
import { ArticleDetailError } from "@/modules/articles/presentation/components/pages/ArticleDetail/ArticleDetail.Error";
import { ArticleDetailLoading } from "@/modules/articles/presentation/components/pages/ArticleDetail/ArticleDetail.Loading";
import { useArticleDetail } from "@/modules/articles/presentation/hooks/useArticleDetail";

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
 * Client container for the single-article page. Seeds {@link useArticleDetail} with the
 * server-fetched `initialData` so hydration skips a refetch; the loading/error branches
 * only cover client refetches and cache invalidations.
 */
export function ArticleDetailContainer({ slug, initialData }: ArticleDetailContainerProps) {
    const { data, isLoading, isError, refetch } = useArticleDetail(slug, { initialData });

    if (isLoading) return <ArticleDetailLoading />;
    if (isError || !data) return <ArticleDetailError onRetry={() => refetch()} />;

    return <ArticleDetail article={data} />;
}
