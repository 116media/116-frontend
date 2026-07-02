"use client";

import { useTranslation } from "react-i18next";

import { useShareVideo } from "@/modules/videos/presentation/hooks/useShareVideo";
import { SocialShareGroup } from "@/shared/presentation/components/common/SocialShareGroup";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/shared/presentation/components/ui/Dialog";
import { showNotification } from "@/shared/presentation/utils/notification";

import { videoLinkCopiedNotification } from "../../notifications/share.notification";

/**
 * Props for VideoShareModal.
 *
 * @interface VideoShareModalProps
 * @property {boolean} open - Whether the modal is open (controlled).
 * @property {(open: boolean) => void} onOpenChange - Open-state setter (backdrop/esc/close).
 * @property {string} videoId - The video the backend share event is recorded against.
 * @property {string} slug - The video slug, used to build the URL outside the browser.
 * @property {string} title - The video title, carried into the share message.
 */
export interface VideoShareModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    videoId: string;
    slug: string;
    title: string;
}

/**
 * resolveVideoUrl
 *
 * @description
 * Resolves the absolute video URL. Prefers `window.location.href` in the
 * browser; falls back to the public site base plus the video path so the
 * value is defined outside the browser.
 *
 * @param slug - The video slug, used for the fallback path.
 * @returns The absolute video URL.
 */
function resolveVideoUrl(slug: string): string {
    if (typeof window !== "undefined") return window.location.href;
    return `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/videos/${slug}`;
}

/**
 * VideoShareModal
 *
 * @description
 * The video's share surface: a dialog holding the shared
 * {@link SocialShareGroup} as a centered horizontal row (Facebook, X,
 * WhatsApp, copy-link). Every action records the share against the backend
 * fire-and-forget and optimistically bumps the cached detail's `shareCount`;
 * the copy-link action additionally toasts and closes the dialog.
 *
 * @param open - Whether the modal is open (controlled).
 * @param onOpenChange - Open-state setter.
 * @param videoId - The video the backend share event is recorded against.
 * @param slug - The video slug, used to build the URL outside the browser.
 * @param title - The video title, carried into the share message.
 */
export function VideoShareModal({
    open,
    onOpenChange,
    videoId,
    slug,
    title
}: VideoShareModalProps) {
    const { t } = useTranslation();
    const recordShare = useShareVideo(videoId, slug);

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent aria-describedby={undefined}>
                <div className="relative grid gap-5 rounded-2xl border border-border bg-card p-6 shadow-xl">
                    <DialogHeader>
                        <DialogTitle>{t("videos.detail.shareModal.title")}</DialogTitle>
                    </DialogHeader>

                    <div className="flex justify-center">
                        <SocialShareGroup
                            title={title}
                            orientation="horizontal"
                            url={resolveVideoUrl(slug)}
                            labels={{
                                facebook: t("videos.detail.shareModal.facebook"),
                                x: t("videos.detail.shareModal.x"),
                                whatsapp: t("videos.detail.shareModal.whatsapp"),
                                copy: t("videos.detail.shareModal.copy")
                            }}
                            onShared={recordShare}
                            onCopied={() => {
                                showNotification(videoLinkCopiedNotification(t));
                                onOpenChange(false);
                            }}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
