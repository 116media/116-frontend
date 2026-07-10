/**
 * videoDetail (en)
 *
 * @description
 * English strings for the single video (video detail) page: the header
 * actions and stat-chip labels, the rating stars and their toasts, the
 * content tabs (description / lyrics / similar), the tag block, the share
 * modal with its copy-link toast, the add-to-playlist modal (list, inline
 * create, pluralized submit, toasts), the popular-videos sidebar, and the
 * not-found / error states. Owned by the videos module presentation layer;
 * the locale barrel spreads this object alongside the `home` and
 * `exclusiveShow` bundles so call sites reference the keys as
 * `t("videos.detail.<key>")`. `playlist.addCount` uses i18next plural
 * suffixes and is called as `t("videos.detail.playlist.addCount", { count })`;
 * `rating.rateAria` interpolates `{{stars}}`. Must hold the exact same keys
 * as the French mirror.
 */
export const videoDetail = {
    detail: {
        share: "Share",
        addToPlaylist: "Add to playlist",
        save: "Save",
        backToVideos: "Back to videos",
        stats: {
            views: "Views",
            likes: "Likes",
            comments: "Comments",
            shares: "Shares"
        },
        scoreboard: {
            note: "Rating",
            views: "Views",
            likes: "Likes",
            rate: "Rate this video",
            viewsYoutube: "YouTube views",
            reviews_one: "{{value}} review",
            reviews_other: "{{value}} reviews",
            comments_one: "{{value}} comment",
            comments_other: "{{value}} comments",
            shares_one: "{{value}} share",
            shares_other: "{{value}} shares"
        },
        ratingModal: {
            title: "What is your rating?",
            subtitle: "Tell us how much you liked this video.",
            submit: "Submit",
            cancel: "No thanks"
        },
        rating: {
            label: "Rating",
            rateAria: "Rate {{stars}} out of 5",
            success: {
                title: "Thanks for rating",
                description: "Your rating was saved."
            },
            error: {
                title: "Rating not saved",
                description: "Something went wrong. Try again."
            }
        },
        tabs: {
            description: "Description",
            lyrics: "Lyrics",
            similar: "Similar videos"
        },
        lyrics: {
            by: "By",
            empty: "No lyrics available for this video."
        },
        similar: {
            empty: "No similar videos yet."
        },
        tags: {
            label: "Tags"
        },
        shareModal: {
            title: "Share this video",
            subtitle: "Share this video on your networks",
            linkLabel: "Video link",
            copyAction: "Copy",
            facebook: "Share on Facebook",
            x: "Share on X",
            whatsapp: "Share on WhatsApp",
            copy: "Copy link",
            copied: {
                title: "Link copied",
                description: "The video link is in your clipboard."
            }
        },
        playlist: {
            title: "Add to playlist",
            subtitle: "Select one or more playlists",
            empty: "You have no playlists yet.",
            createNew: "Create a new playlist",
            cancel: "Cancel",
            add: "Add",
            videos_one: "{{value}} video",
            videos_other: "{{value}} videos",
            create: {
                placeholder: "New playlist name…",
                submit: "Create"
            },
            created: {
                title: "Playlist created"
            },
            addCount_one: "Add to {{count}} playlist",
            addCount_other: "Add to {{count}} playlists",
            added: {
                title: "Video added",
                description: "The video was added to your playlists."
            },
            error: {
                title: "Couldn't add the video",
                description: "Something went wrong. Try again."
            }
        },
        sidebar: {
            popular: "Popular videos"
        },
        notFound: {
            title: "Video not found",
            subtitle: "This video may have been removed or the link is wrong."
        },
        error: {
            title: "Couldn't load this video",
            subtitle: "Something went wrong. Check your connection and try again.",
            retry: "Try again"
        }
    }
} as const;
