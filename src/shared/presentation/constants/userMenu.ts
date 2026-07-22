import type { ComponentType } from "react";

import {
    FilmIcon,
    LockIcon,
    NewspaperIcon,
    SmartphoneIcon,
    UserRoundIcon
} from "@/shared/presentation/components/ui/Icon";
import {
    FAVORITE_ARTICLES_PATH,
    FAVORITE_SHORTS_PATH,
    FAVORITE_VIDEOS_PATH,
    SETTINGS_PROFILE_PATH,
    SETTINGS_SECURITY_PATH
} from "@/shared/presentation/constants/paths";

/**
 * A single navigation entry in the signed-in account dropdown.
 *
 * @property {string} key - Stable React key for the entry.
 * @property {string} labelKey - i18n key resolving the visible label.
 * @property {string} path - Destination route pushed on selection.
 * @property {ComponentType} Icon - Decorative leading icon.
 */
export interface UserMenuItem {
    key: string;
    labelKey: string;
    path: string;
    Icon: ComponentType<{ className?: string }>;
}

/**
 * A labelled group of related account-dropdown entries.
 *
 * @property {string} key - Stable React key for the group.
 * @property {string} labelKey - i18n key resolving the group heading.
 * @property {UserMenuItem[]} items - Ordered entries within the group.
 */
export interface UserMenuGroup {
    key: string;
    labelKey: string;
    items: ReadonlyArray<UserMenuItem>;
}

/**
 * The signed-in account dropdown's navigation, modelled as ordered labelled
 * groups. The Account group precedes the Favorite group; the destructive
 * sign-out row is rendered separately by the menu component.
 */
export const USER_MENU_GROUPS: ReadonlyArray<UserMenuGroup> = [
    {
        key: "account",
        labelKey: "settings.menu.group",
        items: [
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
        ]
    },
    {
        key: "favorite",
        labelKey: "settings.menu.favoriteGroup",
        items: [
            {
                key: "favorite-articles",
                Icon: NewspaperIcon,
                labelKey: "settings.menu.favoriteArticles",
                path: FAVORITE_ARTICLES_PATH
            },
            {
                key: "favorite-videos",
                Icon: FilmIcon,
                labelKey: "settings.menu.favoriteVideos",
                path: FAVORITE_VIDEOS_PATH
            },
            {
                key: "favorite-short-videos",
                Icon: SmartphoneIcon,
                labelKey: "settings.menu.favoriteShortVideos",
                path: FAVORITE_SHORTS_PATH
            }
        ]
    }
];
