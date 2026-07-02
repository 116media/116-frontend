"use client";

import { useTranslation } from "react-i18next";

import { useVideoLyrics } from "@/modules/videos/presentation/hooks/useVideoLyrics";
import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";

/**
 * Props for VideoDetail.Lyrics.
 *
 * @interface VideoDetailLyricsProps
 * @property {string} videoId - The video whose lyrics to fetch.
 * @property {boolean} enabled - Whether the lyrics query may run (the tab has been opened).
 */
export interface VideoDetailLyricsProps {
    videoId: string;
    enabled: boolean;
}

/**
 * VideoDetail.Lyrics
 *
 * @description
 * The lyrics tab panel: the song title with a "By {artist}" line, then the
 * full lyrics text with the stanza line breaks preserved — all in the app's
 * standard face (Outfit); the video page carries no editorial fonts. While
 * the lazy query loads, stanza skeleton lines hold the space; a video whose
 * lyrics cannot be resolved shows a single muted empty line.
 *
 * @param videoId - The video whose lyrics to fetch.
 * @param enabled - Whether the lyrics query may run.
 */
export function VideoDetailLyrics({ videoId, enabled }: VideoDetailLyricsProps) {
    const { t } = useTranslation();
    const { data, isLoading } = useVideoLyrics(videoId, enabled);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-2">
                <Skeleton className="h-6 w-52" />
                <Skeleton className="h-4 w-32" />
                {[0, 1, 2, 3, 4, 5].map((line) => (
                    <Skeleton
                        key={line}
                        className={line % 4 === 3 ? "mt-3 h-4 w-1/2" : "h-4 w-2/3"}
                    />
                ))}
            </div>
        );
    }

    if (!data) {
        return <p className="text-muted-foreground text-sm">{t("videos.detail.lyrics.empty")}</p>;
    }

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h3 className="font-bold text-foreground text-xl">{data.songTitle}</h3>
                <p className="text-muted-foreground text-sm">
                    {t("videos.detail.lyrics.by")} {data.artistName}
                </p>
            </div>
            <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                {data.lyricsText}
            </p>
        </div>
    );
}
