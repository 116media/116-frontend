/**
 * Common application constants and environment variables.
 *
 * @description
 * Centralized configuration for the frontend application including:
 *
 * **Environment Variables:**
 * - Application URLs (API base URL)
 * - Client-App identifier header value
 *
 * **Application Identity:**
 * - App name, author, social media handles, description
 * - Logo asset paths (light/dark themes)
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const API_INTERNAL_URL = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL;
export const CLIENT_APP = process.env.NEXT_PUBLIC_CLIENT_APP;

export const APP_NAME = "116";
export const APP_AUTHOR = `${APP_NAME} Network`;
export const APP_TWITTER_HANDLE = `@${APP_NAME}HQ`;
export const APP_DESCRIPTION = "When words stop coming out, music pops up";

export const LOGO_LIGHT = "/assets/logo/light.svg";
export const LOGO_DARK = "/assets/logo/dark.svg";
