# Repositories, Use Cases & DI

Same shape as `videos` / `articles`: a **port** interface, an **impl** that
calls the generated client and returns `Result<T>`, thin **use cases**, and
**Awilix** registration into the `Cradle`.

---

## Repository port

```ts
// modules/auth/application/repositories/auth.repository.port.ts
export interface IAuthRepositoryPort {
  login(input: { credentials: string; password: string }): Promise<Result<IAuthResponse>>;
  signup(input: { email: string; userName: string; password: string }): Promise<Result<IAuthResponse>>;
  verifyOtp(input: { email: string; code: string; purpose: OtpPurpose }): Promise<Result<boolean>>;
  resendOtp(input: { email: string; purpose: OtpPurpose }): Promise<Result<boolean>>;
  forgotPassword(input: { email: string }): Promise<Result<{ isSuccess: boolean; email: string }>>;
  resetPassword(input: { email: string; code: string; newPassword: string }): Promise<Result<boolean>>;
  changePassword(input: { oldPassword: string; newPassword: string }): Promise<Result<boolean>>;
  signOut(): Promise<Result<boolean>>;
  signOutAll(): Promise<Result<boolean>>;
  getOwnProfile(): Promise<Result<IAuthUserEntity>>;
  updateOwnProfile(input: UpdateProfileInput): Promise<Result<IAuthUserEntity>>;
}

// modules/session/application/repositories/session.repository.port.ts
export interface ISessionRepositoryPort {
  refreshToken(): Promise<Result<void>>;          // bare client; cookies rotate
  getOwnSessions(isActive?: boolean): Promise<Result<ISessionEntity[]>>;
  revokeSession(id: string): Promise<Result<boolean>>;
}
```

## Repository impl (pattern)

```ts
// modules/auth/infrastructure/repositories/auth.repository.impl.ts
export class AuthRepositoryImpl implements IAuthRepositoryPort {
  private readonly api: Api<unknown>["api"];
  constructor({ client }: { client: Api<unknown> }) {
    this.api = client.api;
  }

  async login(input): Promise<Result<IAuthResponse>> {
    try {
      const res = await this.api.publicLogin(input);            // web shape: { user }
      return ok(AuthMapper.authResponseFromDto(res.data));
    } catch (error) {
      return err(ProblemMapper.toFailure(error));
    }
  }
  // …one method per endpoint, same try/ok/catch/err shape
}
```

`SessionRepositoryImpl.refreshToken()` uses the **bare axios client** (no
interceptors) to avoid refresh recursion — see
[06-api-client-interceptors.md](06-api-client-interceptors.md).

## Use cases (thin)

```ts
// modules/auth/application/usecases/login.usecase.ts
export class LoginUseCase {
  private readonly authRepository: IAuthRepositoryPort;
  constructor({ authRepository }: { authRepository: IAuthRepositoryPort }) {
    this.authRepository = authRepository;
  }
  execute(input: { credentials: string; password: string }) {
    return this.authRepository.login(input);
  }
}
```

One use case per action (see the table in
[07-auth-flows.md](07-auth-flows.md#flow--endpoint--use-case-map)). They add no
logic today but keep the layering consistent and give a seam for future rules
(e.g. analytics, throttling).

---

## DI registration

```ts
// modules/auth/infrastructure/dependencies/auth.dependencies.ts
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

// modules/session/infrastructure/dependencies/session.dependencies.ts
export function registerSessionDependencies(container: AwilixContainer): void {
  container.register({
    sessionRepository: asClass(SessionRepositoryImpl).singleton(),
    refreshTokenUseCase: asClass(RefreshTokenUseCase).transient(),
    getOwnSessionsUseCase: asClass(GetOwnSessionsUseCase).transient(),
    revokeSessionUseCase: asClass(RevokeSessionUseCase).transient(),
  });
}
```

Add the matching fields to the `Cradle` interface in
`service.locator.ts`, and call `registerAuthDependencies(container)` +
`registerSessionDependencies(container)` next to the existing
`registerVideosDependencies` / `registerArticlesDependencies`.

`getOwnProfileUseCase` and the session use cases must also be resolvable in the
**server cradle** (`server.cradle.ts`) for SSR `me` prefetch.

---

## Why repositories are `singleton` but use cases `transient`

Matches the existing convention: repositories are stateless wrappers around the
shared client (safe to share); use cases are cheap and transient. On the server,
the client is swapped per-request via `container.createScope()` so the
cookie-scoped client is used.
