import type { ReactNode } from "react";

import { cn } from "@/shared/presentation/utils/cn";

interface PageContainerProps {
    children: ReactNode;
    className?: string;
}

/**
 * PageContainer
 *
 * @description
 * Wraps page content with consistent horizontal padding and a centered max-width.
 * Used in every layout (public, user) and directly in pages to ensure uniform
 * spacing across all screen sizes.
 *
 * Responsive padding scale:
 * - Mobile  (< 640px)  : 16px (px-4)
 * - Tablet  (≥ 640px)  : 24px (sm:px-6)
 * - Desktop (≥ 1024px) : 32px (lg:px-8)
 * - Wide    (≥ 1280px) : 40px (xl:px-10)
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
