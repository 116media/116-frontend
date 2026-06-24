# Spec 07 — Auth Modal & Forms

**One** modal driven by a view-history machine: switching forms swaps the dialog
body in place (never opens a second modal) and a back button returns to the
previous view. The visual style matches the **kinix** auth modal — centered
title, floating-label fields, an "or" divider, primary block submit, text footer
links — rebuilt with shadcn/Tailwind on `apps/frontend` theme tokens. Client
validation shows below fields; backend errors show in the top `Alert` only when
present.

Design refs: [../08-modal-forms-ux.md](../08-modal-forms-ux.md),
[../09-forms-and-validation.md](../09-forms-and-validation.md).

---

## Tasks

- [ ] Per-form schemas (`login`/`signup`/`verifyotp`/`forgotpassword`/`resetpassword`/`changepassword`.schema.ts)
- [ ] `AuthModalProvider` + `useAuthModal` (view-history machine: `go`/`back`/`canGoBack` + resume-after-login)
- [ ] `AuthModal` (single Dialog shell + view router + back button + `?auth=` deep link)
- [ ] `LoginForm`, `SignupForm`, `VerifyOtpForm`, `ForgotPasswordForm`, `ResetPasswordForm`
- [ ] Verify: flows + transitions + back + resume work; errors land in the right surface

---

## Per-form schema (example)

```ts
// src/modules/auth/presentation/validation/login.schema.ts
import { z } from "zod";

import { Validators } from "@/shared/presentation/validation/validators";

/**
 * Login form schema — validates an `ILoginCredentials` shape: credentials present
 * (email OR username — no length/format checks, matching the backend's
 * `ValidCredentials`, which only requires presence) + a present (not
 * strength-checked) password. Each builder is passed the field's i18n **label
 * key**, so a failure names the field ("Email or username is required"). The form's
 * TS type is the presentation model `ILoginCredentials`, not a zod-inferred type.
 */
export const loginSchema = z.object({
    credentials: Validators.required("auth.login.credentialsLabel"),
    password: Validators.required("auth.login.passwordLabel"),
});
```

Every builder takes its field's i18n label key (the same key the `FormField` label
uses), exactly as the dashboard passes the field name to `LoginValidator.*`. The
other schemas (`signup`, `verifyotp`, `forgotpassword`, `resetpassword`,
`changepassword`) follow [../09-forms-and-validation.md](../09-forms-and-validation.md),
one file each.

---

## AuthModalProvider

