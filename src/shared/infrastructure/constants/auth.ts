/**
 * Names of the HttpOnly cookies the API issues for a browser session.
 *
 * @description
 * Not readable from client JavaScript; a server component reads them to decide
 * whether a session resolution request is worth making.
 */
export const ACCESS_TOKEN_COOKIE = "accessToken";
export const REFRESH_TOKEN_COOKIE = "refreshToken";
