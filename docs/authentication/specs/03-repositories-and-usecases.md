# Spec 03 — Repositories, Use Cases & DI

Ports, implementations (generated client → `Result<T>`), thin use cases, and
Awilix registration. Same shape as `videos`/`articles`.

Design ref: [../11-repositories-and-usecases.md](../11-repositories-and-usecases.md).

---

## Tasks

- [ ] Presentation credential models (`presentation/model/I*Credentials.ts`)
- [ ] `IAuthRepositoryPort` + `AuthRepositoryImpl`
- [ ] `ISessionRepositoryPort` + `SessionRepositoryImpl` (bare client)
- [ ] Auth use cases (login, signup, verifyOtp, resendOtp, forgotPassword, resetPassword, changePassword, signOut, signOutAll, getOwnProfile, updateOwnProfile)
- [ ] Session use cases (refreshToken, getSessions, revokeSession)
- [ ] `registerAuthDependencies` + `registerSessionDependencies`
- [ ] Extend `Cradle` (client + server) and wire registration
- [ ] Verify: tsc + biome clean

---

## Presentation credential models

Input shapes are **presentation models** — never inlined in the port. Each is a
JSDoc'd interface under `src/modules/auth/presentation/model/`, exactly like the
dashboard (`ILoginCredentials`, `IVerifyOtpCredentials`, …). The port, use cases,
repository impl, hooks, and forms all reference these types.

```ts
// src/modules/auth/presentation/model/ILoginCredentials.ts

/**
 * Login credentials model.
 *
 * @interface ILoginCredentials
 * @description Presentation-layer input for the login form / use case.
 * @property {string} credentials - Email or username.
 * @property {string} password - Plaintext password (transmitted over HTTPS).
 */
export interface ILoginCredentials {
    credentials: string;
    password: string;
}
```

```ts
// src/modules/auth/presentation/model/ISignupCredentials.ts

/**
 * Sign-up credentials model.
 *
 * @interface ISignupCredentials
 * @description Presentation-layer input for the signup form / use case.
 * @property {string} email - User email.
 * @property {string} userName - Desired username.
 * @property {string} password - Plaintext password.
 */
export interface ISignupCredentials {
    email: string;
    userName: string;
    password: string;
}
```

```ts
// src/modules/auth/presentation/model/IVerifyOtpCredentials.ts
import type { OtpPurpose } from "@/modules/auth/domain/valueobjects/OtpPurpose";

/**
 * Verify-OTP credentials model.
 *
 * @interface IVerifyOtpCredentials
 * @description Presentation-layer input for the OTP verification form / use case.
 * @property {string} email - Recipient email.
 * @property {string} code - 6-digit one-time code.
 * @property {OtpPurpose} purpose - Why the OTP was issued.
 */
export interface IVerifyOtpCredentials {
    email: string;
    code: string;
    purpose: OtpPurpose;
}
```

```ts
// src/modules/auth/presentation/model/IResendOtpCredentials.ts
import type { OtpPurpose } from "@/modules/auth/domain/valueobjects/OtpPurpose";

/**
 * Resend-OTP credentials model.
 *
 * @interface IResendOtpCredentials
 * @description Presentation-layer input for requesting a new OTP.
 * @property {string} email - Recipient email.
 * @property {OtpPurpose} purpose - Why the OTP is being resent.
 */
export interface IResendOtpCredentials {
    email: string;
    purpose: OtpPurpose;
}
```

```ts
// src/modules/auth/presentation/model/IForgotPasswordCredentials.ts

/**
 * Forgot-password credentials model.
 *
 * @interface IForgotPasswordCredentials
 * @description Presentation-layer input for initiating password recovery.
 * @property {string} email - Account email.
 */
export interface IForgotPasswordCredentials {
    email: string;
}
```

```ts
// src/modules/auth/presentation/model/IResetPasswordCredentials.ts

/**
 * Reset-password credentials model.
 *
 * @interface IResetPasswordCredentials
 * @description Presentation-layer input for completing a password reset.
 * @property {string} email - Account email.
 * @property {string} code - Recovery OTP code.
 * @property {string} newPassword - The new password.
 */
export interface IResetPasswordCredentials {
    email: string;
    code: string;
    newPassword: string;
}
```

