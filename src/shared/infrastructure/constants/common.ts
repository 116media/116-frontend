/**
 * Common application constants: environment-driven URLs and identifiers,
 * plus static app identity values (name, author, description, logo paths).
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const API_INTERNAL_URL = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL;
export const CLIENT_APP = process.env.NEXT_PUBLIC_CLIENT_APP;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
export const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
export const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export const APP_NAME = "116";
export const APP_AUTHOR = `${APP_NAME} Network`;
export const APP_TWITTER_HANDLE = `@${APP_NAME}HQ`;
export const APP_DESCRIPTION = "When words stop coming out, music pops up";

export const LOGO_LIGHT = "/assets/logo/light.svg";
export const LOGO_DARK = "/assets/logo/dark.svg";
