"use client";

import { Eye, EyeOff } from "lucide-react";
import { forwardRef, type InputHTMLAttributes, useState } from "react";

import { cn } from "@/shared/presentation/utils/cn";

/**
 * Props for the FloatingField component.
 *
 * @interface FloatingFieldProps
 * @description
 * Native input attributes (minus `placeholder`, which the floating label owns) plus
 * the label, an optional inline error, and a `required` marker.
 */
export interface FloatingFieldProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "placeholder"> {
    label: string;
    error?: string;
    required?: boolean;
}

/**
 * FloatingField
 *
 * @description
 * Floating-label text field — the kinix `FloatTextInput` look, rebuilt with
 * shadcn/Tailwind and the app theme tokens. The label overlaps the field as its
 * placeholder and floats to the top (10px, bold, primary — secondary in dark mode)
 * on focus or when
 * filled, purely via CSS (`peer` + `:placeholder-shown`, no JS state). Gray
 * `bg-muted` surface, `border-input` border, `rounded-md` corners, focus ring, and
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
                            "peer h-12 w-full rounded-md border border-input bg-muted px-3 pb-1 pt-5 text-sm text-foreground transition-colors placeholder:text-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive",
                            isPassword && "pr-10",
                            className
                        )}
                        {...props}
                    />
                    <label
                        htmlFor={id}
                        className={cn(
                            "pointer-events-none absolute left-3 top-1.5 text-[10px] font-bold text-primary dark:text-secondary transition-all duration-200",
                            "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-muted-foreground",
                            "peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-primary dark:peer-focus:text-secondary"
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
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    )}
                </div>
                {error && (
                    <p
                        id={`${id}-error`}
                        className="text-xs text-destructive"
                    >
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
FloatingField.displayName = "FloatingField";
