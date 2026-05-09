/**
 * Application color palette.
 *
 * @description
 * Centralized color definitions for consistent theming.
 * Colors mirror the CSS primitives in colors.css and are intended for use
 * in TypeScript contexts such as inline styles or tests.
 * For component styling, prefer Tailwind utilities backed by theme.css variables.
 *
 * @property {string} BrandPrimary - Primary brand color
 * @property {string} BrandSecondary - Secondary brand color
 * @property {string} BrandBackgroundLight - Light background color
 * @property {string} BrandBackgroundDark - Dark background color
 * @property {string} Success - Success state color
 * @property {string} Error - Error state color
 * @property {string} Warning - Warning state color
 * @property {string} Neutral - Off-white neutral color
 * @property {string} White - White color
 * @property {string} Black - Black color
 * @property {string} Yellow - Yellow accent color
 * @property {string} Link - Hyperlink color
 * @property {string} Background - Default page background color
 * @property {string} Title - Muted color for titles and labels
 * @property {string} Description - Subdued color for secondary text
 * @property {string} Twitter - Twitter / X brand color
 * @property {string} Instagram - Instagram brand color
 * @property {string} Facebook - Facebook brand color
 * @property {string} Youtube - YouTube brand color
 * @property {string} Tiktok - TikTok brand color
 * @property {string} Google - Google brand color
 * @property {string} Whatsapp - WhatsApp brand color
 * @property {string} BorderLight - Default border color for cards and dividers
 * @property {string} BorderTable - Border color for table rows
 * @property {string} BorderTableHr - Horizontal rule color inside tables
 * @property {string} BgHover - Background color on interactive element hover
 * @property {string} BgSubtle - Semi-transparent subtle background for overlays
 * @property {string} TextPrimary - Primary body text color
 * @property {string} TextMuted - Muted text for placeholders and disabled states
 * @property {string} TextSecondary - Secondary text for supporting content
 */
export const Colors = {
    // Brand
    BrandPrimary: "#490fd2",
    BrandSecondary: "#ff74d4",
    BrandBackgroundLight: "#DCE0E5",
    BrandBackgroundDark: "#34384d",

    // Semantic
    Success: "#1dd3b0",
    Error: "#ef476f",
    Warning: "#f07f34",

    // Base
    Neutral: "#f9fcff",
    White: "#ffffff",
    Black: "#000000",
    Yellow: "#ffc300",
    Link: "#1890ff",
    Background: "#f0f2f5",
    Title: "#5e6275",
    Description: "#9295a2",

    // Social
    Twitter: "#1da1f2",
    Instagram: "#e1306c",
    Facebook: "#4267b2",
    Youtube: "#ff0000",
    Tiktok: "#010101",
    Google: "#e45e52",
    Whatsapp: "#25d366",

    // Neutral UI
    BorderLight: "#eaedf2",
    BorderTable: "#edf5ff",
    BorderTableHr: "#e4e7f4",
    BgHover: "#f9fafb",
    BgSubtle: "rgba(249, 250, 251, 0.5)",
    TextPrimary: "#111827",
    TextMuted: "#9ca3af",
    TextSecondary: "#374151"
} as const;
