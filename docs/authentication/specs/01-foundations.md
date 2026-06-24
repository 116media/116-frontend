# Spec 01 — Foundations

Dependencies, app-wide providers, the UI primitives the auth forms need, and the
shared validation layer. Everything here is reusable beyond auth.

Design refs: [../02-architecture.md](../02-architecture.md),
[../05-state-management.md](../05-state-management.md),
[../09-forms-and-validation.md](../09-forms-and-validation.md).

---

## Tasks

- [ ] Install dependencies
- [ ] Set `NEXT_PUBLIC_CLIENT_APP=WebApp`
- [ ] `QueryProvider` + shared `QueryClient`, mounted in `app/layout.tsx`
- [ ] `Dialog` primitive (`@radix-ui/react-dialog`)
- [ ] `Alert` primitive (renders a `Failure`)
- [ ] `Toast` + `Toaster` + `useToast` (`@radix-ui/react-toast`)
- [ ] Form primitives: `FloatingField` (auth text fields — floating label, kinix parity), `Input`/`Textarea` (general, sizes `xs`–`xl`), `OtpInput` (gray `bg-muted`; `rounded-sm` throughout)
- [ ] Shared validation: `validators.ts`
- [ ] Shared validation: `zod.errormap.ts` + register at bootstrap
- [ ] Verify: `yarn lint:types` and `yarn lint:code` clean

---

## Dependencies

```bash
yarn add @tanstack/react-query react-hook-form zod @hookform/resolvers \
  @radix-ui/react-dialog @radix-ui/react-toast
```

`.env` (and `.env.template`):

```bash
# Web client → backend delivers tokens via httpOnly cookies (see ../04-token-and-cookie-model.md)
NEXT_PUBLIC_CLIENT_APP=WebApp
```

---

## QueryProvider

```tsx
// src/shared/presentation/providers/QueryProvider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

/**
 * Creates the app's shared QueryClient with auth-appropriate defaults: a 1-minute
 * stale window, a single retry, and no refetch-on-focus (a 401 is handled by the
 * refresh interceptor, not by query retries).
 *
 * @returns A configured QueryClient instance.
 */
function createQueryClient(): QueryClient {
    return new QueryClient({
        defaultOptions: {
            queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false },
            mutations: { retry: 0 },
        },
    });
}

/**
 * QueryProvider
 *
 * @description
 * Provides the TanStack Query client to the whole app. The client is created once
 * per browser session via `useState` so it survives re-renders but is never shared
 * across requests on the server.
 *
 * @param children - The subtree that gains access to TanStack Query.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
    const [client] = useState(createQueryClient);
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
```

Mount it in `app/layout.tsx` (outside `AuthProvider`, which depends on it — see
[05](05-providers-and-context.md)).

---

## Dialog primitive

```tsx
// src/shared/presentation/components/ui/Dialog/Dialog.tsx
"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";

import { cn } from "@/shared/presentation/utils/cn";

/**
 * Dialog root, trigger, portal and close — re-exported from Radix unchanged.
 */
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

/**
 * DialogContent
 *
 * @description
 * The centered modal surface with a scrim overlay, theme-token styling, a close
 * button, and Radix's focus trap / `Esc` / `aria-*` wiring preserved. Used as the
 * shell for the auth modal.
 *
 * @param className - Extra classes merged onto the content surface.
 * @param children - The modal body.
 */
export const DialogContent = forwardRef<
    ElementRef<typeof DialogPrimitive.Content>,
    ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-background p-6 shadow-xl focus:outline-none",
                className,
            )}
            {...props}
        >
            {children}
            <DialogPrimitive.Close
                aria-label="Close"
                className="absolute right-4 top-4 rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <X className="size-5" />
            </DialogPrimitive.Close>
        </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
));
DialogContent.displayName = "DialogContent";

/**
 * DialogHeader
 *
 * @description
 * Vertical stack for the modal title + description.
 *
 * @param className - Extra classes.
 * @param children - Title/description nodes.
 */
export function DialogHeader({ className, children }: { className?: string; children: React.ReactNode }) {
    return <div className={cn("mb-4 flex flex-col gap-1.5", className)}>{children}</div>;
}

/**
 * DialogTitle — the accessible modal title (wired to `aria-labelledby` by Radix).
 *
 * @param className - Extra classes.
 */
export const DialogTitle = forwardRef<
    ElementRef<typeof DialogPrimitive.Title>,
    ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn("text-lg font-bold text-foreground", className)}
        {...props}
    />
));
DialogTitle.displayName = "DialogTitle";

/**
 * DialogDescription — the accessible modal description (wired to `aria-describedby`).
 *
 * @param className - Extra classes.
 */
export const DialogDescription = forwardRef<
    ElementRef<typeof DialogPrimitive.Description>,
    ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
DialogDescription.displayName = "DialogDescription";
```

