"use client";

import { useTranslation } from "react-i18next";

import { useShortsPlayer } from "@/modules/shorts/presentation/context/ShortsPlayerProvider";
import { Button } from "@/shared/presentation/components/ui/Button";
import { ChevronDownIcon, ChevronUpIcon } from "@/shared/presentation/components/ui/Icon";

const NAV_BUTTON_CLASS =
    "size-12 bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 hover:text-white disabled:opacity-40 [&_svg]:size-6";

/**
 * ShortsPlayerNav
 *
 * @description
 * Up/down arrow buttons fixed at the viewport's right edge: up goes to the previous
 * short, down to the next. Disabled at the feed bounds.
 */
export function ShortsPlayerNav() {
    const { t } = useTranslation();
    const { activeIndex, shorts, goPrev, goNext } = useShortsPlayer();

    return (
        <div className="fixed top-1/2 right-4 z-40 flex -translate-y-1/2 flex-col gap-3">
            <Button
                size="icon"
                variant="ghost"
                onClick={goPrev}
                disabled={activeIndex === 0}
                aria-label={t("shorts.player.previous")}
                className={NAV_BUTTON_CLASS}
            >
                <ChevronUpIcon />
            </Button>
            <Button
                size="icon"
                variant="ghost"
                onClick={goNext}
                disabled={activeIndex === shorts.length - 1}
                aria-label={t("shorts.player.next")}
                className={NAV_BUTTON_CLASS}
            >
                <ChevronDownIcon />
            </Button>
        </div>
    );
}
