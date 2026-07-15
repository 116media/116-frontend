"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useRateVideo } from "@/modules/videos/presentation/hooks/useRateVideo";
import { Button } from "@/shared/presentation/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/shared/presentation/components/ui/Dialog";
import { StarIcon } from "@/shared/presentation/components/ui/Icon";
import { STAR_POSITIONS } from "@/shared/presentation/constants/rating";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for VideoRatingModal.
 *
 * @interface VideoRatingModalProps
 * @property {boolean} open - Whether the modal is open (controlled).
 * @property {(open: boolean) => void} onOpenChange - Open-state setter (backdrop/esc/close).
 * @property {string} videoId - The video being rated.
 * @property {string} slug - The video slug keying the cached detail entity.
 * @property {number | null} [initialStars] - The caller's prior rating, seeding the picker so a returning rater sees their star.
 */
export interface VideoRatingModalProps {
    slug: string;
    open: boolean;
    videoId: string;
    initialStars?: number | null;
    onOpenChange: (open: boolean) => void;
}

/**
 * VideoRatingModal
 *
 * @description
 * Rate-this-video dialog with a five-star picker. Submitting sends 1–5 through
 * `useRateVideo` (auth-gated inside the hook) and closes the dialog. The picker
 * re-seeds from `initialStars` on every open, so a returning rater sees their
 * prior choice and an unrated visitor starts empty.
 */
export function VideoRatingModal({
    open,
    onOpenChange,
    videoId,
    slug,
    initialStars = null
}: VideoRatingModalProps) {
    const { t } = useTranslation();
    const { submit } = useRateVideo(videoId, slug);

    const [hovered, setHovered] = useState(0);
    const [selected, setSelected] = useState(initialStars ?? 0);

    const active = hovered || selected;

    useEffect(() => {
        if (open) setSelected(initialStars ?? 0);
    }, [open, initialStars]);

    const close = (next: boolean) => {
        onOpenChange(next);
        if (!next) {
            setSelected(initialStars ?? 0);
            setHovered(0);
        }
    };

    const rate = () => {
        if (selected === 0) return;
        submit(selected);
        close(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={close}
        >
            <DialogContent aria-describedby={undefined}>
                <div className="relative grid gap-5 rounded-2xl border bg-card p-6 text-center shadow-xl">
                    <DialogHeader className="items-center gap-1.5">
                        <DialogTitle>{t("videos.detail.ratingModal.title")}</DialogTitle>
                        <p className="text-muted-foreground text-sm">
                            {t("videos.detail.ratingModal.subtitle")}
                        </p>
                    </DialogHeader>

                    <div className="flex items-center justify-center gap-2">
                        {/* biome-ignore lint/a11y/useSemanticElements: a fieldset is semantically wrong for a star-button strip; role="group" keeps the grouping accessible */}
                        <div
                            role="group"
                            aria-label={t("videos.detail.rating.label")}
                            className="flex items-center gap-1"
                            onMouseLeave={() => setHovered(0)}
                        >
                            {STAR_POSITIONS.map((position) => (
                                <button
                                    key={position}
                                    type="button"
                                    onClick={() => setSelected(position)}
                                    onMouseEnter={() => setHovered(position)}
                                    onFocus={() => setHovered(position)}
                                    aria-label={t("videos.detail.rating.rateAria", {
                                        stars: position
                                    })}
                                    className="p-1 transition-transform hover:scale-110 focus-visible:outline-none"
                                >
                                    <StarIcon
                                        className={cn(
                                            "size-8 transition-colors",
                                            position <= active
                                                ? "fill-amber-400 text-yellow-400"
                                                : "text-muted-foreground/30"
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                        <span
                            aria-hidden
                            className="min-w-4 font-semibold text-lg text-warning tabular-nums"
                        >
                            {active || ""}
                        </span>
                    </div>

                    <div className="grid gap-2">
                        <Button
                            size="lg"
                            type="button"
                            onClick={rate}
                            disabled={selected === 0}
                        >
                            {t("videos.detail.ratingModal.submit")}
                        </Button>
                        <Button
                            size="lg"
                            type="button"
                            variant="ghost"
                            onClick={() => close(false)}
                        >
                            {t("videos.detail.ratingModal.cancel")}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
