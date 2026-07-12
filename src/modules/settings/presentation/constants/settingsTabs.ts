import type { ComponentType } from "react";

import { LockIcon, SettingsIcon, UserRoundIcon } from "@/shared/presentation/components/ui/Icon";
import {
    SETTINGS_ACCOUNT_PATH,
    SETTINGS_PROFILE_PATH,
    SETTINGS_SECURITY_PATH
} from "@/shared/presentation/constants/paths";

/**
 * The settings navigation tabs (route, i18n label key, icon), in display order.
 */
export const SETTINGS_TABS: ReadonlyArray<{
    href: string;
    labelKey: string;
    Icon: ComponentType<{ className?: string }>;
}> = [
    { href: SETTINGS_PROFILE_PATH, labelKey: "settings.nav.profile", Icon: UserRoundIcon },
    { href: SETTINGS_SECURITY_PATH, labelKey: "settings.nav.security", Icon: LockIcon },
    { href: SETTINGS_ACCOUNT_PATH, labelKey: "settings.nav.account", Icon: SettingsIcon }
];
