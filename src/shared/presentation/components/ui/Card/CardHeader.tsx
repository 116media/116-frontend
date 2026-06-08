import type { HTMLAttributes } from "react";

import { cn } from "@/shared/presentation/utils/cn";

/**
 * CardHeader
 *
 * @description
 * Header slot for the Card compound component.
 * Stacks children vertically with consistent spacing and padding.
 * Typically contains a CardTitle and optional CardDescription.
 */
export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("flex flex-col space-y-1.5 p-6", className)}
            {...props}
        />
    );
}
