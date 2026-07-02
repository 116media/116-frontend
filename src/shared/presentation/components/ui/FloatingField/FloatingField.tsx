"use client";

import { forwardRef, type InputHTMLAttributes, useState } from "react";
import { EyeIcon, EyeOffIcon } from "@/shared/presentation/components/ui/Icon";

import { Input } from "@/shared/presentation/components/ui/Input";
import { cn } from "@/shared/presentation/utils/cn";
import { Button } from "../Button";

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
 * Floating-label text field — the kinix `FloatTextInput` look. Renders the shared
 * `Input` primitive (bg-muted surface, border, focus ring, `aria-invalid`, all theme
 * tokens) and layers on the floating label: it overlaps the field as its placeholder
 * and floats to the top (10px, bold, primary — secondary in dark mode) on focus or
 * when filled, purely via CSS (`peer` + `:placeholder-shown`, no JS state), with extra
 * top padding to make room. A `type="password"` field gets an accessible show/hide
 * toggle. The inline `error` renders below; backend failures still go to the top `Alert`.
 *
 * @param label - The floating label (doubles as the resting placeholder).
 * @param error - The inline (zod) error, shown below the field.
 * @param required - Appends a `*` marker to the label.
 * @param id - Required, so the label/error associate with the control.
 */
export const FloatingField = forwardRef<HTMLInputElement, FloatingFieldProps>(
    ({ label, error, required, id, type = "text", className, ...props }, ref) => {
        const isPassword = type === "password";
        const [visible, setVisible] = useState(false);

        return (
            <div className="flex flex-col gap-1.5">
                <div className="relative">
                    <Input
                        id={id}
                        ref={ref}
                        placeholder=" "
                        aria-invalid={error ? true : undefined}
                        type={isPassword && visible ? "text" : type}
                        className={cn(
                            "peer h-12 bg-muted pb-1 pt-5 text-sm placeholder:text-transparent",
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
                        <Button
                            size="icon"
                            type="button"
                            variant="ghost"
                            onClick={() => setVisible((v) => !v)}
                            aria-label={visible ? "Hide password" : "Show password"}
                            className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground rounded-full"
                        >
                            {visible ? (
                                <EyeOffIcon className="size-4" />
                            ) : (
                                <EyeIcon className="size-4" />
                            )}
                        </Button>
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
