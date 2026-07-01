# Spec 02 — Domain Entities & Mappers

Framework-free domain types and the DTO→entity mappers. No axios, no React, no
DTOs leak past this layer.

Design ref: [../10-domain-entities-and-mappers.md](../10-domain-entities-and-mappers.md).

---

## Tasks

- [ ] `IFileEntity`
- [ ] `IAuthUserEntity` (+ `IRoleEntity`, `IPermissionEntity`)
- [ ] `IAuthResponseEntity`
- [ ] Shared `IActionResponse` + per-action response entities (`IVerifyOtpResponse`, `IResendOtpResponse`, `IForgotPasswordResponse`, `IResetPasswordResponse`, `IChangePasswordResponse`, `ISignOutResponse`, `ISignOutAllResponse`, `IRevokeSessionResponse`)
- [ ] `ISessionEntity`
- [ ] Value objects: `AuthStatus`, `OtpPurpose`, `AuthProvider`
- [ ] `AuthMapper` (`userFromDto`, `fileFromDto`, `authResponseFromDto`, `sessionFromDto`, action-response mappers)
- [ ] Verify: tsc + biome clean

---

## Entities

```ts
// src/modules/auth/domain/entities/IRoleEntity.ts

/**
 * IRoleEntity
 *
 * @description
 * An authorization role attached to a user. Carried for fidelity; the public site
 * does not branch UI on roles.
 *
 * @interface IRoleEntity
 * @property {string} id - Role unique identifier.
 * @property {string} name - Role name (e.g. "Visitor").
 * @property {string} description - Human-readable description.
 */
export interface IRoleEntity {
    id: string;
    name: string;
    description: string;
}
```

```ts
// src/modules/auth/domain/entities/IPermissionEntity.ts

/**
 * IPermissionEntity
 *
 * @description
 * A resource + action permission pair. Carried for fidelity; not used for UI
 * gating (the backend authorizes).
 *
 * @interface IPermissionEntity
 * @property {string} id - Permission unique identifier.
 * @property {string} resource - Resource name (e.g. "comments").
 * @property {string} action - Action name (e.g. "create").
 */
export interface IPermissionEntity {
    id: string;
    resource: string;
    action: string;
}
```

```ts
// src/modules/auth/domain/entities/IFileEntity.ts

/**
 * IFileEntity
 *
 * @description
 * A stored file (e.g. the user's avatar). Kept as a whole object — not flattened to
 * a URL — mirroring the dashboard's `IUser.avatar: IFile` and mobile's nested File
 * model, so it also carries the file's poster-derived colors.
 *
 * @interface IFileEntity
 * @property {string} id - File unique identifier.
 * @property {string} fileName - Stored filename.
 * @property {string} originalFileName - Original uploaded filename.
 * @property {string} mimeType - MIME type (e.g. "image/png").
 * @property {string} storageUrl - URL to fetch the file.
 * @property {number} sizeInBytes - File size in bytes.
 * @property {boolean} isDeleted - Soft-delete flag.
 * @property {{ background: string; foreground: string } | null} colors - Poster-derived color pair, or null.
 */
export interface IFileEntity {
    id: string;
    fileName: string;
    originalFileName: string;
    mimeType: string;
    storageUrl: string;
    sizeInBytes: number;
    isDeleted: boolean;
    colors: { background: string; foreground: string } | null;
}
```

