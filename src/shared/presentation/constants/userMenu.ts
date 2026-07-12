import type { ComponentType } from "react";

import { LockIcon, UserRoundIcon } from "@/shared/presentation/components/ui/Icon";
import {
    SETTINGS_PROFILE_PATH,
    SETTINGS_SECURITY_PATH
} from "@/shared/presentation/constants/paths";

/**
 * The signed-in account dropdown's navigation entries (label key, route, icon), in
 * display order.
 */
export const USER_MENU_ITEMS: ReadonlyArray<{
    key: string;
    labelKey: string;
    path: string;
    Icon: ComponentType<{ className?: string }>;
}> = [
    {
        key: "profile",
        Icon: UserRoundIcon,
        labelKey: "settings.menu.myProfile",
        path: SETTINGS_PROFILE_PATH
    },
    {
        key: "security",
        Icon: LockIcon,
        labelKey: "settings.menu.changePassword",
        path: SETTINGS_SECURITY_PATH
    }
];
