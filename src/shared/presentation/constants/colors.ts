/**
 * Application color palette mirroring the CSS primitives in colors.css, for
 * TypeScript contexts such as inline styles or tests. For component styling,
 * prefer Tailwind utilities backed by theme.css variables.
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
    Twitter: "#000000",
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
