import { APP_NAME } from "@/shared/infrastructure/constants/common";

/**
 * footer (fr)
 *
 * @description
 * Site footer strings: the tagline, the three link-column headings, every link label
 * and the bottom bar.
 */
export const footer = {
    tagline:
        "Le média de la culture urbaine congolaise. Musique, interviews, clips et coulisses — depuis Kinshasa.",
    explore: "Explorer",
    brand: APP_NAME,
    legal: "Légal",
    news: "Actualités",
    videos: "Vidéos",
    shows: "Émissions",
    shorts: "Shorts",
    lyrics: "Lyrics",
    artistes: "Artistes",
    about: "À propos",
    submitClip: "Soumettre un clip",
    advertising: "Publicité",
    contact: "Contact",
    terms: "Conditions",
    privacy: "Confidentialité",
    cookies: "Cookies",
    notFound: "Page introuvable (404)",
    copyright: "© {{year}} - {{appName}}. Tous droits réservés."
} as const;
