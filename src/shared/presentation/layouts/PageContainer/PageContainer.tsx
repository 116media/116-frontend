import type { ReactNode } from "react";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

export interface PageContainerProps {
    children: ReactNode;
    className?: string;
}

/**
 * PageContainer
 *
 * @description
 * Wraps page content with consistent responsive horizontal padding and a centered
 * max-width. Used in every layout and directly in pages for uniform spacing.
 *
 * @param children - Page content
 * @param className - Additional classes to merge
 */
export function PageContainer({ children, className }: PageContainerProps) {
    return (
        <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-0", className)}>
            {children}
        </div>
    );
}
