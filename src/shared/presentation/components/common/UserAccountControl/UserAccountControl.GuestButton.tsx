"use client";

import { useTranslation } from "react-i18next";

import { useAuthModal } from "@/modules/auth/presentation/context/AuthModalProvider";
import { Button } from "@/shared/presentation/components/ui/Button";
import { UserRoundIcon } from "@/shared/presentation/components/ui/Icon";

import type { UserAccountControlGuestButtonProps } from "./types";

/**
 * UserAccountControlGuestButton
 *
 * @description
 * The guest state: a button that opens the auth modal, icon-only on mobile and
 * tablet and labelled from `lg` up. `onAction` lets a host surface close itself
 * before the modal takes over.
 */
export function UserAccountControlGuestButton({ onAction }: UserAccountControlGuestButtonProps) {
    const { t } = useTranslation();
    const { open } = useAuthModal();

    const onOpenLogin = () => {
        onAction?.();
        open("login");
    };

    return (
        <Button
            variant="outline"
            onClick={onOpenLogin}
            aria-label={t("navigation.login")}
            className="size-10 p-0 font-medium text-sm [&_svg]:size-5 surface-pro-portrait:size-11.25 surface-pro-portrait:[&_svg]:size-5.5 lg:size-auto lg:px-4 lg:py-2 lg:[&_svg]:size-4"
        >
            <UserRoundIcon className="lg:hidden" />
            <span className="hidden lg:inline">{t("navigation.login")}</span>
        </Button>
    );
}
