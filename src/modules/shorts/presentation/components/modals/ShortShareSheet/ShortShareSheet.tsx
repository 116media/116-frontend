"use client";

import { useTranslation } from "react-i18next";

import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";
import { useShareShort } from "@/modules/shorts/presentation/hooks/useShareShort";
import { ShortShareNotification } from "@/modules/shorts/presentation/utils/notification/shorts.share.notification";
import { shortShareUrl } from "@/modules/shorts/presentation/utils/shorts/shorts.utils";
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
 * Share dialog for a short: a read-only copy-link field plus a
 * {@link SocialShareGroup} row. Every action records the share fire-and-forget and
 * optimistically bumps the cached `shareCount`; copying toasts, other channels stay
 * silent.
 */
export function ShortShareSheet({ open, short, onOpenChange }: ShortShareSheetProps) {
    const { t } = useTranslation();
    const url = shortShareUrl(short.slug);
    const recordShare = useShareShort(short.id);

    const copy = async () => {
        await navigator.clipboard.writeText(url);
        recordShare("clipboard");
        showNotification(ShortShareNotification.linkCopied(t));
    };

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent aria-describedby={undefined}>
                <div className="relative grid gap-5 rounded-2xl border bg-card p-6 shadow-xl">
                    <DialogHeader className="gap-1.5">
                        <DialogTitle>{t("shorts.share.title")}</DialogTitle>
                        <p className="text-muted-foreground text-sm">
                            {t("shorts.share.subtitle")}
                        </p>
                    </DialogHeader>

                    <div className="flex items-center gap-2 rounded-lg border border-input bg-transparent py-1 pr-2 pl-3 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20 dark:bg-input/30">
                        <Link2Icon className="size-4 shrink-0 text-muted-foreground" />
                        <Input
                            readOnly
                            value={url}
                            onFocus={(event) => event.target.select()}
                            aria-label={t("shorts.share.linkLabel")}
                            className="h-9 flex-1 truncate border-0 bg-transparent px-0 focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent"
                        />
                        <Button
                            size="sm"
                            type="button"
                            onClick={copy}
                        >
                            {t("shorts.share.copyAction")}
                        </Button>
                    </div>

                    <div className="flex justify-center">
                        <SocialShareGroup
                            url={url}
                            separated
                            title={short.title}
                            orientation="horizontal"
                            platforms={["facebook", "whatsapp", "x"]}
                            labels={{
                                facebook: t("shorts.share.facebook"),
                                x: t("shorts.share.x"),
                                whatsapp: t("shorts.share.whatsapp"),
                                copy: t("shorts.share.copy")
                            }}
                            onShared={recordShare}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
