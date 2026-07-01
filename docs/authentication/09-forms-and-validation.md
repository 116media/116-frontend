# Forms & Validation (shareable + i18n)

Forms use **`react-hook-form`** for state and **`zod`** for schemas (via
`@hookform/resolvers/zod`). Validation is **shared across the whole app** and
**fully internationalized** (en/fr) — not duplicated per form and not
hardcoded to one language.

The sharing structure is inspired by the **dashboard** (`apps/dashboard`),
which centralizes reusable rule-factories in a shared `ValidatorUtils` and
composes them per form (e.g. `LoginValidator.password(name)` →
`[ValidatorUtils.required(name), …]`). We keep that *structure* but adapt it to
the frontend stack and fix its one limitation: the dashboard's messages are
hardcoded French; ours are **i18n keys** resolved through react-i18next.

> New deps: `react-hook-form`, `zod`, `@hookform/resolvers`.

---

## Three pieces

1. **Shared zod builders** — reusable field schemas (the analogue of the
   dashboard's `ValidatorUtils`), in `src/shared/presentation/validation/`.
   Used by **every** module's forms, not just auth.
2. **A zod i18n error map** — translates every validation issue into a
   localized message via the shared `validator` i18n namespace.
3. **Per-form schemas** — compose the shared builders (the analogue of the
   dashboard's `LoginValidator`), in `src/modules/auth/presentation/validation/`.

```text
src/shared/presentation/validation/
├── validators.ts        # shared zod field builders  (≈ dashboard ValidatorUtils)
└── zod.errormap.ts      # zod error map → react-i18next (the i18n bridge)

src/modules/auth/presentation/validation/
├── login.schema.ts          # one schema per file (≈ dashboard's per-form validators)
├── signup.schema.ts
├── verifyotp.schema.ts
├── forgotpassword.schema.ts
├── resetpassword.schema.ts
└── changepassword.schema.ts
```

> Server-side validation is **not** a separate concern here. Backend errors
> already arrive as a `ServerFailure` (with field errors) through the existing
> `ProblemMapper` pipeline — see the section below and
> [15-error-handling.md](15-error-handling.md). There is no `apply-server-error`
> error system; forms just read the failure they already get.

The shared `validator` i18n namespace already exists
(`src/shared/presentation/i18n/locales/{fr,en}/validator.ts`, currently empty) —
this is where the message keys live, so they are reused app-wide.

---

## 1. Shared zod builders (`validators.ts`)

Reusable, parameterized field schemas. Messages are **i18n keys** (strings the
error map will translate), never literal text. This is the shareable layer.

```ts
import { z } from "zod";

/**
 * Shared, reusable zod field builders. Mirror the dashboard's ValidatorUtils,
 * but every message is an i18n key resolved by the zod error map (zod.errormap.ts),
 * so the same builder localizes in both en and fr.
 */
export const Validators = {
  required: () => z.string().min(1),                         // → validator.required
  email: () => z.string().min(1).email(),                    // → validator.required / validator.email
  minMax: (min: number, max: number) => z.string().min(min).max(max),
  // strength rule shared by signup / reset / change-password
  password: () =>
    z.string()
      .min(6, "validator.passwordStrength")
      .regex(/[a-z]/, "validator.passwordStrength")
      .regex(/[A-Z]/, "validator.passwordStrength")
      .regex(/\d/, "validator.passwordStrength"),
  otp: () => z.string().regex(/^\d{6}$/, "validator.otp"),
} as const;

/** Cross-field "must match" helper (e.g. confirm password). */
export const matches = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>, field: keyof T & string, other: keyof T & string,
) => schema.refine((v) => v[field] === v[other], { path: [field], message: "validator.mustMatch" });
```

- Standard issues (`too_small`, `too_big`, `invalid_string` email, required)
  carry **no** literal message — the error map derives them with params
  (`{ min }`, `{ max }`).
- Custom rules (password strength, otp, match) set an explicit **key**
  (`"validator.passwordStrength"`, …) that the error map passes through `t()`.

---

## 2. The i18n bridge (`zod.errormap.ts`)

A single zod **error map** wired to the react-i18next instance translates every
issue. Registered **once** globally, so *all* zod validation in the app — auth
and every other module — is i18n by default.

```ts
import { z } from "zod";
import i18n from "@/shared/presentation/i18n/config";   // the configured singleton

const t = (key: string, params?: Record<string, unknown>) => i18n.t(key, params) as string;
const isKey = (m?: string) => !!m && (m.startsWith("validator.") || m.startsWith("auth."));

export const zodI18nErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (isKey(issue.message)) return { message: t(issue.message!) };      // custom keys
  switch (issue.code) {
    case z.ZodIssueCode.too_small:
      return { message: t("validator.minLength", { min: issue.minimum }) };
    case z.ZodIssueCode.too_big:
      return { message: t("validator.maxLength", { max: issue.maximum }) };
    case z.ZodIssueCode.invalid_string:
      return { message: t(issue.validation === "email" ? "validator.email" : "validator.invalid") };
    case z.ZodIssueCode.invalid_type:
      return { message: t("validator.required") };
    default:
      return { message: ctx.defaultError };
  }
};

// app bootstrap (once): z.setErrorMap(zodI18nErrorMap);
```

Why an error map (not `t()` inside schemas):

- **Schemas stay pure** — defined once at module load, no `t` parameter, freely
  shareable and tree-shakeable.
- **Reactive to language** — `i18n.t` reads the *current* language at validation
  time. RHF re-validates on change/submit, so switching fr↔en re-localizes
  messages with no schema rebuild.
- **One place** owns the mapping issue→message, like the dashboard centralizes
  rules in `ValidatorUtils`.

Message keys to populate in the shared `validator` namespace (en + fr,
key-aligned):

```ts
validator = {
  required: "…",            // "This field is required" / "Champ obligatoire"
  email: "…",               // "Invalid email format"
  invalid: "…",
  minLength: "…",           // "Must be at least {{min}} characters"
  maxLength: "…",           // "Must be at most {{max}} characters"
  passwordStrength: "…",    // "≥6 chars with an upper, lower and a number"
  otp: "…",                 // "Enter the 6-digit code"
  mustMatch: "…",           // "Does not match"
};
```

---

## 3. Per-form schemas — one schema per file

Each form gets its **own schema file** (mirrors the dashboard's one-validator-
per-file convention: `login.validator.ts`, `resetpassword.validator.ts`, …).
Each file owns a single schema and exports its inferred type, composing the
shared `Validators`. No literal messages — everything inherits i18n.

```text
src/modules/auth/presentation/validation/
├── login.schema.ts
├── signup.schema.ts
├── verifyotp.schema.ts
├── forgotpassword.schema.ts
├── resetpassword.schema.ts
└── changepassword.schema.ts
```

```ts
// login.schema.ts
import { z } from "zod";
import { Validators } from "@/shared/presentation/validation/validators";

export const loginSchema = z.object({
  credentials: Validators.minMax(3, 20),
  password: Validators.required(),        // presence only on login (don't leak rules)
});
export type LoginInput = z.infer<typeof loginSchema>;
```

```ts
// signup.schema.ts
import { z } from "zod";
import { Validators } from "@/shared/presentation/validation/validators";

export const signupSchema = z.object({
  email: Validators.email(),
  userName: Validators.minMax(3, 20),
  password: Validators.password(),
});
export type SignupInput = z.infer<typeof signupSchema>;
```

```ts
// verifyotp.schema.ts
import { z } from "zod";
import { Validators } from "@/shared/presentation/validation/validators";

export const verifyOtpSchema = z.object({ code: Validators.otp() });
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
```

```ts
// forgotpassword.schema.ts
import { z } from "zod";
import { Validators } from "@/shared/presentation/validation/validators";

export const forgotPasswordSchema = z.object({ email: Validators.email() });
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
```

```ts
// resetpassword.schema.ts
import { z } from "zod";
import { Validators, matches } from "@/shared/presentation/validation/validators";

export const resetPasswordSchema = matches(
  z.object({ code: Validators.otp(), newPassword: Validators.password(), confirmPassword: z.string() }),
  "confirmPassword", "newPassword",
);
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
```

```ts
// changepassword.schema.ts
import { z } from "zod";
import { Validators, matches } from "@/shared/presentation/validation/validators";

export const changePasswordSchema = matches(
  z.object({ oldPassword: Validators.required(), newPassword: Validators.password(), confirmPassword: z.string() }),
  "confirmPassword", "newPassword",
);
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
```

Rules (mobile parity): credentials 3–20, email format, userName 3–20, password
≥6 with upper/lower/digit, OTP 6 numeric digits, confirm must match. Login
password is presence-only so login never reveals the strength policy.

> One schema per file keeps each form's contract self-contained and colocated
> with nothing else — no growing shared schemas barrel to merge against. The
> form imports only its own schema (`import { loginSchema } from
> "../validation/login.schema"`).

---

## Wiring a form

```tsx
import { loginSchema, type LoginInput } from "../validation/login.schema";

const form = useForm<LoginInput>({
  resolver: zodResolver(loginSchema),       // uses the global i18n error map
  defaultValues: { credentials: "", password: "" },
});

const login = useLogin();

const onSubmit = form.handleSubmit((values) => login.mutate(values));

return (
  <form onSubmit={onSubmit}>
    <Alert error={login.error} />            {/* backend error → top of form */}
    <FormField name="credentials" /> {/* client error → below this input */}
    <FormField name="password" />    {/* client error → below this input */}
    <Button disabled={login.isPending}>…</Button>
  </form>
);
```

- `login.isPending` drives the button.
- Client (zod) field messages are localized by the error map and rendered
  **below** their field by `FormField`.
- The backend `Failure` is rendered in the **`Alert`** at the **top**.

---

## Two distinct error surfaces (matches the dashboard)

These are kept deliberately separate, exactly like the dashboard's auth forms:

| Source | Surface | Mechanism |
|---|---|---|
| **Client validation** (zod) | **below the field** | react-hook-form field error rendered by `FormField` |
| **Backend error** (`ServerFailure`) | **alert at the top of the form** | a shared `Alert` component, fed the failure |

Backend errors are **never** mapped onto individual fields — there is no
`setServerErrors`/`apply-server-error` field-mapping. A failed mutation just
hands its `Failure` to the alert, which shows the (already localized) `title` +
`detail`.

### The shared `Alert` component (frontend equivalent of the dashboard's `ErrorAlert`)

The dashboard renders `<ErrorAlert error={failure} showIcon closable />` above
the submit button; it takes a `Failure` and shows `error.title` /
`error.detail`, rendering nothing when there is no error. We add the same
primitive for the frontend stack:

```tsx
// src/shared/presentation/components/ui/Alert/Alert.tsx
export function Alert({ error }: { error: Failure | null | undefined }) {
  if (!error) return null;                       // nothing when there's no error
  return (
    <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3">
      <p className="text-sm font-semibold text-destructive">{error.title}</p>
      {error.detail && <p className="mt-1 text-sm text-destructive/90">{error.detail}</p>}
    </div>
  );
}
```

- Takes the `Failure` straight from the mutation (`login.error` /
  `res.error`) — no transform.
- Theme-token styling (no hardcoded colors); `role="alert"` for a11y.
- Reused by every module's forms — one alert component, like the dashboard's
  single `ErrorAlert`.

> The backend's per-field `errors[]` is **not** spread onto fields; the
> interceptor already folds the first message into `detail`, which the alert
> shows. This keeps backend errors in one obvious place at the top, and leaves
> the inline-below-field space for the user's own (client) validation.

---

## OTP input & accessibility

- `OtpInput`: 6 numeric boxes, auto-advance, paste-to-fill, backspace nav,
  `inputmode="numeric"`. Resend disabled for **60s** (mobile parity).
- Every field has `<Label htmlFor>`; errors use `aria-invalid` +
  `aria-describedby`. `PasswordInput` has an accessible show/hide toggle.

---

## What we took from the dashboard vs. what we changed

| Aspect | Dashboard | Frontend (this design) |
|---|---|---|
| Reusable rule layer | `ValidatorUtils` (antd `Rule` factories) | `Validators` (zod field builders) |
| Per-form composition | `LoginValidator` etc. | one `*.schema.ts` per form |
| Sharing scope | shared `utils/validators/` | shared `presentation/validation/` |
| Messages | **hardcoded French** | **i18n keys** in shared `validator` namespace (en/fr) |
| Form library | antd Form | react-hook-form + zod |
| Localization | none (FR only) | global zod error map → react-i18next |

Same idea — *centralize the rules, compose per form* — upgraded so the rules and
their messages are reusable **and** bilingual.