```ts
// src/modules/auth/domain/entities/IAuthUserEntity.ts
import type { AuthProvider } from "@/modules/auth/domain/valueobjects/AuthProvider";
import type { IFileEntity } from "@/modules/auth/domain/entities/IFileEntity";
import type { IPermissionEntity } from "@/modules/auth/domain/entities/IPermissionEntity";
import type { IRoleEntity } from "@/modules/auth/domain/entities/IRoleEntity";

/**
 * IAuthUserEntity
 *
 * @description
 * The authenticated user shared app-wide via `useAuth()`. Maps from the backend
 * `UserResponseDto`. `isVerified`/`isActive` drive the derived auth status; the
 * avatar is the whole file object (see `IFileEntity`).
 *
 * @interface IAuthUserEntity
 * @property {string} id - User UUID.
 * @property {string | null} email - Email, or null for some providers.
 * @property {string} userName - Display name.
 * @property {IRoleEntity[]} roles - Assigned roles (fidelity only).
 * @property {IPermissionEntity[]} permissions - Effective permissions (fidelity only).
 * @property {AuthProvider} authProvider - How the account authenticates.
 * @property {boolean} isVerified - Whether the email is verified.
 * @property {boolean} isActive - Whether the account is active.
 * @property {IFileEntity | null} avatar - The avatar file, or null.
 * @property {{ name: string | null; isoCode: string | null; dialCode: string | null } | null} country - Country info, or null.
 * @property {{ partial: string | null; full: string | null } | null} phone - Phone info, or null.
 */
export interface IAuthUserEntity {
    id: string;
    email: string | null;
    userName: string;
    roles: IRoleEntity[];
    permissions: IPermissionEntity[];
    authProvider: AuthProvider;
    isVerified: boolean;
    isActive: boolean;
    avatar: IFileEntity | null;
    country: { name: string | null; isoCode: string | null; dialCode: string | null } | null;
    phone: { partial: string | null; full: string | null } | null;
}
```

```ts
// src/modules/auth/domain/entities/IAuthResponseEntity.ts
import type { IAuthUserEntity } from "@/modules/auth/domain/entities/IAuthUserEntity";

/**
 * IAuthResponseEntity
 *
 * @description
 * The result of login/signup/refresh on the web: just the user (tokens are in
 * httpOnly cookies, never in the body). Named after mobile's `AuthResponseEntity`.
 *
 * @interface IAuthResponseEntity
 * @property {IAuthUserEntity} user - The authenticated user.
 * @property {boolean} [verificationRequired] - True after signup when email verification is pending.
 */
export interface IAuthResponseEntity {
    user: IAuthUserEntity;
    verificationRequired?: boolean;
}
```

### Action response entities

Action endpoints (verify, resend, forgot/reset/change password, sign-out,
revoke) return a success indicator — never a bare `boolean`. Following the
dashboard, each is its own domain entity extending a shared `IActionResponse`,
so the repository port stays self-documenting and a response can later grow
fields without changing call sites.

```ts
// src/shared/domain/types/action.response.ts

/**
 * IActionResponse
 *
 * @description
 * Shared base for any action endpoint that returns a success indicator. Module
 * response entities extend this rather than re-declaring `isSuccess`.
 *
 * @interface IActionResponse
 * @property {boolean} isSuccess - Whether the operation completed successfully.
 */
export interface IActionResponse {
    isSuccess: boolean;
}
```

```ts
// src/modules/auth/domain/entities/IVerifyOtpResponse.ts
import type { IActionResponse } from "@/shared/domain/types/action.response";

/**
 * IVerifyOtpResponse
 *
 * @description Response from OTP verification.
 * @interface IVerifyOtpResponse
 * @extends {IActionResponse}
 */
export interface IVerifyOtpResponse extends IActionResponse {}
```

```ts
// src/modules/auth/domain/entities/IResendOtpResponse.ts
import type { IActionResponse } from "@/shared/domain/types/action.response";

/**
 * IResendOtpResponse
 *
 * @description Response from resending an OTP.
 * @interface IResendOtpResponse
 * @extends {IActionResponse}
 */
export interface IResendOtpResponse extends IActionResponse {}
```

```ts
// src/modules/auth/domain/entities/IForgotPasswordResponse.ts
import type { IActionResponse } from "@/shared/domain/types/action.response";

/**
 * IForgotPasswordResponse
 *
 * @description
 * Response from a forgot-password request. Carries the email so the next view
 * (reset) can pre-fill it.
 *
 * @interface IForgotPasswordResponse
 * @extends {IActionResponse}
 * @property {string} email - The email the recovery code was sent to.
 */
export interface IForgotPasswordResponse extends IActionResponse {
    email: string;
}
```

```ts
// src/modules/auth/domain/entities/IResetPasswordResponse.ts
import type { IActionResponse } from "@/shared/domain/types/action.response";

/**
 * IResetPasswordResponse
 *
 * @description Response from completing a password reset.
 * @interface IResetPasswordResponse
 * @extends {IActionResponse}
 */
export interface IResetPasswordResponse extends IActionResponse {}
```

