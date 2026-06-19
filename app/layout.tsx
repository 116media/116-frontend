import type { Metadata } from "next";
import { Merriweather, Outfit, Playfair_Display } from "next/font/google";
import { I18nProvider } from "@/shared/presentation/i18n/I18nProvider";
import { ThemeProvider } from "@/shared/presentation/providers/ThemeProvider";
import "./globals.css";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap"
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-serif",
    display: "swap"
});

const merriweather = Merriweather({
    subsets: ["latin"],
    weight: ["300", "400", "700"],
    variable: "--font-article",
    display: "swap"
});

export const metadata: Metadata = {
    title: {
        template: "%s | 116",
        default: "116 - Musique & Culture Hip-Hop"
    },
    description: "Articles, vidéos et paroles de la culture hip-hop en RDC et au-delà."
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="fr"
            suppressHydrationWarning
            className={`${outfit.variable} ${playfair.variable} ${merriweather.variable}`}
        >
            <body
                suppressHydrationWarning
                className="min-h-screen bg-background text-foreground antialiased"
            >
                <ThemeProvider>
                    <I18nProvider>{children}</I18nProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
