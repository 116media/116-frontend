"use client";

import { useTranslation } from "react-i18next";

import { DialogCloseButton } from "@/shared/presentation/components/ui/Dialog";
import { Logo } from "@/shared/presentation/components/ui/Logo";
import { PAGE_GUTTER } from "@/shared/presentation/constants/layout";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * MobileMegaMenu.Header
 *
 * @description
 * close control on the right. The logo does not link, since navigating would leave
 * the panel open over the destination.
 */
export function MobileMegaMenuHeader() {
    const { t } = useTranslation();

    return (
        <div className={cn("flex items-center gap-3 border-b py-3", PAGE_GUTTER)}>
            <Logo className="size-9 sm:size-12 md:size-10 surface-pro-portrait:size-11.25" />

            <DialogCloseButton
                className="ml-auto"
                label={t("navigation.mobileMenu.close")}
            />
        </div>
    );
}
