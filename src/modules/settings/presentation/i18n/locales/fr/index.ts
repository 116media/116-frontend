import { account } from "./account";
import { common } from "./common";
import { menu, nav } from "./nav";
import { notification } from "./notification";
import { profile } from "./profile";
import { security } from "./security";

/**
 * The settings module's French bundle — mirror of the English bundle, key-complete.
 */
export const fr = {
    common,
    nav,
    menu,
    profile,
    security,
    account,
    notification
} as const;
