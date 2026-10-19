import type { QueryClient, QueryKey } from "@tanstack/react-query";
import type { RefObject } from "react";

import type { IArticleCommentEntity } from "@/modules/articles/domain/entities/IArticleCommentEntity";
import type { IArticleCommentPage } from "@/modules/articles/domain/entities/IArticleCommentPage";

/**
 * Shape of an infinite comment query's cached data: the pages of a comment list or a
 * reply thread, as stored by TanStack Query.
 */
interface IInfiniteCommentData {
    pages: IArticleCommentPage[];
    pageParams: unknown[];
}

/**
 * patchCommentInCache
 *
 * @description
 * Applies a partial patch to one comment inside an infinite comment cache (the article's
 * comment list or a reply thread), leaving every other row untouched. No-ops when the
 * cache or the comment is absent.
 *
 * @param queryClient - The active query client.
 * @param queryKey - The infinite comment query to patch.
 * @param commentId - The comment to patch.
 * @param patch - The fields to overwrite on the matched comment.
 */
export function patchCommentInCache(
    queryClient: QueryClient,
    queryKey: QueryKey,
    commentId: string,
    patch: Partial<IArticleCommentEntity>
): void {
    queryClient.setQueryData<IInfiniteCommentData>(queryKey, (current) => {
        if (!current) return current;
        return {
            ...current,
            pages: current.pages.map((page) => ({
                ...page,
                items: page.items.map((comment) =>
                    comment.id === commentId ? { ...comment, ...patch } : comment
                )
            }))
        };
    });
}

/**
 * prependCommentToCache
 *
 * @description
 * Prepends a comment to the first page of an infinite comment cache and bumps its
 * `count`, so a just-posted row appears immediately. No-ops when the cache is absent.
 *
 * @param queryClient - The active query client.
 * @param queryKey - The infinite comment query to prepend into.
 * @param comment - The comment to prepend.
 */
export function prependCommentToCache(
    queryClient: QueryClient,
    queryKey: QueryKey,
    comment: IArticleCommentEntity
): void {
    queryClient.setQueryData<IInfiniteCommentData>(queryKey, (current) => {
        if (!current) return current;
        const [first, ...rest] = current.pages;
        if (!first) return current;
        const nextFirst: IArticleCommentPage = {
            ...first,
            items: [comment, ...first.items],
            count: first.count + 1
        };
        return { ...current, pages: [nextFirst, ...rest] };
    });
}

/**
 * byLikes
 *
 * @description
 * Most-liked first, keeping the API's order among equals, so the popular tab reorders the
 * thread without shuffling comments that are level on likes.
 *
 * @param comments - The loaded comments.
 * @returns {IArticleCommentEntity[]} A sorted copy.
 */
export function byLikes(comments: IArticleCommentEntity[]): IArticleCommentEntity[] {
    return [...comments].sort((a, b) => b.likeCount - a.likeCount);
}

/**
 * focusComposer
 *
 * @description
 * Scrolls the comments section into view and focuses the composer textarea, using
 * `preventScroll` so the focus does not compete with the smooth scroll. When the composer
 * is not mounted (guest view), only the section scroll runs.
 *
 * @param sectionRef - The comments section ref held by the assembler.
 * @param composerRef - The composer textarea ref held by the assembler.
 */
export function focusComposer(
    sectionRef: RefObject<HTMLElement | null>,
    composerRef: RefObject<HTMLTextAreaElement | null>
): void {
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    composerRef.current?.focus({ preventScroll: true });
}
