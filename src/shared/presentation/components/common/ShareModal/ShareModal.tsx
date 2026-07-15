"use client";

import { useEffect, useState } from "react";

import {
    type ISocialShareLabels,
    SocialShareGroup
} from "@/shared/presentation/components/common/SocialShareGroup";
import { Button } from "@/shared/presentation/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/shared/presentation/components/ui/Dialog";
import { Link2Icon, ShareIcon } from "@/shared/presentation/components/ui/Icon";
import { Input } from "@/shared/presentation/components/ui/Input";
import {
    type INotificationConfig,
    showNotification
} from "@/shared/presentation/utils/notification/notification.utils";

/**
 * Props for the ShareModal component.
 *
 * @interface ShareModalProps
 * @property {boolean} open - Whether the modal is open (controlled).
 * @property {(open: boolean) => void} onOpenChange - Open-state setter (backdrop/esc/close).
 * @property {string} url - The absolute URL being shared.
 * @property {string} title - The shared item's title, carried into the share message.
 * @property {string} heading - The dialog heading.
 * @property {string} subtitle - The dialog subtitle.
 * @property {string} linkLabel - Accessible label for the copy-link field.
 * @property {string} copyAction - Label for the copy button.
 * @property {string} [nativeShareLabel] - Label for the native OS share button; when set, the
 * button renders only where the Web Share API is available (chiefly mobile).
 * @property {ISocialShareLabels} labels - Accessible labels for the social buttons.
 * @property {INotificationConfig} copiedNotification - Toast shown when the link is copied.
 * @property {(channel: string) => void} onShared - Records a share against the given channel.
 */
export interface ShareModalProps {
    open: boolean;
    url: string;
    title: string;
    heading: string;
    subtitle: string;
    linkLabel: string;
    copyAction: string;
    nativeShareLabel?: string;
    labels: ISocialShareLabels;
    copiedNotification: INotificationConfig;
    onOpenChange: (open: boolean) => void;
    onShared: (channel: string) => void;
}

/**
 * ShareModal
 *
 * @description
 * The shared share dialog reused across features: an optional native-share button (mobile
 * only), a read-only copy-link field, and a {@link SocialShareGroup} row (Facebook, WhatsApp,
 * X) whose buttons open each platform's own compose page. Copying and every social action
 * record the share fire-and-forget through `onShared`; copying also toasts. All copy is
 * passed in so the modal stays i18n-namespace-agnostic.
 */
export function ShareModal({
    open,
    onOpenChange,
    url,
    title,
    heading,
    subtitle,
    linkLabel,
    copyAction,
    nativeShareLabel,
    labels,
    copiedNotification,
    onShared
}: ShareModalProps) {
    const [canNativeShare, setCanNativeShare] = useState(false);

    useEffect(() => {
        if (typeof navigator === "undefined" || typeof navigator.share !== "function") return;
        setCanNativeShare(navigator.canShare?.({ url }) ?? true);
    }, [url]);

    const copy = async () => {
        await navigator.clipboard.writeText(url);
        onShared("clipboard");
        showNotification(copiedNotification);
    };

    const nativeShare = async () => {
        try {
            await navigator.share({ url, title });
            onShared("native");
        } catch {
            // Dismissed or unsupported at call time — nothing to record.
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent aria-describedby={undefined}>
                <div className="relative grid gap-5 rounded-2xl border bg-card p-6 shadow-xl">
                    <DialogHeader className="gap-1.5">
                        <DialogTitle>{heading}</DialogTitle>
                        <p className="text-muted-foreground text-sm">{subtitle}</p>
                    </DialogHeader>

                    {nativeShareLabel && canNativeShare && (
                        <Button
                            type="button"
                            onClick={nativeShare}
                            className="w-full"
                        >
                            <ShareIcon className="size-4" />
                            {nativeShareLabel}
                        </Button>
                    )}

                    <div className="flex items-center gap-2 rounded-lg border border-input bg-muted py-1 pr-2 pl-3 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20">
                        <Link2Icon className="size-4 shrink-0 text-muted-foreground" />
                        <Input
                            readOnly
                            value={url}
                            aria-label={linkLabel}
                            onFocus={(event) => event.target.select()}
                            className="h-9 flex-1 truncate border-0 bg-transparent px-0 focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent"
                        />
                        <Button size="sm" type="button" onClick={copy}>
                            {copyAction}
                        </Button>
                    </div>

                    <div className="flex justify-center">
                        <SocialShareGroup
                            url={url}
                            separated
                            title={title}
                            labels={labels}
                            orientation="horizontal"
                            platforms={["facebook", "whatsapp", "x"]}
                            onShared={onShared}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
