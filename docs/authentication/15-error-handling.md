# Error Handling

The auth module **reuses the frontend's existing exception→failure pipeline
verbatim** — it adds no new error system. Every backend error becomes a
`Result.err(Failure)` through the same path `videos`/`articles` already use. This
doc maps each auth error to a concrete UX.

---

## The error pipeline (already built, reused as-is)

```text
backend typed exception → RFC7807 ProblemDetails { title: <ExceptionName>, detail, status, errors[]? }
  → axios error interceptor (src/shared/infrastructure/api/client.ts → errorHandler):
        • localizes title via apiErrors + i18n.t (active language)
        • ValidationException → detail = first message, KEEPS errors[]
        • 429 → parses Retry-After → retryAfter
        • network/no-response → { title, detail, status: 0 }
        • rejects with normalized IApiProblemDetails
  → repository catch: return err(ProblemMapper.toFailure(error))
        • IApiProblemDetails-shaped → ServerFailure
        • otherwise            → UnknownFailure
  → Result.err(failure)  →  use case  →  mutation/query  →  component reads res.error
```

Key types (existing):

- `IApiProblemDetails` (`api/type.ts`) — `ProblemDetails` + `errors[]` +
  `retryAfter`.
- `IValidationError` — `{ propertyName, errorMessage, errorCode, attemptedValue,
  severity }`.
- `ServerFailure` (`domain/failures/failure.ts`) — `{ title, detail, status,
  errors?, retryAfter, traceId, … }`.

So by the time a component sees `res.error`, it is a **`ServerFailure`** that is
already localized (`title`/`detail`) and already carries per-field validation
(`errors[]`) and `retryAfter`. The auth repositories do the identical
`try { ok(map(res.data)) } catch (e) { err(ProblemMapper.toFailure(e)) }`.

> There is no `apply-server-error` mechanism and backend errors are **not**
> mapped onto fields. A form hands its `ServerFailure` to a shared `Alert` at the
> top; client (zod) validation shows below each field. See
> [09-forms-and-validation.md](09-forms-and-validation.md#two-distinct-error-surfaces-matches-the-dashboard).

---

## Per-exception handling

| `title` | Status | Where | UX |
|---|---|---|---|
| `ValidationException` | 400 | form | message in the **top alert** (interceptor folds first `errors[]` message into `detail`) |
| `AuthenticationException` | 401 | login form | top alert "invalid credentials"; clear password |
| `AccountNotVerifiedException` | 403 | login / gated action | switch modal to **verify-otp** (resend code) |
| `AccountInactiveException` | 403 / 423 | login / anywhere | blocking top alert; clear `me`; cannot proceed |
| `AccessTokenExpiryException` | 401 | interceptor | silent refresh + retry (no UI) |
| `RefreshTokenExpiryException` | 401 / 403 | interceptor | `auth:session-expired` → guest (+ optional login modal w/ notice) |
| `ConflictException` (email taken) | 409 | signup form | top alert "email already in use" |
| `OtpExpirationException` | 401 | otp form | top alert "code expired"; offer resend |
| `OtpAttemptsLimitException` | 429 | otp form | top alert; disable submit; show resend cooldown |
| `RateLimitExceededException` | 429 | any form | top alert "try again in {retryAfter}s"; disable submit until then |
| unknown / network | — | any | generic `auth.errors.network` top alert; allow retry |

---

## Patterns

### Two error surfaces (client below field, backend in top alert)

This mirrors the dashboard's auth forms — see
[09-forms-and-validation.md](09-forms-and-validation.md#two-distinct-error-surfaces-matches-the-dashboard):

- **Client (zod) validation** → rendered **below the field** by `FormField`.
- **Backend `ServerFailure`** → rendered in a shared **`Alert` at the top** of
  the form (`error.title` + `error.detail`). Backend errors are **not** mapped
  onto fields; the interceptor already folds a 400's first `errors[]` message
  into `detail`, which the alert shows.

### Rate-limit countdown

`retryAfter` (seconds, from `Retry-After`) disables the submit button and shows
a live countdown; re-enables at zero.

### Never leak existence

`forgot-password` always returns success — the UI always says "if that email
exists, we sent a code", regardless. Don't branch on whether the email exists.

### Security on login errors

Login shows a single generic "invalid credentials" for both wrong-user and
wrong-password (the backend already does this). Don't reveal which was wrong.

---

## Toaster

Successes (password updated, signed out, code sent) use the **shadcn/ui toast**
(`@radix-ui/react-toast` + a `Toaster` provider and `useToast`) — **not** sonner.
Failures prefer **inline** (the top alert, or below-field for client validation)
over toast so the user sees them in context of the form. Session-expiry is the
exception — it can toast + open the login modal because it can happen outside any
form.

---

## Logging

Use cases/repositories don't `console.error`; failures flow as `Result`. If
diagnostics are needed, log at the interceptor (one place), excluding
credentials/OTP from any log payload.