```ts
// src/modules/auth/domain/entities/IChangePasswordResponse.ts
import type { IActionResponse } from "@/shared/domain/types/action.response";

/**
 * IChangePasswordResponse
 *
 * @description Response from changing the password while signed in.
 * @interface IChangePasswordResponse
 * @extends {IActionResponse}
 */
export interface IChangePasswordResponse extends IActionResponse {}
```

```ts
// src/modules/auth/domain/entities/ISignOutResponse.ts
import type { IActionResponse } from "@/shared/domain/types/action.response";

/**
 * ISignOutResponse
 *
 * @description Response from signing out the current session.
 * @interface ISignOutResponse
 * @extends {IActionResponse}
 */
export interface ISignOutResponse extends IActionResponse {}
```

```ts
// src/modules/auth/domain/entities/ISignOutAllResponse.ts
import type { IActionResponse } from "@/shared/domain/types/action.response";

/**
 * ISignOutAllResponse
 *
 * @description Response from signing out every session.
 * @interface ISignOutAllResponse
 * @extends {IActionResponse}
 */
export interface ISignOutAllResponse extends IActionResponse {}
```

```ts
// src/modules/auth/domain/entities/IRevokeSessionResponse.ts
import type { IActionResponse } from "@/shared/domain/types/action.response";

/**
 * IRevokeSessionResponse
 *
 * @description Response from revoking a single device session.
 * @interface IRevokeSessionResponse
 * @extends {IActionResponse}
 */
export interface IRevokeSessionResponse extends IActionResponse {}
```

```ts
// src/modules/auth/domain/entities/ISessionEntity.ts

/**
 * ISessionEntity
 *
 * @description
 * A device session row for the (later) sessions UI. Maps from `SessionDto`.
 *
 * @interface ISessionEntity
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
 * @property {string} createdAt - ISO creation timestamp.
 */
export interface ISessionEntity {
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
    createdAt: string;
}
```

---

## Value objects

```ts
// src/modules/auth/domain/valueobjects/AuthStatus.ts

/**
 * The derived authentication status of the current visitor.
 */
export type AuthStatus = "loading" | "guest" | "unverified" | "authenticated";

/**
 * Whether the status grants full (verified) access.
 *
 * @param status - The current auth status.
 * @returns True only when authenticated and verified.
 */
export const isAuthenticatedStatus = (status: AuthStatus): boolean => status === "authenticated";

/**
 * Whether the status requires email verification before protected access.
 *
 * @param status - The current auth status.
 * @returns True when logged in but unverified.
 */
export const needsVerification = (status: AuthStatus): boolean => status === "unverified";
```

```ts
// src/modules/auth/domain/valueobjects/OtpPurpose.ts

/**
 * The reason an OTP was issued — drives the verify/resend endpoints.
 */
export type OtpPurpose = "EmailVerification" | "AccountRecovery";
```

```ts
// src/modules/auth/domain/valueobjects/AuthProvider.ts

/**
 * How an account authenticates.
 */
export type AuthProvider = "Local" | "Google" | "Facebook";
```

---

## Mapper

