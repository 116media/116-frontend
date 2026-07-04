import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import type { Metadata } from "next";
import { Merriweather, Outfit, Playfair_Display } from "next/font/google";
import { AuthModalProvider } from "@/modules/auth/presentation/context/AuthModalProvider";
import { AuthProvider } from "@/modules/auth/presentation/context/AuthProvider";
import { authKeys } from "@/modules/auth/presentation/context/authKeys";
import { createServerCradle } from "@/shared/infrastructure/server.cradle";
import { Toaster } from "@/shared/presentation/components/ui/Toaster";
import { I18nProvider } from "@/shared/presentation/i18n/I18nProvider";
import { QueryProvider } from "@/shared/presentation/providers/QueryProvider";
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

export default async function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cradle = await createServerCradle();
    const currentUserResult = await cradle.getProfileUseCase.execute();

    const queryClient = new QueryClient();

    if (currentUserResult.ok) {
        queryClient.setQueryData(authKeys.me, currentUserResult);
    }

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
                    <Toaster />
                    <QueryProvider>
                        <HydrationBoundary state={dehydrate(queryClient)}>
                            <I18nProvider>
                                <AuthProvider>
                                    <AuthModalProvider>{children}</AuthModalProvider>
                                </AuthProvider>
                            </I18nProvider>
                        </HydrationBoundary>
                    </QueryProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
