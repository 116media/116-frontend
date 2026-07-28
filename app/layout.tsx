import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import type { Metadata } from "next";
import localFont from "next/font/local";
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
import { getServerTranslation } from "@/shared/presentation/utils/i18n/i18n.server.utils";
import { getServerLanguage } from "@/shared/presentation/utils/language/language.server.utils";
import "./globals.css";

const outfit = localFont({
    src: "../public/fonts/outfit-latin-variable.woff2",
    weight: "100 900",
    style: "normal",
    variable: "--font-sans",
    display: "swap"
});

const playfair = localFont({
    src: "../public/fonts/playfair-display-latin-variable.woff2",
    weight: "400 900",
    style: "normal",
    variable: "--font-serif",
    display: "swap"
});

const merriweather = localFont({
    src: "../public/fonts/merriweather-latin-variable.woff2",
    weight: "300 900",
    style: "normal",
    variable: "--font-article",
    display: "swap"
});

/**
 * generateMetadata
 *
 * @description
 * Site-wide default metadata: the root `title.default` and `description`, resolved from the
 * active server language. Any route below that sets its own `title` is automatically
 * prefixed with `116 - ` via `title.template`; a route with no `title` of its own falls back
 * to `title.default` here.
 *
 * @returns The root metadata for the current request's language.
 */
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getServerTranslation();

    return {
        metadataBase: new URL(SITE_URL),
        title: {
            template: "116 - %s",
            default: t("general.metaTitleDefault")
        },
        description: t("general.metaDescription")
    };
}

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