---

## Alert primitive (backend errors)

```tsx
// src/shared/presentation/components/ui/Alert/Alert.tsx
import { AlertCircle } from "lucide-react";

import type { Failure } from "@/shared/domain/failures/failure";

/**
 * Props for the Alert component.
 *
 * @interface AlertProps
 * @property {Failure | null | undefined} error - The failure to display, or null to render nothing.
 */
export interface AlertProps {
    error: Failure | null | undefined;
}

/**
 * Alert
 *
 * @description
 * Renders a backend `Failure` (already localized `title` + `detail`) at the top of
 * a form, styled with destructive theme tokens. Renders nothing when there is no
 * error. The frontend equivalent of the dashboard's `ErrorAlert` — backend errors
 * surface here, never on individual fields.
 *
 * @param error - The failure to display, or null/undefined for no alert.
 */
export function Alert({ error }: AlertProps) {
    if (!error) return null;
    return (
        <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3"
        >
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
            <div>
                <p className="text-sm font-semibold text-destructive">{error.title}</p>
                {error.detail && <p className="mt-0.5 text-sm text-destructive/90">{error.detail}</p>}
            </div>
        </div>
    );
}
```

---

## Toast (shadcn/ui, not sonner)

Add the Radix-based shadcn toast: `Toast` primitives, a `useToast` hook (the
standard shadcn reducer store), and a `Toaster` mounted once in `app/layout.tsx`.
Abbreviated below — generate with `npx shadcn@latest add toast` or hand-port the
shadcn `toast` files, then JSDoc the public surface:

```ts
// src/shared/presentation/components/ui/Toast/useToast.ts  (shadcn reducer store)

/**
 * Imperatively shows a toast notification.
 *
 * @param props - Toast content: `title`, optional `description`, and `variant`.
 * @returns A handle with `id`, `dismiss`, and `update`.
 */
export function toast(props: ToastInput): ToastHandle { /* shadcn reducer */ }

/**
 * useToast
 *
 * @description
 * Subscribes a component to the toast store and exposes `toast()` + the active
 * toast list (consumed by `Toaster`).
 *
 * @returns `{ toast, toasts, dismiss }`.
 */
export function useToast(): UseToastReturn { /* shadcn reducer */ }
```

```tsx
// src/shared/presentation/components/ui/Toast/Toaster.tsx
"use client";

/**
 * Toaster
 *
 * @description
 * Renders the active toasts in a Radix `ToastProvider`/`ToastViewport`. Mount once
 * at the app root so any component can call `toast(...)`. Auth uses it for success
 * notices (password updated, signed out, code sent).
 */
export function Toaster() { /* maps useToast().toasts → <Toast> items */ }
```

---

## Form primitives

The **auth** text fields use a **floating label** — matching the kinix design: the
label sits over the field as its placeholder and floats up (small, bold,
`text-primary`) on focus or when filled. This is `FloatingField`, a shadcn/Tailwind
port of kinix's `FloatTextInput` (CSS `peer` + `:placeholder-shown`, no JS state),
built entirely on `apps/frontend` theme tokens — gray `bg-muted` surface,
`border-input` border, `rounded-sm` corners — so light/dark track automatically.
`OtpInput` is the one auth control that is not a floating field.

