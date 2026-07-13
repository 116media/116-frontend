"use client";

import { useTranslation } from "react-i18next";

import { useShareVideo } from "@/modules/videos/presentation/hooks/useShareVideo";
import { VideoShareNotification } from "@/modules/videos/presentation/utils/notification/videos.share.notification";
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
import { showNotification } from "@/shared/presentation/utils/notification/notification.utils";
import { resolveShareUrl } from "@/shared/presentation/utils/share/share.utils";

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
 * VideoShareModal
 *
 * @description
 * Share dialog: a read-only copy-link field plus a {@link SocialShareGroup}
 * row (Facebook, WhatsApp, X). Every action records the share fire-and-forget
 * and optimistically bumps the cached detail's `shareCount`; copying toasts.
 */
export function VideoShareModal({
    open,
    onOpenChange,
    videoId,
    slug,
    title
}: VideoShareModalProps) {
    const { t } = useTranslation();
    const url = resolveShareUrl(`/videos/${slug}`);
    const recordShare = useShareVideo(videoId, slug);

    const copy = async () => {
        await navigator.clipboard.writeText(url);
        recordShare("clipboard");
        showNotification(VideoShareNotification.linkCopied(t));
    };

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent aria-describedby={undefined}>
                <div className="relative grid gap-5 rounded-2xl border bg-card p-6 shadow-xl">
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
