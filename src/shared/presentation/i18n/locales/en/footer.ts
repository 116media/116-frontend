import { APP_NAME } from "@/shared/infrastructure/constants/common";

/**
 * footer (en)
 *
 * @description
 * Site footer strings: the tagline, the three link-column headings, every link label
 * and the bottom bar.
 */
export const footer = {
    tagline:
        "The home of Congolese urban culture. Music, interviews, clips and behind the scenes — from Kinshasa.",
    explore: "Explore",
    brand: APP_NAME,
    legal: "Legal",
    news: "News",
    videos: "Videos",
    shows: "Shows",
    shorts: "Shorts",
    lyrics: "Lyrics",
    artistes: "Artists",
    about: "About",
    submitClip: "Submit a clip",
    advertising: "Advertising",
    contact: "Contact",
    terms: "Terms",
    privacy: "Privacy",
    cookies: "Cookies",
    notFound: "Page not found (404)",
    copyright: "© {{year}} - {{appName}}. All rights reserved.",
} as const;
