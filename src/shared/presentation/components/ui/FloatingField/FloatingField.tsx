"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode, useState } from "react";

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
 * the label, an optional inline error, a `required` marker, and an optional static
 * `prefix` (e.g. a phone dial code) rendered inside the field.
 */
export interface FloatingFieldProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "placeholder" | "prefix"> {
    label: string;
    error?: string;
    required?: boolean;
    prefix?: ReactNode;
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
 * toggle. When a `prefix` is supplied the field keeps the same chrome but the label
 * stays floated and the prefix sits before the input (used for the phone dial code).
 * The inline `error` renders below; backend failures still go to the top `Alert`.
 *
 * @param label - The floating label (doubles as the resting placeholder).
 * @param error - The inline (zod) error, shown below the field.
 * @param required - Appends a `*` marker to the label.
 * @param prefix - Optional static content shown before the input (label stays floated).
 * @param id - Required, so the label/error associate with the control.
 */
export const FloatingField = forwardRef<HTMLInputElement, FloatingFieldProps>(
    ({ label, error, required, prefix, id, type = "text", className, ...props }, ref) => {
        const isPassword = type === "password";
        const [visible, setVisible] = useState(false);

        const errorText = error && (
            <p
                id={`${id}-error`}
                className="text-destructive text-xs"
            >
                {error}
            </p>
        );

        const marker = required && <span className="ml-0.5 text-destructive">*</span>;

        if (prefix !== undefined) {
            return (
                <div className="flex flex-col gap-1.5">
                    <div className="relative">
                        <div
                            className={cn(
                                "flex h-12 w-full items-center gap-1.5 rounded-md border border-input bg-muted px-3 pt-4 text-sm",
                                "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20",
                                error &&
                                    "border-destructive focus-within:border-destructive focus-within:ring-destructive/20"
                            )}
                        >
                            <span className="shrink-0 text-muted-foreground">{prefix}</span>
                            <input
                                id={id}
                                ref={ref}
                                type={type}
                                placeholder=" "
                                aria-invalid={error ? true : undefined}
                                className="w-full flex-1 bg-transparent text-sm outline-none placeholder:text-transparent"
                                {...props}
                            />
                        </div>
                        <label
                            htmlFor={id}
                            className="pointer-events-none absolute top-1.5 left-3 font-bold text-[10px] text-primary dark:text-secondary"
                        >
                            {label}
                            {marker}
                        </label>
                    </div>
                    {errorText}
                </div>
            );
        }

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
                            "peer h-12 bg-muted pt-5 pb-1 text-sm placeholder:text-transparent dark:bg-muted",
                            isPassword && "pr-10",
                            className
                        )}
                        {...props}
                    />
                    <label
                        htmlFor={id}
                        className={cn(
                            "pointer-events-none absolute top-1.5 left-3 font-bold text-[10px] text-primary transition-all duration-200 dark:text-secondary",
                            "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:font-normal peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:text-sm",
                            "peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:font-bold peer-focus:text-[10px] peer-focus:text-primary dark:peer-focus:text-secondary"
                        )}
                    >
                        {label}
                        {marker}
                    </label>
                    {isPassword && (
                        <Button
                            size="icon"
                            type="button"
                            variant="ghost"
                            onClick={() => setVisible((v) => !v)}
                            aria-label={visible ? "Hide password" : "Show password"}
                            className="-translate-y-1/2 absolute top-1/2 right-1 rounded-full text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {visible ? (
                                <EyeOffIcon className="size-4" />
                            ) : (
                                <EyeIcon className="size-4" />
                            )}
                        </Button>
                    )}
                </div>
                {errorText}
            </div>
        );
    }
);
FloatingField.displayName = "FloatingField";
