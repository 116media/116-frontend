"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

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
import { USER_MENU_GROUPS } from "@/shared/presentation/constants/userMenu";
import type { UserAccountControlMenuProps } from "./types";

/**
 * UserAccountControlMenu
 *
 * @description
 * The authenticated state: an avatar dropdown with the {@link USER_MENU_GROUPS}
 * groups and a confirm-gated sign-out wired to `useLogout`.
 */
export function UserAccountControlMenu({ user }: UserAccountControlMenuProps) {
    const { t } = useTranslation();
    const router = useRouter();
    const logout = useLogout();
    const [confirmOpen, setConfirmOpen] = useState(false);

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
                        className="size-8 rounded-full p-0 ring-2 ring-foreground/25 transition-opacity hover:opacity-90"
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

                    {USER_MENU_GROUPS.map((group) => (
                        <div key={group.key}>
                            <DropdownMenuLabel>{t(group.labelKey)}</DropdownMenuLabel>
                            {group.items.map(({ key, labelKey, path, Icon }) => (
                                <DropdownMenuItem
                                    key={key}
                                    className="p-2"
                                    onSelect={() => router.push(path)}
                                >
                                    <Icon className="size-5" />
                                    {t(labelKey)}
                                </DropdownMenuItem>
                            ))}
                        </div>
                    ))}

                    <DropdownMenuSeparator className="mx-0! my-2" />

                    <DropdownMenuItem
                        onSelect={() => setConfirmOpen(true)}
                        className="py-2 text-destructive focus:text-destructive"
                    >
                        <LogOutIcon className="size-5" />
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
