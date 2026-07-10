"use client";

import { useTranslation } from "react-i18next";

import { useShareVideo } from "@/modules/videos/presentation/hooks/useShareVideo";
import { SocialShareGroup } from "@/shared/presentation/components/common/SocialShareGroup";
import { Button } from "@/shared/presentation/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/shared/presentation/components/ui/Dialog";
import { Link2Icon } from "@/shared/presentation/components/ui/Icon";
import { Input } from "@/shared/presentation/components/ui/Input";
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
    slug: string;
    open: boolean;
    title: string;
    videoId: string;
    onOpenChange: (open: boolean) => void;
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
 * The video's share surface: a dialog whose primary affordance is a read-only
 * link field with a copy button — the universal path that covers every surface
 * with no web share intent (Instagram, TikTok, DMs). Below it, a centered
 * {@link SocialShareGroup} row offers the three link-prefilling networks whose
 * unfurl renders the page's Open Graph / player card (Facebook, WhatsApp, X).
 * Every action records the share against the backend fire-and-forget and
 * optimistically bumps the cached detail's `shareCount`; copying additionally
 * toasts. The dialog stays open after copying so the network buttons remain
 * available.
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
    const url = resolveVideoUrl(slug);
    const recordShare = useShareVideo(videoId, slug);

    const copy = async () => {
        await navigator.clipboard.writeText(url);
        recordShare("clipboard");
        showNotification(videoLinkCopiedNotification(t));
    };

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent aria-describedby={undefined}>
                <div className="relative grid gap-5 rounded-2xl border border-border bg-card p-6 shadow-xl">
                    <DialogHeader className="gap-1.5">
                        <DialogTitle>{t("videos.detail.shareModal.title")}</DialogTitle>
                        <p className="text-muted-foreground text-sm">
                            {t("videos.detail.shareModal.subtitle")}
                        </p>
                    </DialogHeader>

                    <div className="flex items-center gap-2 rounded-lg border border-input bg-transparent py-1 pr-2 pl-3 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20 dark:bg-input/30">
                        <Link2Icon className="size-4 shrink-0 text-muted-foreground" />
                        <Input
                            readOnly
                            value={url}
                            onFocus={(event) => event.target.select()}
                            aria-label={t("videos.detail.shareModal.linkLabel")}
                            className="h-9 flex-1 truncate border-0 bg-transparent px-0 focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent"
                        />
                        <Button
                            size="sm"
                            type="button"
                            onClick={copy}
                        >
                            {t("videos.detail.shareModal.copyAction")}
                        </Button>
                    </div>

                    <div className="flex justify-center">
                        <SocialShareGroup
                            url={url}
                            title={title}
                            orientation="horizontal"
                            separated
                            platforms={["facebook", "whatsapp", "x"]}
                            labels={{
                                facebook: t("videos.detail.shareModal.facebook"),
                                x: t("videos.detail.shareModal.x"),
                                whatsapp: t("videos.detail.shareModal.whatsapp"),
                                copy: t("videos.detail.shareModal.copy")
                            }}
                            onShared={recordShare}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
