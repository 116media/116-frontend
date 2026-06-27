"use client";

import { useRouter } from "next/navigation";
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
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/shared/presentation/components/ui/DropdownMenu";
import { LockIcon, LogOutIcon, UserRoundIcon } from "@/shared/presentation/components/ui/Icon";
import {
    SETTINGS_PROFILE_PATH,
    SETTINGS_SECURITY_PATH
} from "@/shared/presentation/constants/paths";
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
 * - **Authenticated** — renders the user's avatar as a dropdown trigger. The menu
 *   shows the avatar, username, and email (no role), an "Account" group linking to
 *   the profile and change-password settings tabs, and a destructive "Sign out"
 *   action gated behind a confirmation dialog wired to `useLogout`.
 *
 * @param className - Additional classes to merge onto the trigger.
 */
export function UserAccountControl({ className }: UserAccountControlProps) {
    const { t } = useTranslation();
    const router = useRouter();
    const { user, status } = useAuth();
    const { open } = useAuthModal();
    const logout = useLogout();
    const [confirmOpen, setConfirmOpen] = useState(false);

    if (status === "loading") {
        return (
            <div
                aria-hidden
                className={cn(
                    "size-8 animate-pulse rounded-full bg-muted ring-2 ring-border",
                    className
                )}
            />
        );
    }

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
                            avatarUrl
                                ? undefined
                                : { backgroundColor: getAvatarColor(user.userName) }
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
                    className="min-w-64"
                >
                    <div className="flex items-center gap-3 px-2 py-1.5">
                        <div
                            className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-primary-foreground text-sm font-semibold ring-2 ring-border"
                            style={
                                avatarUrl
                                    ? undefined
                                    : { backgroundColor: getAvatarColor(user.userName) }
                            }
                        >
                            <UserAvatar
                                userName={user.userName}
                                image={avatarUrl}
                                initials={getInitials(user.userName)}
                            />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                                {user.userName}
                            </p>
                            {user.email && (
                                <p className="truncate text-xs text-muted-foreground">
                                    {user.email}
                                </p>
                            )}
                        </div>
                    </div>

                    <DropdownMenuSeparator />

                    <DropdownMenuLabel>{t("settings.menu.group")}</DropdownMenuLabel>
                    <DropdownMenuItem onSelect={() => router.push(SETTINGS_PROFILE_PATH)}>
                        <UserRoundIcon className="size-4" />
                        {t("settings.menu.myProfile")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => router.push(SETTINGS_SECURITY_PATH)}>
                        <LockIcon className="size-4" />
                        {t("settings.menu.changePassword")}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onSelect={() => setConfirmOpen(true)}
                        className="text-destructive focus:text-destructive"
                    >
                        <LogOutIcon className="size-4" />
                        {t("auth.session.signOut")}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ConfirmDialog
                destructive
                open={confirmOpen}
                loading={logout.isPending}
                onOpenChange={setConfirmOpen}
                cancelLabel={t("auth.common.cancel")}
                confirmLabel={t("auth.session.signOut")}
                title={t("auth.session.signOutConfirmTitle")}
                description={t("auth.session.signOutConfirmDescription")}
                onConfirm={() => logout.mutate({}, { onSuccess: () => setConfirmOpen(false) })}
            />
        </>
    );
}
