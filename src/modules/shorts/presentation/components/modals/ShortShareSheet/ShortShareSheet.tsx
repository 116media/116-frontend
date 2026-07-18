"use client";

import { useTranslation } from "react-i18next";

import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";
import { useShareShort } from "@/modules/shorts/presentation/hooks/useShareShort";
import { ShortShareNotification } from "@/modules/shorts/presentation/utils/notification/shorts.share.notification";
import { shortShareUrl } from "@/modules/shorts/presentation/utils/shorts/shorts.utils";
import { ShareModal } from "@/shared/presentation/components/common/ShareModal";

/**
 * Props for the ShortShareSheet component.
 *
 * @interface ShortShareSheetProps
 * @property {boolean} open - Whether the sheet is open (controlled).
 * @property {IShortVideoEntity} short - The short being shared.
 * @property {(open: boolean) => void} onOpenChange - Open-state setter (backdrop/esc/close).
 */
export interface ShortShareSheetProps {
    open: boolean;
    short: IShortVideoEntity;
    onOpenChange: (open: boolean) => void;
}

/**
 * ShortShareSheet
 *
 * @description
 * Short-video share dialog: the shared {@link ShareModal} wired to the short's
 * deep-link URL, the shorts share copy, and the share-recording hook.
 */
export function ShortShareSheet({ open, short, onOpenChange }: ShortShareSheetProps) {
    const { t } = useTranslation();
    const recordShare = useShareShort(short.id);

    return (
        <ShareModal
            open={open}
            title={short.title}
            onShared={recordShare}
            onOpenChange={onOpenChange}
            url={shortShareUrl(short.slug)}
            heading={t("shorts.share.title")}
            subtitle={t("shorts.share.subtitle")}
            linkLabel={t("shorts.share.linkLabel")}
            copyAction={t("shorts.share.copyAction")}
            nativeShareLabel={t("shorts.actions.share")}
            copiedNotification={ShortShareNotification.linkCopied(t)}
            labels={{
                facebook: t("shorts.share.facebook"),
                x: t("shorts.share.x"),
                whatsapp: t("shorts.share.whatsapp"),
                copy: t("shorts.share.copy")
            }}
        />
    );
}
