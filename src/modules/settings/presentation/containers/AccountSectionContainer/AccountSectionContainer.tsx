"use client";

import { useLogout } from "@/modules/auth/presentation/hooks/useLogout";
import { AccountSection } from "@/modules/settings/presentation/components/sections/AccountSection";

/**
 * AccountSectionContainer
 *
 * @description
 * Smart shell for the Account tab: owns the `useLogout` mutation (which tears down auth
 * state and toasts) and hands the presentational {@link AccountSection} its pending flag
 * and sign-out callback. After success the route guard bounces the guest home.
 */
export function AccountSectionContainer() {
    const logout = useLogout();

    return (
        <AccountSection
            signOutPending={logout.isPending}
            onSignOut={(all, onSuccess) => logout.mutate(all ? { all: true } : {}, { onSuccess })}
        />
    );
}
