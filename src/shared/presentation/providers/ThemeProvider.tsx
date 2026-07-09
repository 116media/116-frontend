"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>;

/**
 * ThemeProvider
 *
 * @description
 * Enables light/dark mode switching via next-themes, applying the active theme as a
 * `class` on `<html>` to activate the `.dark` CSS variable overrides in theme.css.
 * Defaults to the system preference.
 *
 * @param props - Forwarded to NextThemesProvider
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return (
        <NextThemesProvider
            enableSystem
            attribute="class"
            defaultTheme="system"
            storageKey="116-theme"
            disableTransitionOnChange
            {...props}
        >
            {children}
        </NextThemesProvider>
    );
}
