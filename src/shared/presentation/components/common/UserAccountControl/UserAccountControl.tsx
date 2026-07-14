"use client";

import { useAuth } from "@/modules/auth/presentation/context/AuthProvider";
import type { AccountControlViewProps, UserAccountControlProps } from "./types";
import { UserAccountControlGuestButton } from "./UserAccountControl.GuestButton";
import { UserAccountControlLoading } from "./UserAccountControl.Loading";
import { UserAccountControlMenu } from "./UserAccountControl.Menu";
import { UserAccountControlSlot } from "./UserAccountControl.Slot";

/**
 * AccountControlView
 *
 * @description
 * Selects the active auth state view via guard clauses: loading skeleton, guest
 * "Log in" button, or the authenticated avatar menu.
 */
function AccountControlView({ status, user }: AccountControlViewProps) {
    if (status === "loading") return <UserAccountControlLoading />;
    if (!user) return <UserAccountControlGuestButton />;

    return <UserAccountControlMenu user={user} />;
}

/**
 * UserAccountControl
 *
 * @description
 * The Header's auth control, driven by `useAuth()`. Renders the loading skeleton,
 * the guest "Log in" button, or the authenticated avatar menu inside a shared
 * reserved slot so the header never reflows as the auth state resolves.
 */
export function UserAccountControl({ className }: UserAccountControlProps) {
    const { user, status } = useAuth();

    return (
        <UserAccountControlSlot className={className}>
            <AccountControlView
                user={user}
                status={status}
            />
        </UserAccountControlSlot>
    );
}
