import type { HTMLAttributes } from "react";

import { cn } from "@/shared/presentation/utils/cn";

/**
 * DialogHeader
 *
 * @description
 * Wraps the title + description; centered, matching the kinix auth modal.
 *
 * @param className - Extra classes merged onto the header.
 */
export function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("flex flex-col gap-1.5 text-center", className)}
            {...props}
        />
    );
}
