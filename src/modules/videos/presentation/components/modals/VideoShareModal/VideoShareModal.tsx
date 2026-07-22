"use client";

import { useTranslation } from "react-i18next";

import { useShareVideo } from "@/modules/videos/presentation/hooks/useShareVideo";
import { VideoShareNotification } from "@/modules/videos/presentation/utils/notification/videos.share.notification";
import { ShareModal } from "@/shared/presentation/components/common/ShareModal";
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
 * Video share dialog: the shared {@link ShareModal} wired to the video's detail URL,
 * the video share copy, and the share-recording hook (which optimistically bumps the
 * cached `shareCount`).
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
        <ShareModal
            open={open}
            title={title}
            onShared={recordShare}
            onOpenChange={onOpenChange}
            url={resolveShareUrl(`/videos/${slug}`)}
            heading={t("videos.detail.shareModal.title")}
            subtitle={t("videos.detail.shareModal.subtitle")}
            linkLabel={t("videos.detail.shareModal.linkLabel")}
            copyAction={t("videos.detail.shareModal.copyAction")}
            nativeShareLabel={t("videos.detail.share")}
            copiedNotification={VideoShareNotification.linkCopied(t)}
            labels={{
                facebook: t("videos.detail.shareModal.facebook"),
                x: t("videos.detail.shareModal.x"),
                whatsapp: t("videos.detail.shareModal.whatsapp"),
                copy: t("videos.detail.shareModal.copy")
            }}
        />
    );
}
