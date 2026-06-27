# Data Layer

How the `settings` and `sessions` modules wire domain → application →
infrastructure → presentation, following the `auth` module conventions.

## Domain entities

### `settings/domain/entities`

- `IProfile` — alias of `IAuthUser` (the `me` user). Already present.
- `IChangePasswordResponse` — `{ isSuccess: boolean }`. Already present.

### `sessions/domain/entities`

- `ISession` (move from `auth/domain/entities`):
  ```ts
  interface ISession {
    id: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    browser: EBrowser;
    device: EDevice;
    platform: EPlatform;
    client: EClient;
    expiresAt: string;      // ISO 8601
    isActive: boolean;
    isCurrent: boolean;
    createdAt?: string | null;
  }
  ```
- `IRevokeSessionResponse` — `{ isSuccess: boolean }` (move from `auth`).

### `sessions/domain/enums`

`EBrowser`, `EDevice`, `EPlatform`, `EClient` — string enums mirroring the backend
`SessionDto` enums. `EDevice` drives the `SessionCard` icon map
(see [06-security-section.md](06-security-section.md)).

## Repository ports

### `settings.repository.port.ts`

```ts
interface ISettingsRepositoryPort {
    getOwnProfile(): Promise<Result<IProfile>>;
    updateOwnProfile(data: IUpdateProfileCredentials): Promise<Result<IProfile>>;
    updateAvatar(file: File): Promise<Result<IProfile>>;
    changePassword(data: IChangePasswordData): Promise<Result<IChangePasswordResponse>>;
    // getOwnRoles(): available but unused by the UI
}
```

### `sessions.repository.port.ts`

```ts
interface ISessionsRepositoryPort {
    getSessions(): Promise<Result<ISession[]>>;
    revokeSession(sessionId: string): Promise<Result<IRevokeSessionResponse>>;
}
```

## Repository implementations

Each method wraps the generated client in try/catch and maps via a `Mapper`:

```ts
async getSessions(): Promise<Result<ISession[]>> {
    try {
        const res = await this.api.publicGetOwnSessions();
        return ok(res.data.sessions.map(SessionsMapper.sessionFromDto));
    } catch (error) {
        return err(ProblemMapper.toFailure(error));
    }
}
```

Mappers: `SettingsMapper.profileFromDto` (delegates to `AuthMapper.userFromDto`),
`SettingsMapper.changePasswordResponseFromDto`, `SessionsMapper.sessionFromDto`
(+ enum mappers), `SessionsMapper.revokeResponseFromDto`.

## Use cases

`Result`-returning, one class per action, constructor-injected with the repository:

| Module | Use case | In → Out |
|--------|----------|----------|
| settings | `GetProfileUseCase` | `void → Result<IProfile>` |
| settings | `UpdateAccountUseCase` | `IUpdateProfileCredentials → Result<IProfile>` |
| settings | `UpdateAvatarUseCase` | `File → Result<IProfile>` |
| settings | `ChangePasswordUseCase` | `IChangePasswordData → Result<IChangePasswordResponse>` |
| sessions | `GetSessionsUseCase` | `void → Result<ISession[]>` |
| sessions | `RevokeSessionUseCase` | `string → Result<IRevokeSessionResponse>` |
| auth | `SignOutUseCase` / `SignOutAllUseCase` | `void → Result<...>` (exist) |

## Presentation models & validation

- `IUpdateProfileCredentials` — `{ userName, countryName, partialPhoneNumber,
  countryIsoCode, countryDialCode }`.
- `IChangePasswordCredentials` — `{ oldPassword, newPassword, confirmPassword }`
  (form) → mapped to `IChangePasswordData` — `{ oldPassword, newPassword }` (API).
- Zod schemas in `settings/presentation/validation`: `profile.schema.ts`,
  `changepassword.schema.ts` (reuse the existing one). Password regex:
  `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\s\S]{6,}$`; confirm must equal new.

## Hooks (fold `Result` → throw)

Queries for reads, mutations for writes — the standard pattern:

```ts
export function useSessions() {
    return useQuery<ISession[], Failure>({
        queryKey: sessionsKeys.list,
        queryFn: async () => {
            const result = await container.cradle.getSessionsUseCase.execute();
            if (!result.ok) throw result.error;
            return result.value;
        }
    });
}

export function useRevokeSession() {
    const qc = useQueryClient();
    return useMutation<IRevokeSessionResponse, Failure, string>({
        mutationFn: async (id) => {
            const result = await container.cradle.revokeSessionUseCase.execute(id);
            if (!result.ok) throw result.error;
            return result.value;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: sessionsKeys.list })
    });
}
```

`useProfile` reads the already-hydrated `me` (align its `queryKey` with
`authKeys.me` so it shares the cache the root hydrates, rather than double-fetching).

## Query keys

```ts
export const settingsKeys = {
    profile: authKeys.me,                 // share the hydrated me cache
} as const;

export const sessionsKeys = {
    all: ["sessions"] as const,
    list: ["sessions", "list"] as const,
} as const;
```

## DI registration

Add `registerSettingsDependencies` (extend existing) and `registerSessionsDependencies`,
called once from `shared/infrastructure/service.locator.ts`. Repositories `singleton`,
use cases `transient`. Extend the `Cradle` interface with the new use-case + repo keys.
A matching `createServerCradle()` scope must expose `getProfileUseCase` (already used
for root hydration) and `getSessionsUseCase` (for Security-tab prefetch).
