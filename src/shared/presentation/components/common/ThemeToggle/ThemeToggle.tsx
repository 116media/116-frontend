"use client";

import { domAnimation, LazyMotion } from "motion/react";
import * as m from "motion/react-m";
import { useTheme } from "next-themes";
import { useCallback } from "react";

import { Button } from "@/shared/presentation/components/ui/Button";

import {
    moonAnimation,
    moonPath,
    raysVariants,
    rayVariant,
    shineVariant,
    sunAnimation,
    sunPath,
    sunRayPaths
} from "./variants";

/**
 * ThemeToggle
 *
 * @description
 * Animated icon button that switches between light and dark mode, morphing between
 * a sun and a moon via Motion. All colors reference CSS tokens from theme.css.
 */
export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const onToggle = useCallback(() => {
        setTheme(theme === "dark" ? "light" : "dark");
    }, [theme, setTheme]);

    return (
        <Button
            size="icon"
            type="button"
            variant="ghost"
            onClick={onToggle}
            title="Toggle Theme"
            suppressHydrationWarning
            className="bg-surface-raised text-sun hover:bg-surface-hover hover:text-sun"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
            <LazyMotion features={domAnimation}>
                <m.svg
                    width={22}
                    height={22}
                    fill="none"
                    strokeWidth="4"
                    strokeLinecap="round"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <m.path
                        d={moonPath}
                        initial="hidden"
                        variants={shineVariant}
                        className="stroke-primary-subtle"
                        animate={theme === "dark" ? "visible" : "hidden"}
                    />

                    <m.g
                        initial="hidden"
                        className="stroke-sun"
                        variants={raysVariants}
                        style={{ strokeLinecap: "round" }}
                        animate={theme === "light" ? "visible" : "hidden"}
                    >
                        {sunRayPaths.map((d) => (
                            <m.path
                                key={d}
                                d={d}
                                variants={rayVariant}
                                className="origin-center"
                            />
                        ))}
                    </m.g>

                    <m.path
                        d={sunPath}
                        fill="transparent"
                        transition={{ duration: 0.65, type: "spring" }}
                        initial={{ d: sunPath, fillOpacity: 0, strokeOpacity: 0 }}
                        animate={theme === "dark" ? moonAnimation : sunAnimation}
                    />
                </m.svg>
            </LazyMotion>
        </Button>
    );
}