```ts
// src/modules/auth/infrastructure/mappers/auth.mapper.ts
import type {
    FileDto,
    SessionDto,
    UserResponseDto,
} from "@/shared/infrastructure/api/generated/116.api";
import type { AuthProvider } from "@/modules/auth/domain/valueobjects/AuthProvider";
import type { IAuthResponseEntity } from "@/modules/auth/domain/entities/IAuthResponseEntity";
import type { IAuthUserEntity } from "@/modules/auth/domain/entities/IAuthUserEntity";
import type { IFileEntity } from "@/modules/auth/domain/entities/IFileEntity";
import type { IForgotPasswordResponse } from "@/modules/auth/domain/entities/IForgotPasswordResponse";
import type { ISessionEntity } from "@/modules/auth/domain/entities/ISessionEntity";
import type { IActionResponse } from "@/shared/domain/types/action.response";

/**
 * AuthMapper
 *
 * @description
 * Pure DTO→entity mappers for the auth module, mirroring `VideosMapper`/the
 * dashboard's `AuthMapper`. Nested objects (`roles`, `permissions`) map inline; the
 * richer `avatar` file gets its own `fileFromDto` sub-mapper.
 */
export const AuthMapper = {
    /**
     * Maps a `FileDto` to an `IFileEntity` (used for the user's avatar).
     *
     * @param dto - The file DTO.
     * @returns The mapped file entity.
     */
    fileFromDto(dto: FileDto): IFileEntity {
        return {
            id: dto.id,
            fileName: dto.fileName,
            originalFileName: dto.originalFileName,
            mimeType: dto.mimeType,
            storageUrl: dto.storageUrl,
            sizeInBytes: dto.sizeInBytes,
            isDeleted: dto.isDeleted,
            colors: dto.colors
                ? { background: dto.colors.background, foreground: dto.colors.foreground }
                : null,
        };
    },

    /**
     * Maps a `UserResponseDto` to an `IAuthUserEntity`.
     *
     * @param dto - The user DTO from the backend.
     * @returns The mapped user entity.
     */
    userFromDto(dto: UserResponseDto): IAuthUserEntity {
        return {
            id: dto.id,
            email: dto.email ?? null,
            userName: dto.userName,
            roles: dto.roles.map((r) => ({ id: r.id, name: r.name, description: r.description })),
            permissions: dto.permissions.map((p) => ({ id: p.id, resource: p.resource, action: p.action })),
            authProvider: dto.authProvider as AuthProvider,
            isVerified: dto.isVerified,
            isActive: dto.isActive,
            avatar: dto.avatar ? AuthMapper.fileFromDto(dto.avatar) : null,
            country:
                dto.countryName || dto.countryIsoCode || dto.countryDialCode
                    ? {
                          name: dto.countryName ?? null,
                          isoCode: dto.countryIsoCode ?? null,
                          dialCode: dto.countryDialCode ?? null,
                      }
                    : null,
            phone:
                dto.partialPhoneNumber || dto.fullPhoneNumber
                    ? { partial: dto.partialPhoneNumber ?? null, full: dto.fullPhoneNumber ?? null }
                    : null,
        };
    },

    /**
     * Maps a web auth response (`{ user, verificationRequired? }`) to the domain.
     *
     * @param dto - The login/signup/refresh web response.
     * @returns The mapped auth response entity.
     */
    authResponseFromDto(dto: { user: UserResponseDto; verificationRequired?: boolean }): IAuthResponseEntity {
        return { user: AuthMapper.userFromDto(dto.user), verificationRequired: dto.verificationRequired };
    },

    /**
     * Maps a `SessionDto` to an `ISessionEntity`.
     *
     * @param dto - The session DTO.
     * @returns The mapped session entity.
     */
    sessionFromDto(dto: SessionDto): ISessionEntity {
        return {
            id: dto.id,
            ipAddress: dto.ipAddress ?? null,
            userAgent: dto.userAgent ?? null,
            browser: String(dto.browser),
            device: String(dto.device),
            platform: String(dto.platform),
            client: String(dto.client),
            expiresAt: dto.expiresAt,
            isActive: dto.isActive,
            isCurrent: dto.isCurrent,
            createdAt: dto.createdAt,
        };
    },

    /**
     * Maps any `{ isSuccess }` DTO to an `IActionResponse`-shaped entity. The
     * `verifyOtp`/`resendOtp`/`resetPassword`/`changePassword`/`signOut`/
     * `signOutAll`/`revokeSession` responses all reuse this.
     *
     * @param dto - A DTO exposing `isSuccess`.
     * @returns The mapped action response.
     */
    actionFromDto(dto: { isSuccess: boolean }): IActionResponse {
        return { isSuccess: dto.isSuccess };
    },

    /**
     * Maps a forgot-password DTO (`{ isSuccess, email }`) to its entity.
     *
     * @param dto - The forgot-password DTO.
     * @returns The mapped forgot-password response (with `email`).
     */
    forgotPasswordResponseFromDto(dto: { isSuccess: boolean; email: string }): IForgotPasswordResponse {
        return { isSuccess: dto.isSuccess, email: dto.email };
    },
} as const;
```

---

## Verification

- [ ] tsc resolves all entity imports; no DTO type leaks outside the mapper.
- [ ] `AuthMapper.userFromDto` handles null email/avatar/country/phone.
- [ ] biome clean.
