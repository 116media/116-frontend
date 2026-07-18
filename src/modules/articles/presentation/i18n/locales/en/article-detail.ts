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
        title: "Share this article",
        subtitle: "Share this article on your social media",
        linkLabel: "Article link",
        copyAction: "Copy",
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
        like: "Like this comment",
        unlike: "Remove like from this comment",
        reply: "Reply",
        replyPlaceholder: "Write a reply…",
        replySubmit: "Post reply",
        replyCancel: "Cancel",
        viewReplies_one: "View {{count}} reply",
        viewReplies_other: "View {{count}} replies",
        hideReplies: "Hide replies",
        loadMoreReplies: "Load more replies",
        repliesError: {
            title: "Couldn't load replies",
            retry: "Try again"
        },
        edit: "Edit",
        editSave: "Save",
        editCancel: "Cancel",
        delete: "Delete",
        deleteConfirmTitle: "Delete this comment?",
        deleteConfirmBody: "Replies to it stay visible. This can't be undone.",
        deleteConfirm: "Delete comment",
        deleteCancel: "Keep comment",
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
        },
        replyError: {
            title: "Reply not posted",
            description: "Something went wrong. Your text is still here — try again."
        },
        editError: {
            title: "Changes not saved",
            description: "Something went wrong. Your edit is still here — try again."
        },
        deleteError: {
            title: "Comment not deleted",
            description: "Something went wrong. Try again."
        }
    },
    sidebar: {
        popular: "Popular articles"
    }
} as const;
