/**
 * ISession
 *
 * @description
 * A device session row for the (later) sessions UI. Maps from `SessionDto`; the
 * resolved enums (browser/device/platform/client) are flattened to display strings.
 *
 * @interface ISession
 * @property {string} id - Session UUID.
 * @property {string | null} ipAddress - Origin IP, or null.
 * @property {string | null} userAgent - Raw user-agent, or null.
 * @property {string} browser - Resolved browser label.
 * @property {string} device - Resolved device label.
 * @property {string} platform - Resolved platform label.
 * @property {string} client - Client label (WebApp | MobileApp | Dashboard | Unknown).
 * @property {string} expiresAt - ISO expiry timestamp.
 * @property {boolean} isActive - Not expired and not revoked.
 * @property {boolean} isCurrent - Whether this is the requesting session.
 * @property {string | null} createdAt - ISO creation timestamp.
 */
export interface ISession {
    id: string;
    ipAddress: string | null;
    userAgent: string | null;
    browser: string;
    device: string;
    platform: string;
    client: string;
    expiresAt: string;
    isActive: boolean;
    isCurrent: boolean;
    createdAt: string | null;
}
