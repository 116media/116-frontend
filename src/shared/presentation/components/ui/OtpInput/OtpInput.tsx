"use client";

import { useMemo, useRef } from "react";

import { Input } from "@/shared/presentation/components/ui/Input";

/**
 * Props for the OtpInput component.
 *
 * @interface OtpInputProps
 * @property {string} value - The current code value.
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
 * Mirrors the mobile OTP UX. The one auth control not wrapped in a floating-label
 * field, though the boxes use the shared gray `bg-muted` + `rounded-sm` styling.
 *
 * @param value - The current code.
 * @param onChange - Emits the joined code on every edit.
 * @param length - Digit count (default 6).
 */
export function OtpInput({ value, onChange, length = 6 }: OtpInputProps) {
    const refs = useRef<Array<HTMLInputElement | null>>([]);
    const chars = value.padEnd(length).split("").slice(0, length);

    // Stable per-slot identities, generated once (the boxes never reorder), so each
    // list key is a real id rather than the array index.
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
        <div className="flex justify-center gap-2">
            {slotKeys.map((key, index) => (
                <Input
                    key={key}
                    ref={(el) => {
                        refs.current[index] = el;
                    }}
                    inputMode="numeric"
                    maxLength={1}
                    value={chars[index]?.trim() ?? ""}
                    onChange={(event) => setChar(index, event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Backspace" && !chars[index]?.trim() && index > 0) {
                            refs.current[index - 1]?.focus();
                        }
                    }}
                    onPaste={(event) => {
                        event.preventDefault();
                        onChange(
                            event.clipboardData.getData("text").replace(/\D/g, "").slice(0, length)
                        );
                    }}
                    className="size-11 rounded-sm px-0 text-center text-lg font-semibold"
                />
            ))}
        </div>
    );
}
