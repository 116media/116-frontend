"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuthModal } from "@/modules/auth/presentation/context/AuthModalProvider";
import { useAuth } from "@/modules/auth/presentation/context/AuthProvider";
import { useLogout } from "@/modules/auth/presentation/hooks/useLogout";
import { UserAvatar } from "@/shared/presentation/components/common/UserAvatar";
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
import { LogOutIcon } from "@/shared/presentation/components/ui/Icon";
import { Skeleton } from "@/shared/presentation/components/ui/Skeleton";
import { USER_MENU_ITEMS } from "@/shared/presentation/constants/userMenu";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

export interface UserAccountControlProps {
    className?: string;
}

/**
 * UserAccountControl
 *
 * @description
 * The Header's auth control, driven by `useAuth()`. Guests get a "Log in" button that
 * opens the auth modal; authenticated users get an avatar dropdown with the
 * {@link USER_MENU_ITEMS} entries and a confirm-gated sign-out wired to `useLogout`.
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
            <Skeleton
                aria-hidden
                className={cn("size-8 rounded-full ring-2 ring-foreground/25", className)}
            />
        );
    }

    if (!user) {
        return (
            <Button
                variant="outline"
                onClick={() => open("login")}
                className={cn("text-sm font-medium", className)}
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
                            "size-8 rounded-full p-0 ring-2 ring-foreground/25 transition-opacity hover:opacity-90",
                            className
                        )}
                    >
                        <UserAvatar
                            size={32}
                            image={avatarUrl}
                            userName={user.userName}
                        />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="min-w-64 bg-sidebar p-2"
                >
                    <div className="flex flex-col items-center gap-1 px-4 pt-3 pb-2 text-center">
                        <UserAvatar
                            size={64}
                            image={avatarUrl}
                            userName={user.userName}
                            className="ring-2 ring-foreground/25"
                        />
                        <div className="mt-1 w-full min-w-0">
                            <p className="truncate font-medium text-foreground text-sm">
                                {user.userName}
                            </p>
                            {user.email && (
                                <p className="truncate text-muted-foreground text-xs">
                                    {user.email}
                                </p>
                            )}
                        </div>
                    </div>

                    <DropdownMenuSeparator />

                    <DropdownMenuLabel>{t("settings.menu.group")}</DropdownMenuLabel>
                    {USER_MENU_ITEMS.map(({ key, labelKey, path, Icon }) => (
                        <DropdownMenuItem
                            key={key}
                            className="p-2"
                            onSelect={() => router.push(path)}
                        >
                            <Icon className="size-4" />
                            {t(labelKey)}
                        </DropdownMenuItem>
                    ))}

                    <DropdownMenuSeparator className="mx-0! my-2" />

                    <DropdownMenuItem
                        onSelect={() => setConfirmOpen(true)}
                        className="py-2 text-destructive focus:text-destructive"
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
