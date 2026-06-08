import type { HTMLAttributes } from "react";

import { cn } from "@/shared/presentation/utils/cn";

/**
 * CardFooter
 *
 * @description
 * Footer slot for the Card compound component.
 * Lays children out in a horizontal row with consistent padding.
 * Typically contains action buttons or summary metadata.
 */
export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("flex items-center p-6 pt-0", className)}
            {...props}
        />
    );
}