```tsx
// src/modules/auth/presentation/modal/AuthModalProvider.tsx
"use client";

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";

import type { OtpPurpose } from "@/modules/auth/domain/valueobjects/OtpPurpose";

export type AuthView = "login" | "signup" | "verify-otp" | "forgot-password" | "reset-password";

interface AuthModalContextState {
    email?: string;
    purpose?: OtpPurpose;
    onSuccess?: () => void;
}

/**
 * The auth-modal API exposed to the app.
 *
 * @interface AuthModalApi
 * @property {boolean} isOpen - Whether the modal is open.
 * @property {AuthView} view - The active view (the top of the view history).
 * @property {boolean} canGoBack - Whether there is a previous view to return to.
 * @property {AuthModalContextState} context - Cross-view state (email/purpose/onSuccess).
 * @property {(view?: AuthView, ctx?: AuthModalContextState) => void} open - Opens the modal fresh at a view (resets history).
 * @property {() => void} close - Closes the modal and resets history/context.
 * @property {(view: AuthView, ctx?: Partial<AuthModalContextState>) => void} go - Replaces the body with another view in place (pushes history), merging context.
 * @property {() => void} back - Returns to the previous view in history.
 * @property {() => void} runOnSuccess - Runs and clears the resume action (after auth succeeds).
 */
export interface AuthModalApi {
    isOpen: boolean;
    view: AuthView;
    canGoBack: boolean;
    context: AuthModalContextState;
    open: (view?: AuthView, ctx?: AuthModalContextState) => void;
    close: () => void;
    go: (view: AuthView, ctx?: Partial<AuthModalContextState>) => void;
    back: () => void;
    runOnSuccess: () => void;
}

const AuthModalContext = createContext<AuthModalApi | null>(null);

/**
 * AuthModalProvider
 *
 * @description
 * Holds the auth modal's open state, a **view history stack**, and the small
 * context shared between views (email + OTP purpose during a flow, plus an
 * optional resume-after-login action). There is exactly one `AuthModal` rendered
 * here: switching views never mounts a second modal — `go()` swaps the body of the
 * open dialog in place and `back()` returns to the previous view.
 *
 * @param children - The app subtree that can open the modal.
 */
export function AuthModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [history, setHistory] = useState<AuthView[]>(["login"]);
    const [context, setContext] = useState<AuthModalContextState>({});

    const view = history[history.length - 1];
    const canGoBack = history.length > 1;

    const open = useCallback((next: AuthView = "login", ctx: AuthModalContextState = {}) => {
        // Fresh entry from outside the modal — reset history to this single view.
        setHistory([next]);
        setContext(ctx);
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
        setHistory(["login"]);
        setContext({});
    }, []);

    const go = useCallback((next: AuthView, ctx: Partial<AuthModalContextState> = {}) => {
        // Replaces the body of the already-open modal; pushes so back() can return.
        setHistory((prev) => [...prev, next]);
        setContext((prev) => ({ ...prev, ...ctx }));
    }, []);

    const back = useCallback(() => {
        setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
    }, []);

    const runOnSuccess = useCallback(() => {
        context.onSuccess?.();
        close();
    }, [context, close]);

    const api = useMemo<AuthModalApi>(
        () => ({ isOpen, view, canGoBack, context, open, close, go, back, runOnSuccess }),
        [isOpen, view, canGoBack, context, open, close, go, back, runOnSuccess],
    );

    return (
        <AuthModalContext.Provider value={api}>
            {children}
            {/* The one and only auth modal; rendered here so it overlays everything */}
            <AuthModal />
        </AuthModalContext.Provider>
    );
}

/**
 * useAuthModal
 *
 * @description
 * Opens/closes/switches the auth modal from anywhere. Throws outside the provider.
 *
 * @returns The `AuthModalApi`.
 */
export function useAuthModal(): AuthModalApi {
    const api = useContext(AuthModalContext);
    if (!api) throw new Error("useAuthModal must be used within an AuthModalProvider");
    return api;
}
```

---

## AuthModal (view router)

