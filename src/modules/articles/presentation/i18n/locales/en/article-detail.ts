/**
 * articleDetail (en)
 *
 * @description
 * English strings for the single-article page: engagement labels, error/not-found states,
 * share rail, comments section, and popular sidebar. Spread by the locale barrel next to
 * the `articles` bundle. Must hold the exact same keys as the French mirror.
 */
export const articleDetail = {
    detail: {
        like: "Like",
        bookmark: "Bookmark",
        comment: "Comment",
        share: "Share",
        tags: "Tags",
        writtenBy: "Written by",
        backToArticles: "Back to articles",
        notFound: {
            title: "Article not found",
            subtitle: "This article may have been removed or the link is wrong."
        },
        error: {
            title: "Couldn't load this article",
            subtitle: "Something went wrong. Check your connection and try again.",
            retry: "Try again"
        }
    },
    share: {
        facebook: "Share on Facebook",
        x: "Share on X",
        whatsapp: "Share on WhatsApp",
        copy: "Copy link",
        copied: {
            title: "Link copied",
            description: "The article link is in your clipboard."
        }
    },
    comments: {
        title_one: "{{count}} comment",
        title_other: "{{count}} comments",
        placeholder: "Add a comment…",
        composerLabel: "Write a comment",
        submit: "Post comment",
        anonymousUser: "Reader",
        loginPrompt: "Log in to join the conversation.",
        loginCta: "Log in to comment",
        removed: "This comment was removed",
        loadMore: "Load more comments",
        empty: {
            title: "No comments yet",
            body: "Be the first to share your thoughts."
        },
        error: {
            title: "Couldn't load comments",
            retry: "Try again"
        },
        postError: {
            title: "Comment not posted",
            description: "Something went wrong. Your text is still here — try again."
        }
    },
    sidebar: {
        popular: "Popular articles"
    }
} as const;
