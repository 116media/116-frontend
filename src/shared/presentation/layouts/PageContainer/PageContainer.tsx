import type { ReactNode } from "react";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for the PageContainer component.
 *
 * @interface PageContainerProps
 * @property {ReactNode} children - The page content to constrain.
 * @property {string} [className] - Extra classes merged onto the container.
 */
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
 */
export function PageContainer({ children, className }: PageContainerProps) {
    return (
        <div
            className={cn(
                "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-0 3xl:max-w-8xl",
                className
            )}
        >
            {children}
        </div>
    );
}
