"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { ArticlesGrid } from "@/modules/articles/presentation/components/sections/ArticlesGrid";
import { ArticlesGridLoading } from "@/modules/articles/presentation/components/sections/ArticlesGrid/ArticlesGrid.Loading";
import { useMyArticleBookmarks } from "@/modules/articles/presentation/hooks/useMyArticleBookmarks";
import { useAuthModal } from "@/modules/auth/presentation/context/AuthModalProvider";
import { useAuth } from "@/modules/auth/presentation/context/AuthProvider";
import { Button } from "@/shared/presentation/components/ui/Button";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { AlertCircleIcon, BookmarkIcon, LockIcon } from "@/shared/presentation/components/ui/Icon";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";
import { INFINITE_SCROLL_SENTINEL_OPTIONS } from "@/shared/presentation/constants/infiniteScroll";
import { useIntersectionObserver } from "@/shared/presentation/hooks/useIntersectionObserver";

/**
 * BookmarksContainer
 *
 * @description
 * Owns the "my bookmarks" page: gates on the auth session, then drives
 * {@link useMyArticleBookmarks} into the shared article grid with infinite scroll.
 * Guests get a login prompt that opens the auth modal; the session-restore phase shows
 * the grid skeleton so there is no logged-out flash.
 */
export function BookmarksContainer() {
    const { t } = useTranslation();
    const { status, isAuthenticated } = useAuth();
    const { open } = useAuthModal();

    const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useMyArticleBookmarks(isAuthenticated);

    const [sentinelRef, isSentinelVisible] = useIntersectionObserver(
        INFINITE_SCROLL_SENTINEL_OPTIONS
    );

    const articles = data?.pages.flatMap((page) => page.items) ?? [];

    useEffect(() => {
        if (isSentinelVisible && hasNextPage && !isFetchingNextPage) fetchNextPage();
    }, [isSentinelVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const heading = (
        <div className="flex flex-col gap-1">
            <h1 className="font-bold text-2xl text-foreground lg:text-3xl">
                {t("articles.bookmarks.title")}
            </h1>
            <p className="text-muted-foreground text-sm">{t("articles.bookmarks.subtitle")}</p>
        </div>
    );

    if (status !== "loading" && !isAuthenticated) {
        return (
            <div className="flex flex-col gap-6">
                {heading}
                <EmptyState
                    context="bookmarks-guest"
                    icon={<LockIcon className="size-10" />}
                    title={t("articles.bookmarks.loginPrompt")}
                    action={
                        <Button
                            variant="outline"
                            onClick={() => open("login")}
                        >
                            {t("articles.bookmarks.loginCta")}
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {heading}
            <StateRenderer
                data={articles}
                loading={isLoading || status === "loading"}
                error={isError}
                skeleton={<ArticlesGridLoading />}
                errorState={
                    <EmptyState
                        context="bookmarks-error"
                        icon={<AlertCircleIcon className="size-10" />}
                        title={t("articles.bookmarks.error.title")}
                        action={
                            <Button
                                variant="outline"
                                onClick={() => refetch()}
                            >
                                {t("articles.bookmarks.error.retry")}
                            </Button>
                        }
                    />
                }
                empty={
                    <EmptyState
                        context="bookmarks-empty"
                        icon={<BookmarkIcon className="size-10" />}
                        title={t("articles.bookmarks.empty.title")}
                        subtitle={t("articles.bookmarks.empty.body")}
                    />
                }
                render={(items) => (
                    <div className="flex flex-col gap-8">
                        <ArticlesGrid articles={items} />
                        {isFetchingNextPage && <ArticlesGridLoading rows={1} />}
                        {hasNextPage ? (
                            <div
                                aria-hidden
                                ref={sentinelRef}
                                className="h-px"
                            />
                        ) : (
                            <p className="text-center text-muted-foreground text-sm">
                                {t("articles.bookmarks.endOfList")}
                            </p>
                        )}
                    </div>
                )}
            />
        </div>
    );
}
