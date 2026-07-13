/**
 * bookmarks (en)
 *
 * @description
 * English strings for the "my bookmarks" page: title, auth prompt, and the grid's empty,
 * error, and end-of-list states. Spread by the locale barrel next to the `articles`
 * bundle. Must hold the exact same keys as the French mirror.
 */
export const bookmarks = {
    bookmarks: {
        title: "My bookmarks",
        subtitle: "Articles you saved to read later.",
        loginPrompt: "Log in to see the articles you saved.",
        loginCta: "Log in",
        empty: {
            title: "No bookmarks yet",
            body: "Tap the bookmark icon on any article to save it here."
        },
        error: {
            title: "Couldn't load your bookmarks",
            retry: "Try again"
        },
        endOfList: "That's every article you saved."
    }
} as const;
