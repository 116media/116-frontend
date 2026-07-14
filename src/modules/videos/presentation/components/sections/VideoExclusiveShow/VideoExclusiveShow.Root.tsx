import type { ReactNode } from "react";
import { SHOW_FALLBACK_COLORS } from "@/modules/videos/presentation/constants/showColors";
import { ExclusiveShowProvider } from "@/modules/videos/presentation/context/ExclusiveShowProvider";
import type { VideoExclusiveShowViewProps } from "./types";

/**
 * Props for the VideoExclusiveShowRoot component.
 *
 * @interface VideoExclusiveShowRootProps
 * @property {VideoExclusiveShowViewProps["category"]} category - The exclusive show to provide.
 * @property {string} [className] - Layout classes for the section shell.
 * @property {ReactNode} children - The slot arrangement to render inside.
 */
export interface VideoExclusiveShowRootProps {
    className?: string;
    children: ReactNode;
    category: VideoExclusiveShowViewProps["category"];
}

/**
 * VideoExclusiveShowRoot
 *
 * @description
 * Section shell for the exclusive show slots: wraps the arrangement in the
 * `ExclusiveShowProvider` and paints the surface with the show's
 * poster-derived background color, so every slot below reads the show, its
 * colors, and the watch CTA target from context.
 */
export function VideoExclusiveShowRoot({
    category,
    className,
    children
}: VideoExclusiveShowRootProps) {
    const background = category.colors?.background ?? SHOW_FALLBACK_COLORS.background;

    return (
        <ExclusiveShowProvider category={category}>
            <section
                className={className}
                style={{ backgroundColor: background }}
            >
                {children}
            </section>
        </ExclusiveShowProvider>
    );
}
