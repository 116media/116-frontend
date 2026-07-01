"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/presentation/components/ui/Button";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { NewspaperIcon } from "@/shared/presentation/components/ui/Icon";
import { ARTICLES_PATH } from "@/shared/presentation/constants/paths";

/**
 * ArticleDetailNotFound
 *
 * @description
 * The content of the article route's not-found boundary, rendered when
 * `getArticleBySlug` reports the slug is missing or unpublished and the page calls
 * Next's `notFound()`. Shows the shared `EmptyState` with the not-found copy and a link
 * back to the article feed, so a dead link resolves to a clear dead-end rather than a
 * stack trace.
 */
export function ArticleDetailNotFound() {
    const { t } = useTranslation();
    return (
        <EmptyState
            context="article-detail-not-found"
            icon={<NewspaperIcon className="size-10" />}
            title={t("articles.detail.notFound.title")}
            subtitle={t("articles.detail.notFound.subtitle")}
            action={
                <Button
                    asChild
                    variant="outline"
                >
                    <Link href={ARTICLES_PATH}>{t("articles.detail.backToArticles")}</Link>
                </Button>
            }
        />
    );
}