```tsx
// src/modules/auth/presentation/modal/AuthModal.tsx
"use client";

import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/presentation/components/ui/Dialog/Dialog";
import { ForgotPasswordForm } from "@/modules/auth/presentation/components/ForgotPasswordForm/ForgotPasswordForm";
import { LoginForm } from "@/modules/auth/presentation/components/LoginForm/LoginForm";
import { ResetPasswordForm } from "@/modules/auth/presentation/components/ResetPasswordForm/ResetPasswordForm";
import { SignupForm } from "@/modules/auth/presentation/components/SignupForm/SignupForm";
import { type AuthView, useAuthModal } from "@/modules/auth/presentation/modal/AuthModalProvider";
import { VerifyOtpForm } from "@/modules/auth/presentation/components/VerifyOtpForm/VerifyOtpForm";
import { Button } from "@/shared/presentation/components/ui/Button";

/**
 * resolveTitleKey
 *
 * @description
 * Maps a view to its i18n title key without a nested ternary: OTP views share the
 * `otp` namespace, forgot/reset share `password`, the rest use their own name.
 *
 * @param view - The active auth view.
 * @returns The i18n key for that view's title (e.g. `auth.login.title`).
 */
function resolveTitleKey(view: AuthView): string {
    if (view === "verify-otp") return "auth.otp.title";
    if (view === "forgot-password" || view === "reset-password") return "auth.password.title";
    return `auth.${view}.title`;
}

/**
 * AuthModal
 *
 * @description
 * The single auth dialog. Renders the active view (login / signup / verify-otp /
 * forgot / reset) inside one themed `Dialog`; switching views swaps this body in
 * place — it never opens a second modal. A back button appears whenever there is a
 * previous view to return to. Closing is blocked while a mutation is pending
 * (handled inside each form).
 */
export function AuthModal() {
    const { t } = useTranslation();
    const { isOpen, view, canGoBack, close, back } = useAuthModal();

    const titleKey = resolveTitleKey(view);

    return (
        <Dialog open={isOpen} onOpenChange={(o) => !o && close()}>
            <DialogContent aria-describedby="auth-desc">
                <DialogHeader>
                    {canGoBack && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={back}
                            aria-label={t("auth.common.back")}
                            className="absolute left-3 top-3"
                        >
                            <ArrowLeft />
                        </Button>
                    )}
                    <DialogTitle className="text-center" suppressHydrationWarning>{t(titleKey)}</DialogTitle>
                    <DialogDescription id="auth-desc" className="text-center" suppressHydrationWarning>
                        {t(`${titleKey.replace(".title", ".subtitle")}`)}
                    </DialogDescription>
                </DialogHeader>

                {view === "login" && <LoginForm />}
                {view === "signup" && <SignupForm />}
                {view === "verify-otp" && <VerifyOtpForm />}
                {view === "forgot-password" && <ForgotPasswordForm />}
                {view === "reset-password" && <ResetPasswordForm />}
            </DialogContent>
        </Dialog>
    );
}
```

Deep-link: a tiny client effect reads `?auth=login|signup` on mount and calls
`open(view)`, clearing the param on close.

> **kinix parity:** the title + subtitle are **centered**; the dialog sits on a
> `bg-card` surface with `rounded-2xl` corners (the `Dialog` primitive in
> [01](01-foundations.md)). To match kinix's circular close affordance, swap the
> `Dialog` primitive's `<X />` for lucide's `<XCircle />` (one line, in the shared
> `Dialog` — affects every dialog).

---

## LoginForm (full pattern)

```tsx
// src/modules/auth/presentation/components/LoginForm/LoginForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import type { ILoginCredentials } from "@/modules/auth/presentation/model/ILoginCredentials";
import { loginSchema } from "@/modules/auth/presentation/validation/login.schema";
import { useAuthModal } from "@/modules/auth/presentation/modal/AuthModalProvider";
import { useLogin } from "@/modules/auth/presentation/hooks/useLogin";
import type { Failure } from "@/shared/domain/failures/failure";
import { Alert } from "@/shared/presentation/components/ui/Alert/Alert";
import { Button } from "@/shared/presentation/components/ui/Button";
import { FloatingField } from "@/shared/presentation/components/ui/FloatingField/FloatingField";

/**
 * LoginForm
 *
 * @description
 * Credentials + password login, styled to match the kinix auth form: floating-label
 * fields, an "or" divider above which the (later) social buttons mount, a primary
 * **block** submit, and two text footer links (create account / forgot password). A
 * backend `Failure` is held in local state and rendered in the top `Alert` only when
 * present; client errors render below each field. On success the cache is updated by
 * `useLogin`, the resume action runs, and the modal closes. A 403-not-verified
 * switches to verify-otp (no alert — the user is moved forward, not shown an error).
 */
export function LoginForm() {
    const { t } = useTranslation();
    const { go, runOnSuccess } = useAuthModal();
    const login = useLogin();
    const [failure, setFailure] = useState<Failure | null>(null);
    const form = useForm<ILoginCredentials>({
        resolver: zodResolver(loginSchema),
        defaultValues: { credentials: "", password: "" },
    });

    const onSubmit = form.handleSubmit(async (values) => {
        setFailure(null);
        const result = await login.mutateAsync(values);
        if (result.ok) {
            runOnSuccess();
        } else if (result.error.title === "AccountNotVerifiedException") {
            go("verify-otp", { email: values.credentials, purpose: "EmailVerification" });
        } else {
            setFailure(result.error);
        }
    });

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {failure && <Alert error={failure} />}

            {/* SocialLogin buttons mount here in the later social-login phase, above the divider. */}
            <div className="flex items-center gap-3 text-xs uppercase text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                {t("auth.common.or")}
                <span className="h-px flex-1 bg-border" />
            </div>

            <FloatingField
                id="credentials"
                label={t("auth.login.credentialsLabel")}
                autoComplete="username"
                required
                error={form.formState.errors.credentials?.message}
                {...form.register("credentials")}
            />

            <FloatingField
                id="password"
                type="password"
                label={t("auth.login.passwordLabel")}
                autoComplete="current-password"
                required
                error={form.formState.errors.password?.message}
                {...form.register("password")}
            />

            <Button type="submit" disabled={login.isPending} className="w-full">
                {t("auth.login.submit")}
            </Button>

            <div className="flex flex-col items-center gap-1">
                <Button type="button" variant="link" size="sm" onClick={() => go("signup")}>
                    {t("auth.login.noAccount")} {t("auth.login.createAccount")}
                </Button>
                <Button type="button" variant="link" size="sm" onClick={() => go("forgot-password")}>
                    {t("auth.login.forgotPassword")}
                </Button>
            </div>
        </form>
    );
}
```

