"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthModal } from "@/modules/auth/presentation/context/AuthModalProvider";
import { useAuth } from "@/modules/auth/presentation/context/AuthProvider";
import { useLogout } from "@/modules/auth/presentation/hooks/useLogout";
import { Button } from "@/shared/presentation/components/ui/Button";
import { ConfirmDialog } from "@/shared/presentation/components/ui/ConfirmDialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/shared/presentation/components/ui/DropdownMenu";
import { getAvatarColor, getInitials } from "@/shared/presentation/utils/avatar";
import { cn } from "@/shared/presentation/utils/cn";
import { UserAvatar } from "../UserAvatar";

interface UserAccountControlProps {
    className?: string;
}

/**
 * UserAccountControl
 *
 * @description
 * The Header's auth control, driven by `useAuth()`:
 *
 * - **Guest** — renders a "Log in" button that opens the auth modal at the login
 *   view via `useAuthModal().open("login")`.
 * - **Authenticated** — renders the user's avatar as a dropdown trigger; the menu
 *   shows the username and a "Sign out" action wired to `useLogout`.
 *
 * The domain `IAuthUser` is mapped to the presentation `User` shape so the
 * avatar helpers stay decoupled from the domain.
 *
 * @param className - Additional classes to merge onto the trigger.
 */
export function UserAccountControl({ className }: UserAccountControlProps) {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { open } = useAuthModal();
    const logout = useLogout();
    const [confirmOpen, setConfirmOpen] = useState(false);

    if (!user) {
        return (
            <Button
                variant="outline"
                className={cn("text-sm font-medium", className)}
                onClick={() => open("login")}
            >
                {t("navigation.login")}
            </Button>
        );
    }

    const avatarUrl = user.avatar?.storageUrl;

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        size="icon"
                        type="button"
                        variant="ghost"
                        aria-label={`Compte de ${user.userName}`}
                        className={cn(
                            "size-8 rounded-full p-0 text-primary-foreground text-sm font-semibold ring-2 ring-border transition-opacity hover:opacity-90",
                            className
                        )}
                        style={
                            avatarUrl ? undefined : { backgroundColor: getAvatarColor(user.userName) }
                        }
                    >
                        <UserAvatar
                            userName={user.userName}
                            image={avatarUrl}
                            initials={getInitials(user.userName)}
                        />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="min-w-44"
                >
                    <div className="px-2 py-1.5 text-sm font-semibold text-foreground">
                        {user.userName}
                    </div>
                    <DropdownMenuItem
                        onSelect={() => setConfirmOpen(true)}
                        className="text-destructive focus:text-destructive"
                    >
                        {t("auth.session.signOut")}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ConfirmDialog
                destructive
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                loading={logout.isPending}
                title={t("auth.session.signOutConfirmTitle")}
                description={t("auth.session.signOutConfirmDescription")}
                confirmLabel={t("auth.session.signOut")}
                cancelLabel={t("auth.common.cancel")}
                onConfirm={() => logout.mutate({}, { onSuccess: () => setConfirmOpen(false) })}
            />
        </>
    );
}
