import type { HTMLAttributes } from "react";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * DialogHeader
 *
 * @description
 * The centred title block for a short action dialog that has no header region — it sits
 * inline in the content, with no border and no close control. A dialog with a fixed
 * header above a scrolling body uses `Sheet.Header` instead.
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