```ts
// src/modules/auth/presentation/model/IChangePasswordCredentials.ts

/**
 * Change-password credentials model.
 *
 * @interface IChangePasswordCredentials
 * @description Presentation-layer input for changing the password while signed in.
 * @property {string} oldPassword - Current password.
 * @property {string} newPassword - The new password.
 */
export interface IChangePasswordCredentials {
    oldPassword: string;
    newPassword: string;
}
```

```ts
// src/modules/auth/presentation/model/IUpdateProfileCredentials.ts

/**
 * Update-profile credentials model (all fields optional — partial update).
 *
 * @interface IUpdateProfileCredentials
 * @description Presentation-layer input for the (later) profile editing form.
 * @property {string} [email] - New email.
 * @property {string} [userName] - New username.
 * @property {string} [countryName] - Country display name.
 * @property {string} [partialPhoneNumber] - Local phone digits.
 * @property {string} [countryIsoCode] - ISO country code.
 * @property {string} [countryDialCode] - International dial code.
 */
export interface IUpdateProfileCredentials {
    email?: string;
    userName?: string;
    countryName?: string;
    partialPhoneNumber?: string;
    countryIsoCode?: string;
    countryDialCode?: string;
}
```

---

## Auth repository port

```ts
// src/modules/auth/application/repositories/auth.repository.port.ts
import type { IAuthResponseEntity } from "@/modules/auth/domain/entities/IAuthResponseEntity";
import type { IAuthUserEntity } from "@/modules/auth/domain/entities/IAuthUserEntity";
import type { IChangePasswordResponse } from "@/modules/auth/domain/entities/IChangePasswordResponse";
import type { IForgotPasswordResponse } from "@/modules/auth/domain/entities/IForgotPasswordResponse";
import type { IResendOtpResponse } from "@/modules/auth/domain/entities/IResendOtpResponse";
import type { IResetPasswordResponse } from "@/modules/auth/domain/entities/IResetPasswordResponse";
import type { ISignOutAllResponse } from "@/modules/auth/domain/entities/ISignOutAllResponse";
import type { ISignOutResponse } from "@/modules/auth/domain/entities/ISignOutResponse";
import type { IVerifyOtpResponse } from "@/modules/auth/domain/entities/IVerifyOtpResponse";
import type { IChangePasswordCredentials } from "@/modules/auth/presentation/model/IChangePasswordCredentials";
import type { IForgotPasswordCredentials } from "@/modules/auth/presentation/model/IForgotPasswordCredentials";
import type { ILoginCredentials } from "@/modules/auth/presentation/model/ILoginCredentials";
import type { IResendOtpCredentials } from "@/modules/auth/presentation/model/IResendOtpCredentials";
import type { IResetPasswordCredentials } from "@/modules/auth/presentation/model/IResetPasswordCredentials";
import type { ISignupCredentials } from "@/modules/auth/presentation/model/ISignupCredentials";
import type { IUpdateProfileCredentials } from "@/modules/auth/presentation/model/IUpdateProfileCredentials";
import type { IVerifyOtpCredentials } from "@/modules/auth/presentation/model/IVerifyOtpCredentials";
import type { Result } from "@/shared/domain/results/result";

/**
 * IAuthRepositoryPort
 *
 * @description
 * Contract for all public auth operations. Inputs are presentation credential
 * models; every method returns `Result<T>`. Tokens are delivered/cleared by the
 * backend via httpOnly cookies, so the web responses carry only the user or a
 * per-action response entity — never a bare `boolean`, matching the dashboard.
 *
 * @interface IAuthRepositoryPort
 */
export interface IAuthRepositoryPort {
    login(credentials: ILoginCredentials): Promise<Result<IAuthResponseEntity>>;
    signup(credentials: ISignupCredentials): Promise<Result<IAuthResponseEntity>>;
    verifyOtp(credentials: IVerifyOtpCredentials): Promise<Result<IVerifyOtpResponse>>;
    resendOtp(credentials: IResendOtpCredentials): Promise<Result<IResendOtpResponse>>;
    forgotPassword(credentials: IForgotPasswordCredentials): Promise<Result<IForgotPasswordResponse>>;
    resetPassword(credentials: IResetPasswordCredentials): Promise<Result<IResetPasswordResponse>>;
    changePassword(credentials: IChangePasswordCredentials): Promise<Result<IChangePasswordResponse>>;
    signOut(): Promise<Result<ISignOutResponse>>;
    signOutAll(): Promise<Result<ISignOutAllResponse>>;
    getOwnProfile(): Promise<Result<IAuthUserEntity>>;
    updateOwnProfile(credentials: IUpdateProfileCredentials): Promise<Result<IAuthUserEntity>>;
}
```

