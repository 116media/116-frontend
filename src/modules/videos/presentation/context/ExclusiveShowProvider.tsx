"use client";

import { createContext, type ReactNode, useContext, useMemo } from "react";
import type { IVideoExclusiveShowEntity } from "@/modules/videos/domain/entities/IVideoExclusiveShowEntity";
import { SHOW_FALLBACK_COLORS } from "@/modules/videos/presentation/constants/showColors";
import { mostRecentEpisode } from "@/modules/videos/presentation/utils/episodes/episodes.utils";
import { VIDEOS_PATH } from "@/shared/presentation/constants/paths";

/**
 * The value exposed by the exclusive show context.
 *
 * @interface ExclusiveShowContextValue
 * @property {IVideoExclusiveShowEntity} category - The exclusive show being rendered.
 * @property {string} background - Poster-derived background color, fallback applied.
 * @property {string} foreground - Poster-derived text color, fallback applied.
 * @property {string} watchHref - Detail URL of the most recently published episode.
 */
export interface ExclusiveShowContextValue {
    category: IVideoExclusiveShowEntity;
    background: string;
    foreground: string;
    watchHref: string;
}

const ExclusiveShowContext = createContext<ExclusiveShowContextValue | null>(null);

/**
 * Props for the ExclusiveShowProvider component.
 *
 * @interface ExclusiveShowProviderProps
 * @property {IVideoExclusiveShowEntity} category - The exclusive show to provide.
 * @property {ReactNode} children - The subtree that gains `useExclusiveShow()`.
 */
export interface ExclusiveShowProviderProps {
    category: IVideoExclusiveShowEntity;
    children: ReactNode;
}

/**
 * ExclusiveShowProvider
 *
 * @description
 * Provides one exclusive show to the VideoExclusiveShow slots: resolves the
 * poster-derived colors with neutral fallbacks and the watch CTA target (most
 * recent episode) once, so slots read them without prop-drilling.
 */
export function ExclusiveShowProvider({ category, children }: ExclusiveShowProviderProps) {
    const value = useMemo<ExclusiveShowContextValue>(() => {
        const latest = mostRecentEpisode(category.episodes);

        return {
            category,
            background: category.colors?.background ?? SHOW_FALLBACK_COLORS.background,
            foreground: category.colors?.foreground ?? SHOW_FALLBACK_COLORS.foreground,
            watchHref: latest ? `${VIDEOS_PATH}/${latest.slug}` : VIDEOS_PATH
        };
    }, [category]);

    return <ExclusiveShowContext.Provider value={value}>{children}</ExclusiveShowContext.Provider>;
}

/**
 * useExclusiveShow
 *
 * @description
 * Reads the exclusive show context inside an `ExclusiveShowProvider` subtree.
 * Throws outside the provider.
 *
 * @returns The `ExclusiveShowContextValue`.
 */
export function useExclusiveShow(): ExclusiveShowContextValue {
    const value = useContext(ExclusiveShowContext);
    if (!value) throw new Error("useExclusiveShow must be used within an ExclusiveShowProvider");
    return value;
}
