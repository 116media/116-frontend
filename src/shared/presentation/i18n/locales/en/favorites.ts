/**
 * favorites (en)
 *
 * @description
 * English strings for the favorites area: sidebar navigation, per-route collection tabs,
 * activity meta rows, the own-comments drawer, playlist management, and the shared async
 * states. Must hold the exact same keys as the French mirror.
 */
export const favorites = {
    navigation: {
        articles: "Articles",
        videos: "Videos",
        shorts: "Shorts"
    },
    headings: {
        articles: "Favorite articles",
        videos: "Favorite videos",
        shorts: "Favorite shorts"
    },
    subtitles: {
        articles: "Everything you saved, commented on, liked, or shared.",
        videos: "Your playlists and the videos you rated or shared.",
        shorts: "The shorts you liked, saved, or shared."
    },
    collections: {
        bookmarked: "Bookmarked",
        commented: "Commented",
        liked: "Liked",
        shared: "Shared",
        playlists: "Playlists",
        rated: "Rated",
        saved: "Saved"
    },
    activity: {
        bookmarkedAt: "Saved {{date}}",
        savedAt: "Saved {{date}}",
        sharedAt: "Shared {{date}}",
        likedAt: "Liked {{date}}",
        ratedAt: "Rated {{date}}",
        latestComment: "Latest comment",
        commentCount_one: "{{count}} comment",
        commentCount_other: "{{count}} comments",
        shareCount_one: "{{count}} share",
        shareCount_other: "{{count}} shares",
        yourRating: "Your rating"
    },
    comments: {
        viewComments: "View comments",
        viewArticle: "View article",
        edit: "Edit",
        delete: "Delete",
        save: "Save",
        cancel: "Cancel",
        drawerTitle: "Your comments",
        drawerSubtitle: "The comments you left on this article.",
        empty: "You haven't commented on this article yet.",
        confirmDeleteTitle: "Delete this comment?",
        confirmDeleteBody: "This comment will be removed. This can't be undone.",
        confirmDelete: "Delete"
    },
    playlist: {
        open: "Open",
        rename: "Rename",
        delete: "Delete",
        removeVideo: "Remove",
        back: "Back to playlists",
        emptySlot: "Empty playlist slot",
        videoCount_one: "{{count}} video",
        videoCount_other: "{{count}} videos",
        renameTitle: "Rename playlist",
        renameSubtitle: "Give your playlist a new name.",
        renamePlaceholder: "Playlist name",
        nameLabel: "Playlist name",
        save: "Save",
        cancel: "Cancel",
        confirmDeleteTitle: "Delete this playlist?",
        confirmDeleteBody: '"{{name}}" will be removed. The videos stay available in your library.',
        confirmDelete: "Delete",
        confirmRemoveTitle: "Remove this video?",
        confirmRemoveBody: 'This video will be removed from "{{name}}".',
        confirmRemove: "Remove",
        emptyVideos: "This playlist has no videos yet."
    },
    videos: {
        rateAgain: "Rate again"
    },
    states: {
        loading: "Loading…",
        error: "Something went wrong.",
        retry: "Try again",
        endOfResults: "You've reached the end.",
        authentication: {
            title: "Log in to see your favorites.",
            cta: "Log in"
        },
        empty: {
            bookmarkedArticles: {
                title: "No saved articles yet",
                body: "Tap the bookmark icon on any article to save it here."
            },
            commentedArticles: {
                title: "No comments yet",
                body: "Articles you comment on show up here."
            },
            likedArticles: {
                title: "No liked articles yet",
                body: "Articles you like show up here."
            },
            sharedArticles: {
                title: "No shared articles yet",
                body: "Articles you share show up here."
            },
            playlists: {
                title: "No playlists yet",
                body: "Create a playlist from any video to see it here."
            },
            ratedVideos: {
                title: "No rated videos yet",
                body: "Videos you rate show up here."
            },
            sharedVideos: {
                title: "No shared videos yet",
                body: "Videos you share show up here."
            },
            likedShorts: {
                title: "No liked shorts yet",
                body: "Shorts you like show up here."
            },
            savedShorts: {
                title: "No saved shorts yet",
                body: "Shorts you save show up here."
            },
            sharedShorts: {
                title: "No shared shorts yet",
                body: "Shorts you share show up here."
            }
        }
    }
} as const;