`Input` and `Textarea` remain the **general-purpose** controls (search, non-auth
forms): same gray/`rounded-sm` base, with a `size` scale (`xs` | `sm` | `md` | `lg`
| `xl`, default `md`) via `class-variance-authority`, exactly like `Button`. They
share one base style.

```tsx
// src/shared/presentation/components/ui/Input/Input.tsx
import { cva, type VariantProps } from "class-variance-authority";
import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "@/shared/presentation/utils/cn";

/**
 * Shared base classes for `Input` and `Textarea`: gray (`bg-muted`) surface,
 * `border-input` border, `rounded-sm` corners, focus ring, disabled + invalid
 * (`aria-invalid`) states — all theme tokens, so light/dark are automatic.
 */
export const fieldBaseClasses =
    "w-full rounded-sm border border-input bg-muted text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive";

/**
 * Input size scale. Drives height, horizontal padding, and text size; `md` is the
 * default used across the auth forms.
 */
export const inputVariants = cva(fieldBaseClasses, {
    variants: {
        size: {
            xs: "h-7 px-2 text-xs",
            sm: "h-8 px-2.5 text-sm",
            md: "h-10 px-3 text-sm",
            lg: "h-11 px-3.5 text-base",
            xl: "h-12 px-4 text-base",
        },
    },
    defaultVariants: { size: "md" },
});

/**
 * Props for the Input component.
 *
 * @interface InputProps
 * @description
 * Native input attributes (minus the legacy numeric `size` attribute, replaced by
 * the `size` style variant) plus the cva size variant.
 */
export interface InputProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
        VariantProps<typeof inputVariants> {}

/**
 * Input
 *
 * @description
 * Theme-token text input on a gray `bg-muted` surface with `rounded-sm` corners, a
 * focus ring, and invalid styling (`aria-invalid`). Sized via the `size` prop
 * (`xs`–`xl`). The base field for all auth forms.
 *
 * @param size - Size preset: `xs` | `sm` | `md` | `lg` | `xl` (default `md`).
 * @param className - Extra classes merged onto the input.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, size, ...props }, ref) => (
        <input ref={ref} className={cn(inputVariants({ size, className }))} {...props} />
    ),
);
Input.displayName = "Input";
```

```tsx
// src/shared/presentation/components/ui/Textarea/Textarea.tsx
import { cva, type VariantProps } from "class-variance-authority";
import type { TextareaHTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "@/shared/presentation/utils/cn";
import { fieldBaseClasses } from "@/shared/presentation/components/ui/Input/Input";

/**
 * Textarea size scale. Reuses the shared field base (gray `bg-muted`,
 * `rounded-sm`), driving `min-height`, padding, and text size per size.
 */
export const textareaVariants = cva(fieldBaseClasses, {
    variants: {
        size: {
            xs: "min-h-16 px-2 py-1.5 text-xs",
            sm: "min-h-20 px-2.5 py-2 text-sm",
            md: "min-h-24 px-3 py-2 text-sm",
            lg: "min-h-28 px-3.5 py-2.5 text-base",
            xl: "min-h-32 px-4 py-3 text-base",
        },
    },
    defaultVariants: { size: "md" },
});

/**
 * Props for the Textarea component.
 *
 * @interface TextareaProps
 * @description Native textarea attributes plus the cva size variant.
 */
export interface TextareaProps
    extends TextareaHTMLAttributes<HTMLTextAreaElement>,
        VariantProps<typeof textareaVariants> {}

/**
 * Textarea
 *
 * @description
 * Multi-line counterpart to `Input` — identical gray `bg-muted` surface,
 * `rounded-sm` corners, focus ring, and invalid styling, sized via `size`
 * (`xs`–`xl`, controlling `min-height`). Vertically resizable.
 *
 * @param size - Size preset: `xs` | `sm` | `md` | `lg` | `xl` (default `md`).
 * @param className - Extra classes merged onto the textarea.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, size, ...props }, ref) => (
        <textarea ref={ref} className={cn(textareaVariants({ size }), "resize-y", className)} {...props} />
    ),
);
Textarea.displayName = "Textarea";
```

