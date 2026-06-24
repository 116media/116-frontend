# Modal Forms — UX & Architecture

**All authentication forms are modal dialogs**, layered over the current page.
The visitor is never routed to a `/login` or `/signup` page. This keeps them in
context (e.g. they click "Like" on a video, the login modal appears, they log
in, the modal closes, the like proceeds).

This is the main intentional divergence from the dashboard (which uses a
full-page `LoginPage`) and matches a public content site's expectation.

---

## One modal, many views (a small state machine)

A single `AuthModal` renders one of several **views**. `AuthModalProvider`
controls which view is open and carries the small bit of state shared between
views (the email + OTP purpose during a recovery/verification flow).

```ts
type AuthView =
  | "login"
  | "signup"
  | "verify-otp"
  | "forgot-password"
  | "reset-password";

interface AuthModalState {
  isOpen: boolean;
  view: AuthView;
  context: { email?: string; purpose?: OtpPurpose };  // carried across views
}

interface AuthModalApi {
  open: (view?: AuthView) => void;
  close: () => void;
  go: (view: AuthView, patch?: Partial<AuthModalState["context"]>) => void;
}
```

`useAuthModal()` exposes `open`, `close`, `go`. Any component can call
`open("login")`.

### View transitions

```text
login ─┬─ "Create account" ───────────────→ signup
       ├─ "Forgot password?" ─────────────→ forgot-password
       └─ (403 not verified) ─────────────→ verify-otp (with email)

signup ── success (verificationRequired) ─→ verify-otp (with email, purpose=EmailVerification)

forgot-password ── success ───────────────→ reset-password (with email)
reset-password  ── success ───────────────→ login

verify-otp ── success ────────────────────→ close (authenticated)
```

Each view has a footer link to switch (e.g. "Already have an account? Log in").

---

## The Dialog primitive

There is no Dialog component yet. Add one under
`src/shared/presentation/components/ui/Dialog/` built on
`@radix-ui/react-dialog` (shadcn-style, theme-token based — no hardcoded
colors), exporting `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`,
`DialogDescription`, `DialogFooter`, `DialogClose`.

Accessibility (handled by Radix, must be preserved):

- Focus is trapped inside the modal and restored to the trigger on close.
- `Esc` and overlay click close it (except while a mutation is pending).
- `DialogTitle` / `DialogDescription` are wired to `aria-labelledby` /
  `aria-describedby`.
- The overlay scrim and `prefers-reduced-motion` are respected.

---

## How the modal is opened

- **Header buttons** — "Log in" / "Sign up" call `open("login" | "signup")`.
- **Gated actions** — like / comment / bookmark / rate / playlist actions check
  `useAuth().isAuthenticated`; if guest, they call `open("login")` and resume
  the action after success (see [13-authorization-and-guards.md](13-authorization-and-guards.md)).
- **Deep link** — a `?auth=login` (or `signup`) query param opens the modal on
  load, so links/emails can point straight at it. The param is cleared on close.
- **Session expired** — the `auth:session-expired` event opens `login` with a
  notice.

---

## Resume-after-login

When a guest triggers a gated action, the modal stores an optional `onSuccess`
callback (the pending action). After a successful login/verify, the modal runs
it and closes — the user's original intent completes without a second click.

```ts
open("login", { onSuccess: () => likeVideo(id) });
```

---

## Per-view content

| View | Component | Fields | Primary action |
|---|---|---|---|
| login | `LoginForm` | credentials, password | `useLogin` |
| signup | `SignupForm` | email, userName, password | `useSignup` |
| verify-otp | `VerifyOtpForm` | 6-digit code (+ resend w/ 60s cooldown) | `useVerifyOtp` / `useResendOtp` |
| forgot-password | `ForgotPasswordForm` | email | `useForgotPassword` |
| reset-password | `ResetPasswordForm` | code, newPassword, confirm | `useResetPassword` |

Fields, schemas, and validation are in
[09-forms-and-validation.md](09-forms-and-validation.md).

---

## Loading, error & success states

- The submit button binds to the mutation's `isPending` (spinner + disabled).
- Field errors come from `react-hook-form` + `zod`; server validation errors
  (400) map onto fields via the normalized problem details.
- Top-of-form error banner for non-field errors (invalid credentials, rate
  limit with countdown).
- Success closes the modal (or advances the view) and shows a toast.

---

## Why modal, not pages — summary

| Reason | Effect |
|---|---|
| Keep context | A guest action interrupts minimally and resumes after auth |
| No route churn | The underlying page (and its scroll/state) is preserved |
| Faster perceived flow | View switches are instant; no navigation/render of a new route |
| Single mount point | One `AuthProvider`/`AuthModalProvider` powers the whole app |

The trade-off (deep-linkable auth pages, SEO of `/login`) is irrelevant for a
public content site where auth is an overlay on content, not a destination.
