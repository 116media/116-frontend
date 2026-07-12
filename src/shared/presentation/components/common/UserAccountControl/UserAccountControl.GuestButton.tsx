"use client";

import { useTranslation } from "react-i18next";

import { useAuthModal } from "@/modules/auth/presentation/context/AuthModalProvider";
import { Button } from "@/shared/presentation/components/ui/Button";

/**
 * UserAccountControlGuestButton
 *
 * @description
 * The guest state: a "Log in" button that opens the auth modal.
 */
export function UserAccountControlGuestButton() {
    const { t } = useTranslation();
    const { open } = useAuthModal();

    return (
        <Button
            variant="outline"
            onClick={() => open("login")}
            className="text-sm font-medium"
        >
            {t("navigation.login")}
        </Button>
    );
}
