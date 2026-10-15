import type { ReactNode } from "react";

/**
 * Props for the DetailField component.
 *
 * @interface DetailFieldProps
 * @property {ReactNode} icon - The leading field icon.
 * @property {string} label - The field label.
 * @property {string | null} [value] - The field value; an em dash renders when empty.
 */
export interface DetailFieldProps {
    label: string;
    icon: ReactNode;
    value?: string | null;
}

/**
 * DetailField
 *
 * @description
 * A read-only labeled value with a leading icon, used in the profile information grid.
 * Up to `lg` it carries no surface of its own, earning its structure from the icon tile, the
 * label above the value and the space around it, so the card stays the only box; from `lg`
 * it keeps the bordered field it has always been. The value takes the free width of its row
 * and wraps on a phone rather than truncating. Falls back to an em dash when empty.
 */
export function DetailField({ icon, label, value }: DetailFieldProps) {
    return (
        <div className="flex min-w-0 items-center gap-3.5 lg:items-start lg:gap-3 lg:rounded-md lg:border lg:p-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground lg:size-9 lg:rounded-md [&_svg]:size-5 lg:[&_svg]:size-4">
                {icon}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 lg:gap-0">
                <p className="text-muted-foreground text-xs uppercase tracking-wide lg:normal-case lg:tracking-normal">
                    {label}
                </p>
                <p className="break-words font-medium text-base text-foreground lg:truncate lg:text-sm">
                    {value || "—"}
                </p>
            </div>
        </div>
    );
}
