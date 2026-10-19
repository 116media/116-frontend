import { SiFacebook, SiInstagram, SiTiktok, SiX, SiYoutube } from "@icons-pack/react-simple-icons";

/**
 * Ordered social platform links shown in the TopBar, the Footer and the coming-soon
 * pages; `hoverClass` must be a static Tailwind class backed by the social brand tokens
 * registered in theme.css. `colorClass` paints the icon in that brand at rest, for a
 * surface where the networks are the content rather than a trailing row of links; the
 * two black brands invert on a dark ground, as they do in their own guidelines, since
 * black on the dark well is unreadable. `handle` is the account as that network writes it.
 */
export const SOCIAL_LINKS = [
    {
        icon: SiYoutube,
        label: "YouTube",
        handle: "@116media",
        href: "https://youtube.com/@116media",
        hoverClass: "hover:text-social-youtube",
        colorClass: "text-social-youtube"
    },
    {
        icon: SiInstagram,
        label: "Instagram",
        handle: "@116media",
        href: "https://instagram.com/116media",
        hoverClass: "hover:text-social-instagram",
        colorClass: "text-social-instagram"
    },
    {
        icon: SiFacebook,
        label: "Facebook",
        handle: "116 Media",
        href: "https://facebook.com/116media",
        hoverClass: "hover:text-social-facebook",
        colorClass: "text-social-facebook"
    },
    {
        icon: SiTiktok,
        label: "TikTok",
        handle: "@116media",
        href: "https://tiktok.com/@116media",
        hoverClass: "hover:text-social-tiktok",
        colorClass: "text-social-tiktok dark:text-foreground"
    },
    {
        icon: SiX,
        label: "Twitter / X",
        handle: "@116media",
        href: "https://x.com/116media",
        hoverClass: "hover:text-social-twitter",
        colorClass: "text-social-twitter dark:text-foreground"
    }
] as const;
