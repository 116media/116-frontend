import type { ReactNode } from "react";
import { PAGE_GUTTER } from "@/shared/presentation/constants/layout";
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
 * max-width. Used in every layout and directly in pages for uniform spacing. The gutter
 * holds at every width: the max-width equals the `xl` breakpoint, so dropping it there
 * would leave the content flush to both edges on a viewport of exactly that size.
 */
export function PageContainer({ children, className }: PageContainerProps) {
    return (
        <div className={cn("mx-auto w-full max-w-7xl 3xl:max-w-8xl", PAGE_GUTTER, className)}>
            {children}
        </div>
    );
}