### `FloatingField` — the auth text field (kinix parity)

```tsx
// src/shared/presentation/components/ui/FloatingField/FloatingField.tsx
"use client";

import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState, type InputHTMLAttributes } from "react";

import { cn } from "@/shared/presentation/utils/cn";

/**
 * Props for the FloatingField component.
 *
 * @interface FloatingFieldProps
 * @description
 * Native input attributes (minus `placeholder`, which the floating label owns) plus
 * the label, an optional inline error, and a `required` marker.
 */
export interface FloatingFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "placeholder"> {
    label: string;
    error?: string;
    required?: boolean;
}

/**
 * FloatingField
 *
 * @description
 * Floating-label text field — the kinix `FloatTextInput` look, rebuilt with
 * shadcn/Tailwind and `apps/frontend` theme tokens. The label overlaps the field as
 * its placeholder and floats to the top (10px, bold, `text-primary`) on focus or
 * when filled, purely via CSS (`peer` + `:placeholder-shown`, no JS state). Gray
 * `bg-muted` surface, `border-input` border, `rounded-sm` corners, focus ring, and
 * `aria-invalid` styling — all tokens, so light/dark are automatic. A
 * `type="password"` field gets an accessible show/hide toggle. The inline `error`
 * renders below; backend failures still go to the top `Alert`.
 *
 * @param label - The floating label (doubles as the resting placeholder).
 * @param error - The inline (zod) error, shown below the field.
 * @param required - Appends a `*` marker to the label.
 * @param id - Required, so the label/error associate with the control.
 */
export const FloatingField = forwardRef<HTMLInputElement, FloatingFieldProps>(
    ({ label, error, required, id, type = "text", className, ...props }, ref) => {
        const [visible, setVisible] = useState(false);
        const isPassword = type === "password";

        return (
            <div className="flex flex-col gap-1.5">
                <div className="relative">
                    <input
                        ref={ref}
                        id={id}
                        type={isPassword && visible ? "text" : type}
                        placeholder=" "
                        aria-invalid={error ? true : undefined}
                        className={cn(
                            "peer h-12 w-full rounded-sm border border-input bg-muted px-3 pb-1 pt-5 text-sm text-foreground transition-colors placeholder:text-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive",
                            isPassword && "pr-10",
                            className,
                        )}
                        {...props}
                    />
                    <label
                        htmlFor={id}
                        className={cn(
                            // Floated (default + focus): small, bold, primary, near the top.
                            "pointer-events-none absolute left-3 top-1.5 text-[10px] font-bold text-primary transition-all duration-200",
                            // Resting (empty + unfocused): centered, normal weight, muted.
                            "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-muted-foreground",
                            // Re-float on focus (overrides the resting state above).
                            "peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-primary",
                        )}
                    >
                        {label}
                        {required && <span className="ml-0.5 text-destructive">*</span>}
                    </label>
                    {isPassword && (
                        <button
                            type="button"
                            aria-label={visible ? "Hide password" : "Show password"}
                            onClick={() => setVisible((v) => !v)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    )}
                </div>
                {error && (
                    <p id={`${id}-error`} className="text-xs text-destructive">
                        {error}
                    </p>
                )}
            </div>
        );
    },
);
FloatingField.displayName = "FloatingField";
```

`FloatingField` replaces the `FormField` + `Input`/`PasswordInput` pairing for auth
text inputs. The `FormField` (stacked) and `PasswordInput` below remain for
**general** (non-auth) forms.

