"use client";

import type { ReactNode } from "react";

import { Button } from "@/shared/presentation/components/ui/Button";
import { Card } from "@/shared/presentation/components/ui/Card";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for the AccountActionCard component.
 *
 * @interface AccountActionCardProps
 * @property {ReactNode} icon - The leading icon shown in the tinted box.
 * @property {string} title - The action title.
 * @property {string} description - The supporting description under the title.
 * @property {string} actionLabel - The trailing button's label.
 * @property {() => void} onAction - Invoked when the trailing button is clicked.
 * @property {boolean} [danger] - Renders the destructive tone (tinted icon box + solid destructive button); otherwise a neutral box + outline button with destructive text.
 */
export interface AccountActionCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    actionLabel: string;
    onAction: () => void;
    danger?: boolean;
}

/**
 * AccountActionCard
 *
 * @description
 * A card row for a single account action: icon, title, description, and a trailing
 * action button. The `danger` variant applies the destructive tone for the more
 * severe actions (e.g. sign out from all devices).
 */
export function AccountActionCard({
    icon,
    title,
    description,
    actionLabel,
    onAction,
    danger = false
}: AccountActionCardProps) {
    return (
        <Card className="flex items-center gap-3 bg-transparent p-6 shadow-none hover:shadow-none">
            <div
                className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-md [&_svg]:size-5",
                    danger ? "bg-destructive/10 text-destructive" : "bg-muted text-foreground"
                )}
            >
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">{title}</p>
                <p className="text-muted-foreground text-sm">{description}</p>
            </div>
            <Button
                variant={danger ? "destructive" : "outline"}
                className={danger ? undefined : "text-destructive"}
                onClick={onAction}
            >
                {actionLabel}
            </Button>
        </Card>
    );
}
