import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for the YouTube brand icon.
 *
 * @property {string} className - Additional SVG classes.
 */
export interface YoutubeIconProps {
    className?: string;
}

/**
 * Renders the YouTube play-button brand mark as a decorative inline SVG.
 */
export function YoutubeIcon({ className }: YoutubeIconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
            className={cn("size-4 rounded-lg", className)}
        >
            <rect
                x="1"
                y="4"
                width="22"
                height="16"
                rx="4"
                fill="#FF0000"
            />
            <path
                d="m10 9 5 3-5 3V9Z"
                fill="white"
            />
        </svg>
    );
}
