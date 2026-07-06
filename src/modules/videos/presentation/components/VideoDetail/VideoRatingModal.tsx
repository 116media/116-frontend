"use client";

import { useState } from "react";
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
import { cn } from "@/shared/presentation/utils/cn";

/**
 * The five submittable star positions.
 */
const STAR_POSITIONS = [1, 2, 3, 4, 5] as const;

/**
 * Props for VideoRatingModal.
 *
 * @interface VideoRatingModalProps
 * @property {boolean} open - Whether the modal is open (controlled).
 * @property {(open: boolean) => void} onOpenChange - Open-state setter (backdrop/esc/close).
 * @property {string} videoId - The video being rated.
 * @property {string} slug - The video slug keying the cached detail entity.
 */
export interface VideoRatingModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    videoId: string;
    slug: string;
}

/**
 * VideoRatingModal
 *
 * @description
 * The rate-this-video surface: a dialog with a five-star picker that previews
 * the hovered value in the warning tone and shows the chosen number beside the
 * stars. Submitting sends 1–5 through `useRateVideo` (auth-gated inside the
 * hook — a guest gets the login modal and the rating resumes afterward, toasts
 * on both outcomes, and refetches the detail so the recomputed average returns)
 * and closes the dialog; the selection resets whenever the dialog closes. The
 * submit button stays disabled until a star is picked. The user's own previous
 * rating is not echoed back (the DTO does not carry it), so the picker always
 * opens empty.
 *
 * @param open - Whether the modal is open (controlled).
 * @param onOpenChange - Open-state setter.
 * @param videoId - The video being rated.
 * @param slug - The video slug keying the cached detail entity.
 */
export function VideoRatingModal({ open, onOpenChange, videoId, slug }: VideoRatingModalProps) {
    const { t } = useTranslation();
    const { submit } = useRateVideo(videoId, slug);
    const [selected, setSelected] = useState(0);
    const [hovered, setHovered] = useState(0);

    const active = hovered || selected;

    const close = (next: boolean) => {
        onOpenChange(next);
        if (!next) {
            setSelected(0);
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
                <div className="relative grid gap-5 rounded-2xl border border-border bg-card p-6 text-center shadow-xl">
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
                            type="button"
                            onClick={rate}
                            disabled={selected === 0}
                        >
                            {t("videos.detail.ratingModal.submit")}
                        </Button>
                        <Button
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
