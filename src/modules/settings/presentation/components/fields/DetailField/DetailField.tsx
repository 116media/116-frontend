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
 * A read-only labeled value with a leading icon, used in the profile information
 * grid. Falls back to an em dash when the value is empty.
 */
export function DetailField({ icon, label, value }: DetailFieldProps) {
    return (
        <div className="flex items-start gap-3 rounded-md border p-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg]:size-4">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-muted-foreground text-xs">{label}</p>
                <p className="truncate font-medium text-foreground text-sm">{value || "—"}</p>
            </div>
        </div>
    );
}
