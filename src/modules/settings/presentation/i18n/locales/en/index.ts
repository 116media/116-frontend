import { account } from "./account";
import { common } from "./common";
import { menu, nav } from "./nav";
import { notification } from "./notification";
import { profile } from "./profile";
import { security } from "./security";

/**
 * The settings module's English bundle. The composition root nests it under the
 * `settings` namespace, so keys resolve as `t("settings.profile.title")`.
 */
export const en = {
    common,
    nav,
    menu,
    profile,
    security,
    account,
    notification
} as const;