```tsx
// src/shared/presentation/components/ui/FormField/FormField.tsx
import type { ReactNode } from "react";

import { cn } from "@/shared/presentation/utils/cn";

/**
 * Props for the FormField component.
 *
 * @interface FormFieldProps
 * @property {string} label - The field label text.
 * @property {string} htmlFor - The id of the control the label points to.
 * @property {string} [error] - The field error message, shown below the control.
 * @property {ReactNode} children - The control (e.g. an `Input`).
 */
export interface FormFieldProps {
    label: string;
    htmlFor: string;
    error?: string;
    children: ReactNode;
}

/**
 * FormField
 *
 * @description
 * Stacked label-over-control row (label above, control below) for **general**
 * (non-auth) forms; auth text fields use `FloatingField` instead. Renders its
 * control and, when present, a **below-field** client-validation error (the inline
 * surface; backend errors go to the top `Alert`). Wires `aria-describedby` via the
 * error element id.
 *
 * @param label - The visible label.
 * @param htmlFor - The control id the label/error associate with.
 * @param error - The client (zod) error message, or undefined.
 * @param children - The control element.
 */
export function FormField({ label, htmlFor, error, children }: FormFieldProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
                {label}
            </label>
            {children}
            {error && (
                <p id={`${htmlFor}-error`} className={cn("text-xs text-destructive")}>
                    {error}
                </p>
            )}
        </div>
    );
}
```

```tsx
// src/shared/presentation/components/ui/PasswordInput/PasswordInput.tsx
"use client";

import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState } from "react";

import { Input, type InputProps } from "@/shared/presentation/components/ui/Input/Input";

/**
 * PasswordInput
 *
 * @description
 * Password field with an accessible show/hide toggle that flips the input type.
 * Inherits the `Input` styling and `size` scale (forwarded straight through).
 *
 * @param props - `Input` props (incl. `size`), forwarded to the underlying `Input`.
 */
export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
    (props, ref) => {
        const [visible, setVisible] = useState(false);
        return (
            <div className="relative">
                <Input ref={ref} type={visible ? "text" : "password"} className="pr-10" {...props} />
                <button
                    type="button"
                    aria-label={visible ? "Hide password" : "Show password"}
                    onClick={() => setVisible((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                    {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
            </div>
        );
    },
);
PasswordInput.displayName = "PasswordInput";
```

```tsx
// src/shared/presentation/components/ui/OtpInput/OtpInput.tsx
"use client";

import { useMemo, useRef } from "react";

/**
 * Props for the OtpInput component.
 *
 * @interface OtpInputProps
 * @property {string} value - The current 6-character code value.
 * @property {(value: string) => void} onChange - Called with the updated value.
 * @property {number} [length] - Number of digits (default 6).
 */
export interface OtpInputProps {
    value: string;
    onChange: (value: string) => void;
    length?: number;
}

/**
 * OtpInput
 *
 * @description
 * Segmented numeric one-time-code input: `length` single-digit boxes with
 * auto-advance, backspace navigation, and paste-to-fill. Numeric `inputmode`.
 * Mirrors the mobile OTP UX. The one control **not** wrapped in a stacked
 * `FormField` label, though the boxes still use the shared gray `bg-muted` +
 * `rounded-sm` field styling.
 *
 * @param value - The current code.
 * @param onChange - Emits the joined code on every edit.
 * @param length - Digit count (default 6).
 */
export function OtpInput({ value, onChange, length = 6 }: OtpInputProps) {
    const refs = useRef<Array<HTMLInputElement | null>>([]);
    const chars = value.padEnd(length).split("").slice(0, length);

    // Stable per-slot identities, generated once (the boxes never reorder), so each
    // list key is a real id rather than the array index — no `noArrayIndexKey`.
    const slotKeys = useMemo(() => Array.from({ length }, () => crypto.randomUUID()), [length]);

    /**
     * Writes a digit at `index`, advancing focus to the next box.
     *
     * @param index - The box being edited.
     * @param char - The single digit entered (or empty).
     */
    const setChar = (index: number, char: string) => {
        const next = chars.slice();
        next[index] = char.replace(/\D/g, "").slice(-1) ?? "";
        onChange(next.join("").trim());
        if (char && index < length - 1) refs.current[index + 1]?.focus();
    };

    return (
        <div className="flex gap-2">
            {slotKeys.map((key, index) => (
                <input
                    key={key}
                    ref={(el) => {
                        refs.current[index] = el;
                    }}
                    inputMode="numeric"
                    maxLength={1}
                    value={chars[index]?.trim() ?? ""}
                    onChange={(e) => setChar(index, e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Backspace" && !chars[index]?.trim() && index > 0) {
                            refs.current[index - 1]?.focus();
                        }
                    }}
                    onPaste={(e) => {
                        e.preventDefault();
                        onChange(e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length));
                    }}
                    className="size-11 rounded-sm border border-input bg-muted text-center text-lg font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
            ))}
        </div>
    );
}
```

