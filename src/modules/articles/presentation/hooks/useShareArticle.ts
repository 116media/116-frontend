"use client";

import container from "@/shared/infrastructure/service.locator";

/**
 * useShareArticle
 *
 * @description
 * Opens the native share sheet for an article and, when available, records the share via
 * the share use case (fire-and-forget telemetry — failures are swallowed). Falls back to
 * copying the URL when the Web Share API is unavailable.
 *
 * @param articleId - The article being shared.
 * @param slug - The article slug (used to build the share URL).
 * @returns An async function that runs the share flow.
 */
export function useShareArticle(articleId: string, slug: string) {
    return async () => {
        const url = `${window.location.origin}/articles/${slug}`;
        if (navigator.share) {
            try {
                await navigator.share({ url });
            } catch {
                return;
            }
            container.cradle.shareArticleUseCase.execute({ articleId, shareChannel: "webshare" });
            return;
        }
        await navigator.clipboard.writeText(url);
        container.cradle.shareArticleUseCase.execute({ articleId, shareChannel: "clipboard" });
    };
}
