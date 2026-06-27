import type { ReactNode } from "react";

import { Button } from "@/shared/presentation/components/ui/Button";
import { Card } from "@/shared/presentation/components/ui/Card";
import { EditIcon } from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn";

/**
 * Props for the SettingsCard component.
 *
 * @interface SettingsCardProps
 * @property {string} title - The card title.
 * @property {string} [subtitle] - Optional supporting line under the title.
 * @property {ReactNode} [extra] - Optional element rendered on the right of the header.
 * @property {() => void} [onEdit] - When set, renders an edit button in the header.
 * @property {string} [editLabel] - Label for the edit button.
 * @property {ReactNode} children - The card body.
 * @property {string} [className] - Extra classes merged onto the card.
 */
export interface SettingsCardProps {
    title: string;
    subtitle?: string;
    extra?: ReactNode;
    onEdit?: () => void;
    editLabel?: string;
    children: ReactNode;
    className?: string;
}

/**
 * SettingsCard
 *
 * @description
 * A titled, optionally subtitled surface used for each block within a settings tab.
 * The header carries an optional right-aligned `extra` slot and an optional edit
 * action. Mirrors the dashboard's `SettingsCard`.
 *
 * @param title - The card title.
 * @param subtitle - Optional supporting line under the title.
 * @param extra - Optional element rendered on the right of the header.
 * @param onEdit - When set, renders an edit button that invokes this handler.
 * @param editLabel - Label for the edit button.
 * @param children - The card body.
 * @param className - Extra classes merged onto the card.
 */
export function SettingsCard({
    title,
    subtitle,
    extra,
    onEdit,
    editLabel,
    children,
    className
}: SettingsCardProps) {
    return (
        <Card className={cn("bg-transparent p-6 shadow-none hover:shadow-none", className)}>
            <div className="mb-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <h2 className="font-semibold text-base text-foreground">{title}</h2>
                    {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    {extra}
                    {onEdit && (
                        <Button
                            onClick={onEdit}
                            variant="outline"
                        >
                            <EditIcon className="size-4" />
                            {editLabel}
                        </Button>
                    )}
                </div>
            </div>
            {children}
        </Card>
    );
}
