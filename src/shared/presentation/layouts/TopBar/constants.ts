import { SiFacebook, SiInstagram, SiTiktok, SiX, SiYoutube } from "@icons-pack/react-simple-icons";

/**
 * Ordered social platform links shown in the TopBar; `hoverClass` must be a static
 * Tailwind class backed by the social brand tokens registered in theme.css.
 */
export const SOCIAL_LINKS = [
    {
        icon: SiYoutube,
        label: "YouTube",
        href: "https://youtube.com/@116media",
        hoverClass: "hover:text-social-youtube"
    },
    {
        icon: SiInstagram,
        label: "Instagram",
        href: "https://instagram.com/116media",
        hoverClass: "hover:text-social-instagram"
    },
    {
        icon: SiFacebook,
        label: "Facebook",
        href: "https://facebook.com/116media",
        hoverClass: "hover:text-social-facebook"
    },
    {
        icon: SiTiktok,
        label: "TikTok",
        href: "https://tiktok.com/@116media",
        hoverClass: "hover:text-social-tiktok"
    },
    {
        icon: SiX,
        label: "Twitter / X",
        href: "https://x.com/116media",
        hoverClass: "hover:text-social-twitter"
    }
] as const;