(`Label` may be a thin wrapper or inlined in `FormField` as above.)

---

## Shared validation — `validators.ts`

```ts
// src/shared/presentation/validation/validators.ts
import { z } from "zod";

/**
 * Encodes a validation message descriptor — the `validator.*` message key, the
 * field's i18n **label key**, and any extra params (e.g. `min`) — into the single
 * string zod allows as a message. The error map (`zod.errormap.ts`) decodes and
 * localizes it at validation time, so each message names its field ("Email is
 * required", just like the dashboard's `${name} obligatoire`) and stays dynamic
 * across language switches.
 *
 * @param key - The `validator.*` message key.
 * @param field - The i18n key of the field's label (interpolated as `{{field}}`).
 * @param params - Extra interpolation params (e.g. `{ min }`).
 * @returns The encoded message string.
 */
const fieldMsg = (key: string, field: string, params?: Record<string, number>): string =>
    JSON.stringify({ key, field, params });

/**
 * Shared, reusable zod field builders — the frontend analogue of the dashboard's
 * `ValidatorUtils`. Each builder takes the field's i18n **label key** (e.g.
 * `"auth.login.credentialsLabel"`) so its message can name the field, exactly like
 * the dashboard passes `"Adresse e-mail"` to `LoginValidator.email(...)`. Messages
 * are resolved + localized by the zod error map.
 */
export const Validators = {
    /**
     * A required, non-empty string.
     *
     * @param field - The field's i18n label key, named in the message.
     * @returns A zod string schema requiring at least one character.
     */
    required: (field: string) => z.string().min(1, fieldMsg("validator.required", field)),

    /**
     * A required, valid email address.
     *
     * @param field - The field's i18n label key, named in the message.
     * @returns A zod string schema requiring a non-empty, well-formed email.
     */
    email: (field: string) =>
        z
            .string()
            .min(1, fieldMsg("validator.required", field))
            .email(fieldMsg("validator.email", field)),

    /**
     * A string within an inclusive length range.
     *
     * @param field - The field's i18n label key, named in the message.
     * @param min - Minimum length.
     * @param max - Maximum length.
     * @returns A zod string schema bounded by `min`/`max`.
     */
    minMax: (field: string, min: number, max: number) =>
        z
            .string()
            .min(min, fieldMsg("validator.minLength", field, { min }))
            .max(max, fieldMsg("validator.maxLength", field, { max })),

    /**
     * A strong password: ≥6 chars with at least one lowercase, uppercase, and digit
     * (mobile parity). All failures surface the single `validator.passwordStrength`
     * key so the policy is described once.
     *
     * @param field - The field's i18n label key, named in the message.
     * @returns A zod string schema enforcing the password policy.
     */
    password: (field: string) =>
        z
            .string()
            .min(6, fieldMsg("validator.passwordStrength", field, { min: 6 }))
            .regex(/[a-z]/, fieldMsg("validator.passwordStrength", field, { min: 6 }))
            .regex(/[A-Z]/, fieldMsg("validator.passwordStrength", field, { min: 6 }))
            .regex(/\d/, fieldMsg("validator.passwordStrength", field, { min: 6 })),

    /**
     * A 6-digit numeric one-time code.
     *
     * @param field - The field's i18n label key, named in the message.
     * @returns A zod string schema requiring exactly six digits.
     */
    otp: (field: string) => z.string().regex(/^\d{6}$/, fieldMsg("validator.otp", field)),
} as const;

/**
 * Adds a cross-field equality refinement (e.g. confirm-password must equal
 * password), attaching the field-aware `validator.mustMatch` message to `field`.
 *
 * @param schema - The object schema to refine.
 * @param field - The field that must match (where the error is attached).
 * @param other - The field it must equal.
 * @param label - The i18n label key of `field`, named in the message.
 * @returns The refined schema.
 */
export function matches<T extends z.ZodRawShape>(
    schema: z.ZodObject<T>,
    field: keyof T & string,
    other: keyof T & string,
    label: string,
) {
    return schema.refine((value) => value[field] === value[other], {
        path: [field],
        message: fieldMsg("validator.mustMatch", label),
    });
}
```

