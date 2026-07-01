# Spec 06 — Mutation Hooks

One TanStack `useMutation` per auth action, wrapping the matching use case and
keeping `['auth','me']` authoritative.

Design refs: [../05-state-management.md](../05-state-management.md#mutations-one-hook-per-action),
[../07-auth-flows.md](../07-auth-flows.md).

---

## Tasks

- [ ] `useLogin`, `useSignup`, `useVerifyOtp`, `useResendOtp`
- [ ] `useForgotPassword`, `useResetPassword`
- [ ] `useLogout` (sign-out + sign-out-all)
- [ ] `useUpdateProfile` (write-through, no stale data)
- [ ] Verify: cache stays authoritative; cross-tab ping on login/logout

---

## useLogin

```ts
// src/modules/auth/presentation/hooks/useLogin.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authKeys } from "@/modules/auth/presentation/context/authKeys";
import type { ILoginCredentials } from "@/modules/auth/presentation/model/ILoginCredentials";
import container from "@/shared/infrastructure/service.locator";
import { ok } from "@/shared/domain/results/result";

/**
 * useLogin
 *
 * @description
 * Logs in with credentials + password. On success, writes the returned user into
 * `['auth','me']` (instant, authoritative) and pings other tabs; the caller closes
 * the modal. The returned mutation's `error`/`isPending` drive the form's `Alert`
 * and submit button.
 *
 * @returns A TanStack mutation for the login action.
 */
export function useLogin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (credentials: ILoginCredentials) => {
            return container.cradle.loginUseCase.execute(credentials),
        }
        onSuccess: (result) => {
            if (result.ok) {
                queryClient.setQueryData(authKeys.me, ok(result.value.user));
                new BroadcastChannel("auth").postMessage("login");
            } else {
                queryClient.invalidateQueries({ queryKey: authKeys.me });
            }
        },
    });
}
```

## useSignup

```ts
// src/modules/auth/presentation/hooks/useSignup.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authKeys } from "@/modules/auth/presentation/context/authKeys";
import type { ISignupCredentials } from "@/modules/auth/presentation/model/ISignupCredentials";
import container from "@/shared/infrastructure/service.locator";
import { ok } from "@/shared/domain/results/result";

/**
 * useSignup
 *
 * @description
 * Registers a new account. On success the user is logged in but `unverified`; the
 * user object is written to the cache and the caller advances the modal to the
 * verify-otp view (an `EmailVerification` OTP was emailed).
 *
 * @returns A TanStack mutation for the signup action.
 */
export function useSignup() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (credentials: ISignupCredentials) =>
            container.cradle.signupUseCase.execute(credentials),
        onSuccess: (result) => {
            if (result.ok) queryClient.setQueryData(authKeys.me, ok(result.value.user));
        },
    });
}
```

## useVerifyOtp / useResendOtp

```ts
// src/modules/auth/presentation/hooks/useVerifyOtp.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authKeys } from "@/modules/auth/presentation/context/authKeys";
import type { IVerifyOtpCredentials } from "@/modules/auth/presentation/model/IVerifyOtpCredentials";
import container from "@/shared/infrastructure/service.locator";

/**
 * useVerifyOtp
 *
 * @description
 * Verifies a 6-digit OTP for the given purpose. On success invalidates `me` so the
 * user's `isVerified` flips and the derived status becomes `authenticated`.
 *
 * @returns A TanStack mutation for OTP verification.
 */
export function useVerifyOtp() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (credentials: IVerifyOtpCredentials) =>
            container.cradle.verifyOtpUseCase.execute(credentials),
        onSuccess: (result) => {
            if (result.ok) queryClient.invalidateQueries({ queryKey: authKeys.me });
        },
    });
}
```

```ts
// src/modules/auth/presentation/hooks/useResendOtp.ts
"use client";

import { useMutation } from "@tanstack/react-query";

import type { IResendOtpCredentials } from "@/modules/auth/presentation/model/IResendOtpCredentials";
import container from "@/shared/infrastructure/service.locator";

/**
 * useResendOtp
 *
 * @description
 * Re-sends an OTP for the given purpose. The form starts a 60-second cooldown on
 * success (mobile parity).
 *
 * @returns A TanStack mutation for resending an OTP.
 */
export function useResendOtp() {
    return useMutation({
        mutationFn: (credentials: IResendOtpCredentials) =>
            container.cradle.resendOtpUseCase.execute(credentials),
    });
}
```

## useForgotPassword / useResetPassword

```ts
// src/modules/auth/presentation/hooks/useForgotPassword.ts
"use client";

import { useMutation } from "@tanstack/react-query";

import type { IForgotPasswordCredentials } from "@/modules/auth/presentation/model/IForgotPasswordCredentials";
import container from "@/shared/infrastructure/service.locator";

/**
 * useForgotPassword
 *
 * @description
 * Requests a password-recovery OTP. Always resolves success (no account
 * enumeration); the caller advances the modal to the reset view.
 *
 * @returns A TanStack mutation for the forgot-password action.
 */
export function useForgotPassword() {
    return useMutation({
        mutationFn: (credentials: IForgotPasswordCredentials) =>
            container.cradle.forgotPasswordUseCase.execute(credentials),
    });
}
```

```ts
// src/modules/auth/presentation/hooks/useResetPassword.ts
"use client";

import { useMutation } from "@tanstack/react-query";

import type { IResetPasswordCredentials } from "@/modules/auth/presentation/model/IResetPasswordCredentials";
import container from "@/shared/infrastructure/service.locator";

/**
 * useResetPassword
 *
 * @description
 * Sets a new password using the recovery OTP. On success the caller switches the
 * modal to the login view.
 *
 * @returns A TanStack mutation for the reset-password action.
 */
export function useResetPassword() {
    return useMutation({
        mutationFn: (credentials: IResetPasswordCredentials) =>
            container.cradle.resetPasswordUseCase.execute(credentials),
    });
}
```

## useLogout

```ts
// src/modules/auth/presentation/hooks/useLogout.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import container from "@/shared/infrastructure/service.locator";

/**
 * useLogout
 *
 * @description
 * Signs the user out — this device by default, or everywhere when `all` is true.
 * The backend expires the cookies; the client then clears the query cache (→ guest)
 * and pings other tabs.
 *
 * @returns A TanStack mutation; call `.mutate({ all })`.
 */
export function useLogout() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ all }: { all?: boolean } = {}) =>
            all
                ? container.cradle.signOutAllUseCase.execute()
                : container.cradle.signOutUseCase.execute(),
        onSuccess: () => {
            queryClient.clear();
            new BroadcastChannel("auth").postMessage("logout");
        },
    });
}
```

## useUpdateProfile (write-through)

```ts
// src/modules/auth/presentation/hooks/useUpdateProfile.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authKeys } from "@/modules/auth/presentation/context/authKeys";
import type { IUpdateProfileCredentials } from "@/modules/auth/presentation/model/IUpdateProfileCredentials";
import container from "@/shared/infrastructure/service.locator";
import { ok } from "@/shared/domain/results/result";

/**
 * useUpdateProfile
 *
 * @description
 * Updates the current user's profile. The endpoint returns the updated user, so on
 * success we write it straight into `['auth','me']` — authoritative and instant,
 * no refetch, no stale data anywhere `useAuth()` is read. (Used by the later
 * Settings page.)
 *
 * @returns A TanStack mutation for updating the profile.
 */
export function useUpdateProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (credentials: IUpdateProfileCredentials) =>
            container.cradle.updateOwnProfileUseCase.execute(credentials),
        onSuccess: (result) => {
            if (result.ok) queryClient.setQueryData(authKeys.me, ok(result.value));
            else queryClient.invalidateQueries({ queryKey: authKeys.me });
        },
    });
}
```

---

## Verification

- [ ] After login, `useAuth().user` is set with no refetch; modal can close.
- [ ] After verify-otp, status flips unverified → authenticated.
- [ ] Logout clears the cache (guest) and other tabs follow.
- [ ] Profile update reflects instantly in the header/profile (write-through).
- [ ] tsc + biome clean.
