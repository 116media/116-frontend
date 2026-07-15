import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import type { Metadata } from "next";
import { Merriweather, Outfit, Playfair_Display } from "next/font/google";
import { authKeys } from "@/modules/auth/presentation/constants/authKeys";
import { AuthModalProvider } from "@/modules/auth/presentation/context/AuthModalProvider";
import { AuthProvider } from "@/modules/auth/presentation/context/AuthProvider";
import { SITE_URL } from "@/shared/infrastructure/constants/common";
import { createServerCradle } from "@/shared/infrastructure/server.cradle";
import { Toaster } from "@/shared/presentation/components/ui/Toaster";
import { I18nProvider } from "@/shared/presentation/i18n/I18nProvider";
import { NavigationProgressProvider } from "@/shared/presentation/providers/NavigationProgressProvider";
import { QueryProvider } from "@/shared/presentation/providers/QueryProvider";
import { ThemeProvider } from "@/shared/presentation/providers/ThemeProvider";
import { getServerLanguage } from "@/shared/presentation/utils/language/language.server.utils";
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
    metadataBase: new URL(SITE_URL),
    title: {
        template: "%s | 116",
        default: "116 - Musique & Culture Hip-Hop"
    },
    description: "Articles, vidéos et paroles de la culture hip-hop en RDC et au-delà."
};

export default async function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const language = await getServerLanguage();
    const cradle = await createServerCradle();
    const currentUserResult = await cradle.getProfileUseCase.execute();

    const queryClient = new QueryClient();

    if (currentUserResult.ok) {
        queryClient.setQueryData(authKeys.me, currentUserResult);
    }

    return (
        <html
            lang={language}
            suppressHydrationWarning
            className={`${outfit.variable} ${playfair.variable} ${merriweather.variable}`}
        >
            <body
                suppressHydrationWarning
                className="min-h-screen bg-background text-foreground antialiased"
            >
                <NavigationProgressProvider>
                    <ThemeProvider>
                        <Toaster />
                        <QueryProvider>
                            <HydrationBoundary state={dehydrate(queryClient)}>
                                <I18nProvider initialLanguage={language}>
                                    <AuthProvider>
                                        <AuthModalProvider>{children}</AuthModalProvider>
                                    </AuthProvider>
                                </I18nProvider>
                            </HydrationBoundary>
                        </QueryProvider>
                    </ThemeProvider>
                </NavigationProgressProvider>
            </body>
        </html>
    );
}