> Two dashboard conventions are load-bearing here:
>
> 1. **The application port imports presentation credential models** — a credential
>    shape is defined **once** (in `presentation/model/`) and reused by the form,
>    hook, use case, port, and impl.
> 2. **Action endpoints return a domain response entity** extending
>    `IActionResponse`, never `Result<boolean>` and never an inline object. See the
>    entities in [02-domain-entities-and-mappers.md](02-domain-entities-and-mappers.md#action-response-entities).

## Auth repository implementation

```ts
// src/modules/auth/infrastructure/repositories/auth.repository.impl.ts
import type { IAuthRepositoryPort } from "@/modules/auth/application/repositories/auth.repository.port";
import type { IAuthResponseEntity } from "@/modules/auth/domain/entities/IAuthResponseEntity";
import type { IAuthUserEntity } from "@/modules/auth/domain/entities/IAuthUserEntity";
import type { IChangePasswordResponse } from "@/modules/auth/domain/entities/IChangePasswordResponse";
import type { IForgotPasswordResponse } from "@/modules/auth/domain/entities/IForgotPasswordResponse";
import type { IResendOtpResponse } from "@/modules/auth/domain/entities/IResendOtpResponse";
import type { IResetPasswordResponse } from "@/modules/auth/domain/entities/IResetPasswordResponse";
import type { ISignOutAllResponse } from "@/modules/auth/domain/entities/ISignOutAllResponse";
import type { ISignOutResponse } from "@/modules/auth/domain/entities/ISignOutResponse";
import type { IVerifyOtpResponse } from "@/modules/auth/domain/entities/IVerifyOtpResponse";
import type { IChangePasswordCredentials } from "@/modules/auth/presentation/model/IChangePasswordCredentials";
import type { IForgotPasswordCredentials } from "@/modules/auth/presentation/model/IForgotPasswordCredentials";
import type { ILoginCredentials } from "@/modules/auth/presentation/model/ILoginCredentials";
import type { IResendOtpCredentials } from "@/modules/auth/presentation/model/IResendOtpCredentials";
import type { IResetPasswordCredentials } from "@/modules/auth/presentation/model/IResetPasswordCredentials";
import type { ISignupCredentials } from "@/modules/auth/presentation/model/ISignupCredentials";
import type { IUpdateProfileCredentials } from "@/modules/auth/presentation/model/IUpdateProfileCredentials";
import type { IVerifyOtpCredentials } from "@/modules/auth/presentation/model/IVerifyOtpCredentials";
import { AuthMapper } from "@/modules/auth/infrastructure/mappers/auth.mapper";
import type { Api } from "@/shared/infrastructure/api/generated/116.api";
import { ProblemMapper } from "@/shared/infrastructure/mappers/problem.mapper";
import { err, ok, type Result } from "@/shared/domain/results/result";

/**
 * AuthRepositoryImpl
 *
 * @description
 * Implements `IAuthRepositoryPort` against the generated API client. Each method
 * calls the matching `publicX` endpoint, maps the DTO to a domain entity, and
 * funnels any error through `ProblemMapper.toFailure` into `Result.err`.
 *
 * @param client - The generated `Api` instance injected by Awilix.
 */
export class AuthRepositoryImpl implements IAuthRepositoryPort {
    private readonly api: Api<unknown>["api"];

    constructor({ client }: { client: Api<unknown> }) {
        this.api = client.api;
    }

    async login(input: ILoginCredentials): Promise<Result<IAuthResponseEntity>> {
        try {
            const res = await this.api.publicLogin(input);
            return ok(AuthMapper.authResponseFromDto(res.data));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async signup(input: ISignupCredentials): Promise<Result<IAuthResponseEntity>> {
        try {
            const res = await this.api.publicSignUp(input);
            return ok(AuthMapper.authResponseFromDto(res.data));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }
    
    async verifyOtp(input: IVerifyOtpCredentials): Promise<Result<IVerifyOtpResponse>> {
        try {
            const res = await this.api.publicVerifyOtp(input);
            return ok(AuthMapper.actionFromDto(res.data));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }
 
    async resendOtp(input: IResendOtpCredentials): Promise<Result<IResendOtpResponse>> {
        try {
            const res = await this.api.publicResendOtp(input);
            return ok(AuthMapper.actionFromDto(res.data));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async forgotPassword(input: IForgotPasswordCredentials): Promise<Result<IForgotPasswordResponse>> {
        try {
            const res = await this.api.publicForgotPassword(input);
            return ok(AuthMapper.forgotPasswordResponseFromDto(res.data));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async resetPassword(input: IResetPasswordCredentials): Promise<Result<IResetPasswordResponse>> {
        try {
            const res = await this.api.publicResetPassword(input);
            return ok(AuthMapper.actionFromDto(res.data));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async changePassword(input: IChangePasswordCredentials): Promise<Result<IChangePasswordResponse>> {
        try {
            const res = await this.api.publicChangePassword(input);
            return ok(AuthMapper.actionFromDto(res.data));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async signOut():Promise<Result<ISignOutResponse>> {
        try {
            const res = await this.api.publicSignOut({});
            return ok(AuthMapper.actionFromDto(res.data));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async signOutAll(): Promise<Result<ISignOutAllResponse>> {
        try {
            const res = await this.api.publicSignOutAll();
            return ok(AuthMapper.actionFromDto(res.data));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async getOwnProfile(): Promise<Result<IAuthUserEntity>> {
        try {
            const res = await this.api.publicGetOwnProfile();
            return ok(AuthMapper.userFromDto(res.data.user));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async updateOwnProfile(input: IUpdateProfileCredentials): Promise<Result<IAuthUserEntity>> {
        try {
            const res = await this.api.publicUpdateOwnProfile(input);
            return ok(AuthMapper.userFromDto(res.data.user));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }
}
```

> The exact generated method names (`publicLogin`, `publicGetOwnProfile`, …) come
> from `116.api.ts`; re-run `yarn api:generate` and confirm names if they differ.

---

## Session repository (bare client for refresh)

```ts
// src/modules/session/application/repositories/session.repository.port.ts
import type { IRevokeSessionResponse } from "@/modules/auth/domain/entities/IRevokeSessionResponse";
import type { ISessionEntity } from "@/modules/auth/domain/entities/ISessionEntity";
import type { Result } from "@/shared/domain/results/result";

/**
 * ISessionRepositoryPort
 *
 * @description
 * Session operations. `refreshToken` MUST use a bare axios client (no
 * interceptors) to avoid refresh recursion — see [04](04-api-client-interceptors.md).
 *
 * @interface ISessionRepositoryPort
 */
export interface ISessionRepositoryPort {
    /**
     * Refreshes the access token from the refresh-token cookie. Stays
     * Promise-based and **throw-based** (no `Result` wrapper) because the expiry
     * interceptor relies on a thrown rejection to know the refresh failed —
     * matching the dashboard's `SessionRepositoryPort.refreshToken`.
     */
    refreshToken(): Promise<void>;
    getSessions(isActive?: boolean): Promise<Result<ISessionEntity[]>>;
    revokeSession(id: string): Promise<Result<IRevokeSessionResponse>>;
}
```

```ts
// src/modules/session/infrastructure/repositories/session.repository.impl.ts
import axios from "axios";

import type { ISessionRepositoryPort } from "@/modules/session/application/repositories/session.repository.port";
import type { IRevokeSessionResponse } from "@/modules/auth/domain/entities/IRevokeSessionResponse";
import type { ISessionEntity } from "@/modules/auth/domain/entities/ISessionEntity";
import { AuthMapper } from "@/modules/auth/infrastructure/mappers/auth.mapper";
import type { Api } from "@/shared/infrastructure/api/generated/116.api";
import { API_URL, CLIENT_APP } from "@/shared/infrastructure/constants/common";
import { ProblemMapper } from "@/shared/infrastructure/mappers/problem.mapper";
import { err, ok, type Result } from "@/shared/domain/results/result";

/**
 * A bare axios client with NO interceptors, used only to refresh tokens. Sending
 * the refresh request through the interceptor-bearing client would recurse on 401.
 */
const refreshClient = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: { "Client-App": CLIENT_APP },
});

/**
 * SessionRepositoryImpl
 *
 * @description
 * Implements session refresh (bare client) plus the sessions list/revoke (via the
 * normal client). Refresh rotates the cookies server-side; nothing is stored
 * client-side.
 *
 * @param client - The generated `Api` instance (used for list/revoke).
 */
export class SessionRepositoryImpl implements ISessionRepositoryPort {
    private readonly api: Api<unknown>["api"];

    constructor({ client }: { client: Api<unknown> }) {
        this.api = client.api;
    }

    /**
     * @inheritdoc
     * @remarks
     * No try/catch and no `Result` wrapper — a failed refresh must reject so the
     * expiry interceptor can fall through to `REFRESH_TOKEN_EXPIRED_EVENT`.
     */
    async refreshToken(): Promise<void> {
        await refreshClient.post("/api/v1/public/sessions/refresh-token");
    }

    async getSessions(isActive?: boolean): Promise<Result<ISessionEntity[]>> {
        try {
            const res = await this.api.publicGetOwnSessions({ isActive });
            return ok(res.data.sessions.map(AuthMapper.sessionFromDto));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }
    
    async revokeSession(id: string): Promise<Result<IRevokeSessionResponse>> {
        try {
            const res = await this.api.publicRevokeSession(id);
            return ok(AuthMapper.actionFromDto(res.data));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }
}
```

---

## Use cases

All use cases are thin orchestrators with the identical shape — one example, the
rest follow:

```ts
// src/modules/auth/application/usecases/login.usecase.ts
import type { IAuthRepositoryPort } from "@/modules/auth/application/repositories/auth.repository.port";
import type { IAuthResponseEntity } from "@/modules/auth/domain/entities/IAuthResponseEntity";
import type { ILoginCredentials } from "@/modules/auth/presentation/model/ILoginCredentials";
import type { Result } from "@/shared/domain/results/result";

/**
 * LoginUseCase
 *
 * @description
 * Logs a user in with credentials (email or username) + password, returning the
 * authenticated user. Tokens are set by the backend as cookies.
 *
 * @param authRepository - The auth repository (injected).
 */
export class LoginUseCase {
    private readonly authRepository: IAuthRepositoryPort;

    constructor({ authRepository }: { authRepository: IAuthRepositoryPort }) {
        this.authRepository = authRepository;
    }

    /**
     * Executes the login.
     *
     * @param credentials - The login credentials (email/username + password).
     * @returns `ok(IAuthResponseEntity)` on success, `err(Failure)` otherwise.
     */
    execute(credentials: ILoginCredentials): Promise<Result<IAuthResponseEntity>> {
        return this.authRepository.login(credentials);
    }
}
```

The remaining auth use cases are identical except for the method they delegate to:

| File | Class | Delegates to |
|---|---|---|
| `signup.usecase.ts` | `SignupUseCase` | `authRepository.signup` |
| `verifyotp.usecase.ts` | `VerifyOtpUseCase` | `authRepository.verifyOtp` |
| `resendotp.usecase.ts` | `ResendOtpUseCase` | `authRepository.resendOtp` |
| `forgotpassword.usecase.ts` | `ForgotPasswordUseCase` | `authRepository.forgotPassword` |
| `resetpassword.usecase.ts` | `ResetPasswordUseCase` | `authRepository.resetPassword` |
| `changepassword.usecase.ts` | `ChangePasswordUseCase` | `authRepository.changePassword` |
| `signout.usecase.ts` | `SignOutUseCase` | `authRepository.signOut` |
| `signoutall.usecase.ts` | `SignOutAllUseCase` | `authRepository.signOutAll` |
| `getownprofile.usecase.ts` | `GetOwnProfileUseCase` | `authRepository.getOwnProfile` |
| `updateownprofile.usecase.ts` | `UpdateOwnProfileUseCase` | `authRepository.updateOwnProfile` |

Session use cases follow the same pattern against `sessionRepository`:
`RefreshTokenUseCase`, `GetSessionsUseCase`, `RevokeSessionUseCase`.
`RefreshTokenUseCase.execute()` returns `Promise<void>` (it just awaits
`sessionRepository.refreshToken()` and lets a failure throw) — it is the one use
case that is **not** `Result`-wrapped, because the interceptor consumes it.

---

## DI registration

```ts
// src/modules/auth/infrastructure/dependencies/auth.dependencies.ts
import { asClass, type AwilixContainer } from "awilix";

import { AuthRepositoryImpl } from "@/modules/auth/infrastructure/repositories/auth.repository.impl";
import { LoginUseCase } from "@/modules/auth/application/usecases/login.usecase";
// …import the rest…

/**
 * Registers the auth repository (singleton) and every auth use case (transient)
 * into the Awilix container.
 *
 * @param container - The application DI container.
 */
export function registerAuthDependencies(container: AwilixContainer): void {
    container.register({
        authRepository: asClass(AuthRepositoryImpl).singleton(),
        loginUseCase: asClass(LoginUseCase).transient(),
        signupUseCase: asClass(SignupUseCase).transient(),
        verifyOtpUseCase: asClass(VerifyOtpUseCase).transient(),
        resendOtpUseCase: asClass(ResendOtpUseCase).transient(),
        forgotPasswordUseCase: asClass(ForgotPasswordUseCase).transient(),
        resetPasswordUseCase: asClass(ResetPasswordUseCase).transient(),
        changePasswordUseCase: asClass(ChangePasswordUseCase).transient(),
        signOutUseCase: asClass(SignOutUseCase).transient(),
        signOutAllUseCase: asClass(SignOutAllUseCase).transient(),
        getOwnProfileUseCase: asClass(GetOwnProfileUseCase).transient(),
        updateOwnProfileUseCase: asClass(UpdateOwnProfileUseCase).transient(),
    });
}
```

```ts
// src/modules/session/infrastructure/dependencies/session.dependencies.ts
import { asClass, type AwilixContainer } from "awilix";

import { SessionRepositoryImpl } from "@/modules/session/infrastructure/repositories/session.repository.impl";
// …use cases…

/**
 * Registers the session repository (singleton) and session use cases (transient).
 *
 * @param container - The application DI container.
 */
export function registerSessionDependencies(container: AwilixContainer): void {
    container.register({
        sessionRepository: asClass(SessionRepositoryImpl).singleton(),
        refreshTokenUseCase: asClass(RefreshTokenUseCase).transient(),
        getSessionsUseCase: asClass(GetSessionsUseCase).transient(),
        revokeSessionUseCase: asClass(RevokeSessionUseCase).transient(),
    });
}
```

Wire both into `service.locator.ts` next to the existing registrations, and add
the matching fields to the `Cradle` interface (and ensure `getOwnProfileUseCase`
resolves in `server.cradle.ts` for SSR):

```ts
// src/shared/infrastructure/service.locator.ts (additions)
export interface Cradle {
    // …existing…
    authRepository: IAuthRepositoryPort;
    loginUseCase: LoginUseCase;
    // …all auth use cases…
    sessionRepository: ISessionRepositoryPort;
    refreshTokenUseCase: RefreshTokenUseCase;
    getSessionsUseCase: GetSessionsUseCase;
    revokeSessionUseCase: RevokeSessionUseCase;
}

registerAuthDependencies(container);
registerSessionDependencies(container);
```

---

## Verification

- [ ] Every repo method returns `Result`; no `throw` crosses the use-case boundary.
- [ ] `container.cradle.loginUseCase.execute(...)` resolves; `getOwnProfileUseCase`
      resolves in the server cradle.
- [ ] Generated method names match `116.api.ts`.
- [ ] tsc + biome clean.
