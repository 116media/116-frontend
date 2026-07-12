"use client";

import { ProgressProvider } from "@bprogress/next/app";
import type { ReactNode } from "react";

/**
 * Props for NavigationProgressProvider.
 *
 * @interface NavigationProgressProviderProps
 * @property {ReactNode} children - The app subtree the progress bar wraps.
 */
export interface NavigationProgressProviderProps {
    children: ReactNode;
}

/**
 * NavigationProgressProvider
 *
 * @description
 * Renders the top navigation progress bar during App Router route transitions. The
 * bar wears an animated bright-to-primary token gradient (styled in progress-bar.css)
 * and auto-tracks Link clicks and router pushes. Wrap the app once at the root.
 */
export function NavigationProgressProvider({ children }: NavigationProgressProviderProps) {
    return (
        <ProgressProvider
            height="4px"
            color="var(--primary)"
            options={{ showSpinner: false }}
        >
            {children}
        </ProgressProvider>
    );
}
