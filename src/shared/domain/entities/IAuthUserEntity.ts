import type { IFile } from "@/shared/domain/entities/IFile";
import type { IPermission } from "@/shared/domain/entities/IPermission";
import type { IRole } from "@/shared/domain/entities/IRole";
import type { EAuthProvider } from "@/shared/domain/enums/EAuthProvider";

/**
 * Authenticated user entity, shared app-wide via `useAuth()`.
 *
 * @interface IAuthUserEntity
 *
 * @description
 * Core domain entity for the authenticated user. Maps 1:1 from the backend
 * `UserResponseDto`, with country and phone as flat fields (not nested).
 * `isVerified`/`isActive` drive the derived auth status; the avatar is the whole file object.
 *
 * @property {string} id - Unique user identifier.
 * @property {string | null} [email] - Email address, or null for some providers.
 * @property {string} userName - Display username.
 * @property {IRole[]} roles - Assigned roles (authorization fidelity).
 * @property {IPermission[]} permissions - Effective permissions (authorization fidelity).
 * @property {EAuthProvider} authProvider - Authentication provider ("Local" | "Google" | "Facebook").
 * @property {boolean} isVerified - Whether the account/email is verified.
 * @property {boolean} isActive - Whether the account is active.
 * @property {IFile | null} [avatar] - Avatar/profile picture file, or null.
 * @property {string | null} [countryName] - Country display name.
 * @property {string | null} [countryIsoCode] - ISO country code (e.g. "FR").
 * @property {string | null} [countryDialCode] - Phone dial code (e.g. "+33").
 * @property {string | null} [partialPhoneNumber] - Local phone digits (no dial code).
 * @property {string | null} [fullPhoneNumber] - Complete phone number with dial code.
 * @property {string | null} [createdAt] - ISO account creation timestamp.
 * @property {string | null} [updatedAt] - ISO last-update timestamp.
 */
export interface IAuthUserEntity {
    id: string;
    email?: string | null;
    userName: string;
    roles: IRole[];
    permissions: IPermission[];
    authProvider: EAuthProvider;
    isVerified: boolean;
    isActive: boolean;
    avatar?: IFile | null;
    countryName?: string | null;
    countryIsoCode?: string | null;
    countryDialCode?: string | null;
    partialPhoneNumber?: string | null;
    fullPhoneNumber?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
}
