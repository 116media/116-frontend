import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { SearchFieldSize, SearchFieldVariant } from "./searchFieldVariants";

/**
 * Props for the SearchField root.
 *
 * @interface SearchFieldProps
 * @property {ReactNode} children - The parts that fill the shell, in reading order.
 * @property {SearchFieldVariant} [variant] - How the shell presents itself. Defaults to `filled`.
 * @property {SearchFieldSize} [size] - The shell's height. Defaults to `md`.
 * @property {string} [className] - Extra classes merged onto the shell.
 */
export interface SearchFieldProps {
    children: ReactNode;
    variant?: SearchFieldVariant;
    size?: SearchFieldSize;
    className?: string;
}

/**
 * Props for SearchField.Icon.
 *
 * @interface SearchFieldIconProps
 * @property {string} [className] - Extra classes merged onto the glyph.
 */
export interface SearchFieldIconProps {
    className?: string;
}

/**
 * Props for SearchField.Input.
 *
 * @interface SearchFieldInputProps
 * @augments ComponentPropsWithoutRef<"input">
 * @property {string} value - The current term, owned by the caller.
 * @property {(value: string) => void} onValueChange - Emits every keystroke.
 * @property {() => void} [onSubmit] - Called on Enter, for a field that leaves for a results route.
 * @property {() => void} [onClear] - Called on Escape, when the field should empty rather than close.
 */
export interface SearchFieldInputProps
    extends Omit<ComponentPropsWithoutRef<"input">, "value" | "onChange" | "size"> {
    value: string;
    onValueChange: (value: string) => void;
    onSubmit?: () => void;
    onClear?: () => void;
}

/**
 * Props for SearchField.Clear.
 *
 * @interface SearchFieldClearProps
 * @property {string} label - Accessible label for the control.
 * @property {() => void} onClear - Empties the field.
 * @property {boolean} [hidden] - Keeps the slot but renders nothing, so the shell never reflows.
 * @property {string} [className] - Extra classes merged onto the control.
 */
export interface SearchFieldClearProps {
    label: string;
    onClear: () => void;
    hidden?: boolean;
    className?: string;
}

/**
 * Props for SearchField.Trigger.
 *
 * @interface SearchFieldTriggerProps
 * @property {string} label - Accessible name, announced in place of the placeholder copy.
 * @property {string} placeholder - The prompt shown where typed text would sit.
 * @property {() => void} onOpen - Opens the surface that carries the real field.
 * @property {SearchFieldVariant} [variant] - How the shell presents itself.
 * @property {SearchFieldSize} [size] - The shell's height.
 * @property {string} [className] - Extra classes merged onto the shell.
 */
export interface SearchFieldTriggerProps {
    label: string;
    placeholder: string;
    onOpen: () => void;
    variant?: SearchFieldVariant;
    size?: SearchFieldSize;
    className?: string;
}
