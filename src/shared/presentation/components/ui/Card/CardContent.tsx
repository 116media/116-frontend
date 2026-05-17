import type { HTMLAttributes } from "react";

import { cn } from "@/shared/presentation/utils/cn";

/**
 * CardContent
 *
 * @description
 * Body slot for the Card compound component.
 * Provides consistent horizontal padding with no top padding so it
 * sits flush below a CardHeader.
 */
export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("p-6 pt-0", className)}
            {...props}
        />
    );
}
