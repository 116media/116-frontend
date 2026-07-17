"use client";

import { useTranslation } from "react-i18next";

import { Button } from "@/shared/presentation/components/ui/Button";
import { XIcon } from "@/shared/presentation/components/ui/Icon";

/**
 * Props for the ShortsPlayerClose component.
 *
 * @interface ShortsPlayerCloseProps
 * @property {() => void} onClose - Closes the player modal.
 */
export interface ShortsPlayerCloseProps {
    onClose: () => void;
}

/**
 * ShortsPlayerClose
 *
 * @description
 * Fixed top-right close control for the full-screen player, using the shared frosted
 * ghost button recipe.
 */
export function ShortsPlayerClose({ onClose }: ShortsPlayerCloseProps) {
    const { t } = useTranslation();

    return (
        <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            aria-label={t("shorts.player.close")}
            className="fixed top-4 right-4 z-40 size-12 bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 hover:text-white [&_svg]:size-6"
        >
            <XIcon />
        </Button>
    );
}
