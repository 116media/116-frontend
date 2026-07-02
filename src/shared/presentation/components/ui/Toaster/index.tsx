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
 * `next-themes` theme so toasts follow light/dark (and `system`). `richColors` is kept
 * so the foreground — icon, text, border — stays per-type colored. Only the toast
 * background is overridden (`bg-background!`, important so it wins over sonner's
 * colored rule) to the app's own surface, matching the app in both themes. The leading
 * icon is top-aligned with the title. Defaults can be overridden per instance via props.
 *
 * @param props - Forwarded to sonner's `<Toaster>` (override the defaults if needed).
 */
export function Toaster(props: ToasterProps) {
    const { theme = "system" } = useTheme();

    return (
        <SonnerToaster
            richColors
            closeButton
            position="top-center"
            theme={theme as ToasterProps["theme"]}
            toastOptions={{
                classNames: {
                    toast: "bg-background!",
                    icon: "self-start"
                }
            }}
            {...props}
        />
    );
}
