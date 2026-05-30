/**
 * User
 *
 * @description
 * Presentation-layer representation of an authenticated user.
 * Used by components that need to display user info (avatar, name)
 * without coupling to the domain or infrastructure layers.
 *
 * @property id - Unique user identifier
 * @property userName - Display name shown in the UI
 * @property image - Optional profile picture URL
 */
export interface User {
    id: string;
    userName: string;
    image?: string;
}
