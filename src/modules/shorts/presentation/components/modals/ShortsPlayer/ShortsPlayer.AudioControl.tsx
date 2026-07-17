"use client";

import { useTranslation } from "react-i18next";

import { useShortsPlayer } from "@/modules/shorts/presentation/context/ShortsPlayerProvider";
import { Button } from "@/shared/presentation/components/ui/Button";
import { VolumeIcon, VolumeOffIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * ShortsPlayerAudioControl
 *
 * @description
 * Top-left audio control matching the dashboard réel preview: a frosted mute toggle
 * beside a horizontal volume slider, both bound to the session's mute/volume state.
 * Setting the volume to zero mutes; raising it clears the mute. Reveals on hover /
 * focus over the stage, mirroring the player's auto-hiding controls.
 */
export function ShortsPlayerAudioControl() {
    const { t } = useTranslation();
    const { isMuted, volume, toggleMute, setVolume } = useShortsPlayer();
    const isSilent = isMuted || volume === 0;

    return (
        <div className="absolute top-3 left-3 z-30 flex items-center gap-1 rounded-lg bg-black/40 py-1 pr-3 pl-1 opacity-0 backdrop-blur-sm transition-opacity duration-300 focus-within:opacity-100 group-hover:opacity-100">
            <Button
                size="icon"
                variant="ghost"
                onClick={toggleMute}
                aria-label={isSilent ? t("shorts.player.unmute") : t("shorts.player.mute")}
                className="size-8 rounded-full text-white hover:bg-white/15 hover:text-white [&_svg]:size-5"
            >
                {isSilent ? <VolumeOffIcon /> : <VolumeIcon />}
            </Button>
            <input
                min={0}
                max={1}
                step={0.05}
                type="range"
                value={isSilent ? 0 : volume}
                aria-label={t("shorts.player.volume")}
                onChange={(event) => setVolume(Number(event.target.value))}
                className="h-1 w-20 cursor-pointer accent-white"
            />
        </div>
    );
}
