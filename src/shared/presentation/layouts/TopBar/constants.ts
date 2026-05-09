import { SiFacebook, SiInstagram, SiTiktok, SiX, SiYoutube } from "@icons-pack/react-simple-icons";

/**
 * SOCIAL_LINKS
 *
 * @description
 * Ordered list of social media platforms displayed in the TopBar.
 * Each entry provides the icon component, the platform URL, an accessible label,
 * and a static Tailwind hover class for the brand color on hover.
 * Colors use the social tokens registered in theme.css.
 *
 * @property icon - React component for the platform icon (from react-simple-icons)
 * @property href - External URL to the 116 Media account on that platform
 * @property label - Accessible label used as aria-label on the link
 * @property hoverClass - Static Tailwind class applied on hover to restore brand color
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