## Shared validation — `zod.errormap.ts`

```ts
// src/shared/presentation/validation/zod.errormap.ts
import { z } from "zod";

import { i18n } from "@/shared/presentation/i18n/config";

/**
 * Resolves an i18n key (with optional params) against the active language.
 *
 * @param key - A translation key in the `validator`/`auth` namespace.
 * @param params - Optional interpolation params.
 * @returns The localized string.
 */
const t = (key: string, params?: Record<string, unknown>): string => i18n.t(key, params) as string;

/**
 * A field-aware message descriptor produced by `Validators` (`fieldMsg`): the
 * message key, the field's i18n label key, and any extra params.
 *
 * @interface MessageDescriptor
 */
interface MessageDescriptor {
    key: string;
    field: string;
    params?: Record<string, number>;
}

/**
 * Decodes a `fieldMsg` descriptor from a zod issue message. Returns null for any
 * message that is not one of ours (raw zod defaults), so they fall through.
 *
 * @param message - The zod issue message, if any.
 * @returns The decoded descriptor, or null.
 */
const decode = (message?: string): MessageDescriptor | null => {
    if (!message || message[0] !== "{") return null;
    try {
        const parsed = JSON.parse(message) as MessageDescriptor;
        return parsed.key ? parsed : null;
    } catch {
        return null;
    }
};

/**
 * zodI18nErrorMap
 *
 * @description
 * A single zod error map that localizes every validation issue through
 * react-i18next. Messages authored by `Validators` carry a descriptor (key + field
 * label key + params); we localize the field label and interpolate it as
 * `{{field}}`, so errors name the field ("Email is required") and re-localize on
 * language switch. Anything else falls back to zod's default. Registered once at
 * bootstrap via `z.setErrorMap`.
 *
 * @param issue - The zod issue being formatted.
 * @param ctx - The zod error-map context (carries the default message).
 * @returns The localized `{ message }`.
 */
export const zodI18nErrorMap: z.ZodErrorMap = (issue, ctx) => {
    const descriptor = decode(issue.message);
    if (descriptor) {
        return { message: t(descriptor.key, { field: t(descriptor.field), ...descriptor.params }) };
    }
    return { message: ctx.defaultError };
};
```

Register once at app bootstrap (e.g. in `I18nProvider` or a small `zod.setup.ts`
imported by the root layout):

```ts
import { z } from "zod";
import { zodI18nErrorMap } from "@/shared/presentation/validation/zod.errormap";

// Register the i18n-aware zod error map process-wide; call once at bootstrap.
z.setErrorMap(zodI18nErrorMap);
```

The `validator` namespace keys are populated in [09-i18n.md](09-i18n.md).

---

## Verification

- [ ] `yarn lint:types` passes.
- [ ] `yarn lint:code` passes on the new files.
- [ ] The app boots with `QueryProvider` + `Toaster` mounted and no console errors.
- [ ] A throwaway form using `Validators` shows a localized message in both fr/en.
- [ ] `Input`/`Textarea`/`PasswordInput` honor `size` (`xs`–`xl`) and render a gray
      `bg-muted` surface with `rounded-sm` corners in **both** light and dark mode.
- [ ] `FloatingField`: the label rests as the placeholder when empty, and floats up
      (10px, bold, `text-primary`) on focus or when filled — matching kinix, in both
      light and dark. Every auth text field except `OtpInput` uses it.