> Backend errors go to the top `Alert` via local `failure` state (set only on a
> real failure, cleared on every submit), never to fields. The `Alert` is rendered
> only when `failure` is set — nothing shows on a clean form. (kinix places its
> banner alert between the inputs and the submit; we keep it at the top of the form
> per the established dashboard convention.)

## The other forms (same shape)

- **SignupForm** — `signupSchema`; on success `go("verify-otp", { email, purpose: "EmailVerification" })`.
- **VerifyOtpForm** — `verifyOtpSchema` + `OtpInput`; `useVerifyOtp` then `runOnSuccess()`; resend via `useResendOtp` with a 60s cooldown; reads `context.email` / `context.purpose`.
- **ForgotPasswordForm** — `forgotPasswordSchema`; on success `go("reset-password", { email })`.
- **ResetPasswordForm** — `resetPasswordSchema` (`OtpInput` + new/confirm password); on success `go("login")`.

Each follows the `LoginForm` pattern: `useForm(zodResolver(schema))`, a local
`failure` state rendered as `{failure && <Alert error={failure} />}` at the top
(never an always-on alert), a **`<FloatingField>` per text input** (kinix
floating-label look; `OtpInput` for the code field), cross-view links as
`<Button variant="link">` (not raw `<button>`), and a primary **block** submit bound
to the mutation's `isPending`. The `AuthModal` back button returns to the previous
view in any flow (e.g. reset → forgot, signup → login).

---

## Verification

- [ ] login / signup→verify / forgot→reset all complete and update `useAuth()`.
- [ ] Switching forms swaps the body of the **same** dialog — no second modal stacks.
- [ ] The back button returns to the previous view; it is hidden on the first view.
- [ ] Floating labels behave like kinix: resting placeholder when empty, floated
      (10px, bold, `text-primary`) on focus/fill; title is centered; submit is a
      primary block; footer links are text buttons.
- [ ] Renders correctly in light **and** dark using only `apps/frontend` theme tokens.
- [ ] Client errors render below fields; the top `Alert` shows **only** on a real
      backend failure (nothing on a clean form).
- [ ] Cross-view links are `<Button variant="link">`, not raw `<button>`.
- [ ] A guest action opens the modal and **resumes** after success (`runOnSuccess`).
- [ ] `?auth=login` opens the modal on load; closing clears the param.
- [ ] Focus trap, `Esc`, and overlay-close work (Radix); reduced motion respected.
- [ ] tsc + biome clean.
