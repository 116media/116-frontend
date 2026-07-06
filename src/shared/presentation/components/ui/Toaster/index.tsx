"use client";

import { useTheme } from "next-themes";
import type { ComponentProps } from "react";
import { Toaster as SonnerToaster } from "sonner";

type ToasterProps = ComponentProps<typeof SonnerToaster>;

/**
 * Toaster
 *
 * @description
 * The app's sonner toaster, mounted once at the root. It reads the active
 * `next-themes` theme only to follow light/dark for positioning/animation; the
 * toast bodies are fully custom (see `FlashToast`, rendered by
 * `showNotification` via `toast.custom` with `unstyled`), so sonner's own type
 * colors, icons, and close button are left off — the flash message owns its
 * filled colored surface and close control. Defaults can be overridden per
 * instance via props.
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
