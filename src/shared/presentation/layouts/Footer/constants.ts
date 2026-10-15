import {
    ABOUT_PATH,
    ADVERTISING_PATH,
    ARTICLES_PATH,
    ARTISTES_PATH,
    CONTACT_PATH,
    COOKIES_PATH,
    LYRICS_PATH,
    PRIVACY_PATH,
    SHORTS_PATH,
    SHOWS_PATH,
    SUBMIT_CLIP_PATH,
    TERMS_PATH,
    VIDEOS_PATH
} from "@/shared/presentation/constants/paths";

/**
 * The three Footer link columns, in render order. `heading` and each `label` are i18n
 * keys inside the `footer` namespace, resolved at render time.
 */
export const FOOTER_COLUMNS = [
    {
        heading: "footer.explore",
        links: [
            { label: "footer.news", href: ARTICLES_PATH },
            { label: "footer.videos", href: VIDEOS_PATH },
            { label: "footer.shows", href: SHOWS_PATH },
            { label: "footer.shorts", href: SHORTS_PATH },
            { label: "footer.lyrics", href: LYRICS_PATH },
            { label: "footer.artistes", href: ARTISTES_PATH }
        ]
    },
    {
        heading: "footer.brand",
        links: [
            { label: "footer.about", href: ABOUT_PATH },
            { label: "footer.submitClip", href: SUBMIT_CLIP_PATH },
            { label: "footer.advertising", href: ADVERTISING_PATH },
            { label: "footer.contact", href: CONTACT_PATH }
        ]
    },
    {
        heading: "footer.legal",
        links: [
            { label: "footer.terms", href: TERMS_PATH },
            { label: "footer.privacy", href: PRIVACY_PATH },
            { label: "footer.cookies", href: COOKIES_PATH }
        ]
    }
] as const;
