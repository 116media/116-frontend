"use client";

import { useTranslation } from "react-i18next";

import { useVideoLyrics } from "@/modules/videos/presentation/hooks/useVideoLyrics";

import { VideoDetailLyricsLoading } from "./VideoDetailLyrics.Loading";

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
 * The lyrics tab panel: song title, artist line, and the full lyrics text with
 * stanza line breaks preserved. Shows skeleton lines while the lazy query
 * loads, and a single muted line when no lyrics resolve.
 */
export function VideoDetailLyrics({ videoId, enabled }: VideoDetailLyricsProps) {
    const { t } = useTranslation();
    const { data, isLoading } = useVideoLyrics(videoId, enabled);

    if (isLoading) {
        return <VideoDetailLyricsLoading />;
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
