# Domain Entities & Mappers

Domain types are framework-free (no axios, no DTOs, no React). Mappers convert
the generated `UserResponseDto` / `SessionDto` into these entities at the
infrastructure boundary — the same pattern as `VideosMapper`/`ArticlesMapper`.

---

## Entities

```ts
// domain/entities/IFileEntity.ts
// Mirrors the dashboard's IUser.avatar: IFile (and mobile's nested File model).
// Kept as a whole object — not flattened to a URL — so it also carries the
// file's colors (the new FileDto.colors) without a separate field.
export interface IFileEntity {
  id: string;
  fileName: string;
  originalFileName: string;
  mimeType: string;
  storageUrl: string;
  sizeInBytes: number;
  isDeleted: boolean;
  colors: { background: string; foreground: string } | null; // from FileDto.colors
}

// domain/entities/IAuthUserEntity.ts
export interface IAuthUserEntity {
  id: string;
  email: string | null;
  userName: string;
  roles: IRoleEntity[];          // { id, name, description }
  permissions: IPermissionEntity[]; // { id, resource, action }
  authProvider: AuthProvider;    // value object
  isVerified: boolean;
  isActive: boolean;
  avatar: IFileEntity | null;    // whole file (≈ dashboard IUser.avatar) — UI reads avatar.storageUrl
  country: {
    name: string | null;
    isoCode: string | null;
    dialCode: string | null;
  } | null;
  phone: {
    partial: string | null;
    full: string | null;
  } | null;
}

// domain/entities/IAuthResponse.ts
// Web: the result of login/signup/refresh is just the user — tokens are in cookies.
export interface IAuthResponse {
  user: IAuthUserEntity;
  verificationRequired?: boolean;  // signup only
}

// domain/entities/ISessionEntity.ts
export interface ISessionEntity {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  browser: string;     // EnumBrowser as string
  device: string;      // EnumDevice
  platform: string;    // EnumPlatform
  client: string;      // EnumClient: WebApp | MobileApp | Dashboard | Unknown
  expiresAt: string;
  isActive: boolean;
  isCurrent: boolean;
  createdAt: string;
}
```

## Value objects

```ts
// domain/valueobjects/AuthStatus.ts
export type AuthStatus = "guest" | "unverified" | "authenticated";
// derived in the provider; helpers:
export const isAuthenticated = (s: AuthStatus) => s === "authenticated";
export const needsVerification = (s: AuthStatus) => s === "unverified";

// domain/valueobjects/OtpPurpose.ts
export type OtpPurpose = "EmailVerification" | "AccountRecovery";

// domain/valueobjects/AuthProvider.ts
export type AuthProvider = "Local" | "Google" | "Facebook";
```

> `AuthStatus` is a derived display concept; it is never persisted. The durable
> facts are `isVerified`/`isActive` on the user (themselves derived from the
> session cookie via the `me` query).

---

## Mapper

```ts
// infrastructure/mappers/auth.mapper.ts
export const AuthMapper = {
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
      avatar: dto.avatar ? AuthMapper.fileFromDto(dto.avatar) : null,  // whole file, like dashboard
      country: dto.countryName || dto.countryIsoCode || dto.countryDialCode
        ? { name: dto.countryName ?? null, isoCode: dto.countryIsoCode ?? null, dialCode: dto.countryDialCode ?? null }
        : null,
      phone: dto.partialPhoneNumber || dto.fullPhoneNumber
        ? { partial: dto.partialPhoneNumber ?? null, full: dto.fullPhoneNumber ?? null }
        : null,
    };
  },

  authResponseFromDto(dto: { user: UserResponseDto; verificationRequired?: boolean }): IAuthResponse {
    return { user: AuthMapper.userFromDto(dto.user), verificationRequired: dto.verificationRequired };
  },

  // dedicated sub-mapper, like the dashboard's fileFromDto (and our other nested mappers)
  fileFromDto(dto: FileDto): IFileEntity {
    return {
      id: dto.id,
      fileName: dto.fileName,
      originalFileName: dto.originalFileName,
      mimeType: dto.mimeType,
      storageUrl: dto.storageUrl,
      sizeInBytes: dto.sizeInBytes,
      isDeleted: dto.isDeleted,
      colors: dto.colors ? { background: dto.colors.background, foreground: dto.colors.foreground } : null,
    };
  },

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
};
```

Conventions match the existing mappers: `roles`/`permissions` are mapped inline;
the richer nested `avatar` file gets its **own entity + dedicated `fileFromDto`
sub-mapper** (like the dashboard's `fileFromDto` and our other nested mappers);
value objects get their own files; the mapper is a plain `const` object of pure
functions.

---

## Why the whole avatar file (not a flattened `avatarUrl`)

This matches the **dashboard** (`IUser.avatar: IFile`, UI reads
`user?.avatar?.storageUrl`) and **mobile** (which keeps a nested `File` model on
the user) — so it is the parity-correct shape, not the lightweight
`IAuthorEntity.avatarUrl` flattening used only for embedded content authors.

Keeping the object also means the avatar's **colors** (`FileDto.colors` from the
poster-colors feature) ride along for free — useful for theming the profile
chip — with no separate `avatarColors` field. The UI reads
`user.avatar?.storageUrl` and, if desired, `user.avatar?.colors`.
