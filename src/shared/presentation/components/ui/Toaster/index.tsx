"use client";

import { useTheme } from "next-themes";
import type { ComponentProps } from "react";
import { Toaster as SonnerToaster } from "sonner";

type ToasterProps = ComponentProps<typeof SonnerToaster>;

/**
 * Toaster
 *
 * @description
 * The app's sonner toaster, mounted once at the root. Follows the active
 * `next-themes` theme; toast bodies are fully custom (`FlashToast` rendered via
 * `toast.custom`), so sonner's own type colors, icons, and close button are left off.
 *
 * @param props - Forwarded to sonner's `<Toaster>` (override the defaults if needed).
 */
export function Toaster(props: ToasterProps) {
    const { theme = "system" } = useTheme();

    return (
        <SonnerToaster
            position="top-center"
            theme={theme as ToasterProps["theme"]}
            {...props}
        />
    );
}
