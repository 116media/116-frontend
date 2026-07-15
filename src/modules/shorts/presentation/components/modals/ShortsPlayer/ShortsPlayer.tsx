"use client";

import { useTranslation } from "react-i18next";

import type { IShortVideoEntity } from "@/modules/shorts/domain/entities/IShortVideoEntity";
import { ShortsPlayerProvider } from "@/modules/shorts/presentation/context/ShortsPlayerProvider";
import { Dialog, DialogContent, DialogTitle } from "@/shared/presentation/components/ui/Dialog";

import { ShortsPlayerClose } from "./ShortsPlayer.Close";
import { ShortsPlayerNav } from "./ShortsPlayer.Nav";
import { ShortsPlayerTrack } from "./ShortsPlayer.Track";

/**
 * Props for the ShortsPlayer component.
 *
 * @interface ShortsPlayerProps
 * @property {IShortVideoEntity[]} shorts - The feed slice to play through.
 * @property {number} initialIndex - The short to open on.
 * @property {boolean} hasNextPage - Whether more shorts can be loaded.
 * @property {() => void} onLoadMore - Fetches the next page as the end nears.
 * @property {(short: IShortVideoEntity) => void} [onActiveShortChange] - Notified when the active short changes (URL sync).
 * @property {() => void} onClose - Closes the modal.
 */
export interface ShortsPlayerProps {
    shorts: IShortVideoEntity[];
    initialIndex: number;
    hasNextPage: boolean;
    onLoadMore: () => void;
    onActiveShortChange?: (short: IShortVideoEntity) => void;
    onClose: () => void;
}

/**
 * ShortsPlayer
 *
 * @description
 * Full-screen, swipeable short-video player. The vertical track fills the viewport
 * over a blurred backdrop and snaps one short per gesture, so scrolling anywhere —
 * not only over the video — navigates. Up/down nav and a close control sit on top.
 * The Radix dialog supplies the focus trap, scroll lock, and escape.
 */
export function ShortsPlayer({
    shorts,
    initialIndex,
    hasNextPage,
    onLoadMore,
    onActiveShortChange,
    onClose
}: ShortsPlayerProps) {
    const { t } = useTranslation();

    return (
        <Dialog
            open
            onOpenChange={(next) => !next && onClose()}
        >
            <DialogContent
                showCloseButton={false}
                aria-describedby={undefined}
                className="inset-0 top-0 left-0 h-full w-full max-w-none translate-x-0 translate-y-0 overflow-hidden border-0 bg-transparent p-0 shadow-none"
            >
                <DialogTitle className="sr-only">{t("shorts.section.title")}</DialogTitle>

                <ShortsPlayerProvider
                    shorts={shorts}
                    initialIndex={initialIndex}
                    hasNextPage={hasNextPage}
                    onLoadMore={onLoadMore}
                    onActiveShortChange={onActiveShortChange}
                >
                    <ShortsPlayerTrack />
                    <ShortsPlayerNav />
                    <ShortsPlayerClose onClose={onClose} />
                </ShortsPlayerProvider>
            </DialogContent>
        </Dialog>
    );
}
