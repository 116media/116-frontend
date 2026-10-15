import Image from "next/image";
import Link from "next/link";

import { APP_NAME } from "@/shared/infrastructure/constants/common";
import { HOME_PATH } from "@/shared/presentation/constants/paths";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Intrinsic dimensions per variant: `icon` is the square badge, `plain` the wordmark.
 * Each variant ships a dark and a light artwork; the theme picks between them.
 */
const LOGO_VARIANTS = {
    icon: { width: 48, height: 48 },
    plain: { width: 96, height: 48 }
} as const;

/**
 * Props for the Logo component.
 *
 * @interface LogoProps
 * @property {boolean} [canRedirect] - Wraps the mark in a link to the homepage.
 * @property {boolean} [priority] - Opts the artwork out of lazy loading, for above-the-fold use.
 * @property {"icon" | "plain"} [variant] - The square badge or the wordmark.
 * @property {string} [className] - Sizing classes merged onto both artworks.
 */
export interface LogoProps {
    canRedirect?: boolean;
    priority?: boolean;
    variant?: keyof typeof LOGO_VARIANTS;
    className?: string;
}

/**
 * Logo
 *
 * @description
 * The 116 brand mark, swapping artwork by theme so it reads on either ground.
 * Callers size it through `className`.
 */
export function Logo({
    canRedirect = false,
    priority = false,
    variant = "icon",
    className
}: LogoProps) {
    const { width, height } = LOGO_VARIANTS[variant];

    const mark = (
        <>
            <Image
                width={width}
                height={height}
                priority={priority}
                alt={`${APP_NAME} Media`}
                src={`/images/logo/dark/${variant}.svg`}
                className={cn("dark:hidden", className)}
            />
            <Image
                width={width}
                height={height}
                priority={priority}
                alt={`${APP_NAME} Media`}
                src={`/images/logo/light/${variant}.svg`}
                className={cn("hidden dark:block", className)}
            />
        </>
    );

    if (!canRedirect) return mark;

    return (
        <Link
            href={HOME_PATH}
            aria-label={`${APP_NAME}-logo`}
        >
            {mark}
        </Link>
    );
}
