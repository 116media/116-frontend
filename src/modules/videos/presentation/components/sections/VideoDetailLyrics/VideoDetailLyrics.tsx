"use client";

import { useTranslation } from "react-i18next";

import { useVideoLyrics } from "@/modules/videos/presentation/hooks/useVideoLyrics";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { MusicIcon } from "@/shared/presentation/components/ui/Icon";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";

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

    return (
        <StateRenderer
            data={data}
            loading={isLoading}
            skeleton={<VideoDetailLyricsLoading />}
            empty={
                <EmptyState
                    context="video-lyrics-empty"
                    icon={<MusicIcon className="size-10" />}
                    title={t("videos.detail.lyrics.empty")}
                    className="min-h-0 bg-transparent py-12"
                />
            }
            render={(lyrics) => (
                <div className="flex flex-col gap-4">
                    <div>
                        <h3 className="font-bold text-foreground text-xl">{lyrics.songTitle}</h3>
                        <p className="text-muted-foreground text-sm">
                            {t("videos.detail.lyrics.by")} {lyrics.artistName}
                        </p>
                    </div>
                    <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                        {lyrics.lyricsText}
                    </p>
                </div>
            )}
        />
    );
}
