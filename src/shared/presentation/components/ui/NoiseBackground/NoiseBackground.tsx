"use client";

import { motion, useAnimationFrame, useMotionValue, useSpring, useTransform } from "motion/react";
import { type ReactNode, useEffect, useRef } from "react";

import { cn } from "@/shared/presentation/utils/cn/cn.utils";
import { NoiseBackgroundGradientLayer } from "./NoiseBackground.GradientLayer";

/**
 * Tiling fractal-noise texture (inline SVG), blended over the gradients as
 * film grain so no external asset is fetched.
 */
const NOISE_TEXTURE =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

const EDGE_PADDING = 20;

/**
 * Props for the NoiseBackground component.
 *
 * @interface NoiseBackgroundProps
 * @property {ReactNode} [children] - Content rendered above the effect.
 * @property {string} [className] - Classes merged onto the content wrapper.
 * @property {string} [containerClassName] - Classes merged onto the container.
 * @property {string[]} [gradientColors] - The three wandering gradient colors (theme tokens by default).
 * @property {number} [noiseIntensity] - Grain opacity, 0–1.
 * @property {number} [speed] - Movement speed multiplier.
 * @property {boolean} [backdropBlur] - Blurs the layers behind the content.
 * @property {boolean} [animating] - Whether the gradients wander.
 */
export interface NoiseBackgroundProps {
    speed?: number;
    className?: string;
    children?: ReactNode;
    containerClassName?: string;
    gradientColors?: string[];
    noiseIntensity?: number;
    backdropBlur?: boolean;
    animating?: boolean;
}

/**
 * NoiseBackground
 *
 * @description
 * Dynamic backdrop framing its content: three radial gradients wander smoothly
 * on springs, change direction at random intervals, and bounce off the edges,
 * under a film-grain noise overlay and a moving top gradient strip.
 */
export function NoiseBackground({
    children,
    className,
    containerClassName,
    gradientColors = ["var(--primary)", "var(--secondary)", "var(--warning)"],
    noiseIntensity = 0.2,
    speed = 0.1,
    backdropBlur = false,
    animating = true
}: NoiseBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, { stiffness: 100, damping: 30 });
    const springY = useSpring(y, { stiffness: 100, damping: 30 });

    const topGradientX = useTransform(springX, (value) => value * 0.1 - 50);

    const velocityRef = useRef({ x: 0, y: 0 });
    const lastDirectionChangeRef = useRef(0);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        x.set(rect.width / 2);
        y.set(rect.height / 2);
    }, [x, y]);

    const generateRandomVelocityRef = useRef(() => ({ x: 0, y: 0 }));

    useEffect(() => {
        generateRandomVelocityRef.current = () => {
            const angle = Math.random() * Math.PI * 2;
            const magnitude = speed * (0.5 + Math.random() * 0.5);
            return {
                x: Math.cos(angle) * magnitude,
                y: Math.sin(angle) * magnitude
            };
        };
        velocityRef.current = generateRandomVelocityRef.current();
    }, [speed]);

    useAnimationFrame((time) => {
        if (!animating || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();

        if (time - lastDirectionChangeRef.current > 1500 + Math.random() * 1500) {
            velocityRef.current = generateRandomVelocityRef.current();
            lastDirectionChangeRef.current = time;
        }

        const deltaTime = 16;
        let newX = x.get() + velocityRef.current.x * deltaTime;
        let newY = y.get() + velocityRef.current.y * deltaTime;

        const hitsEdge =
            newX < EDGE_PADDING ||
            newX > rect.width - EDGE_PADDING ||
            newY < EDGE_PADDING ||
            newY > rect.height - EDGE_PADDING;

        if (hitsEdge) {
            velocityRef.current = generateRandomVelocityRef.current();
            lastDirectionChangeRef.current = time;
            newX = Math.max(EDGE_PADDING, Math.min(rect.width - EDGE_PADDING, newX));
            newY = Math.max(EDGE_PADDING, Math.min(rect.height - EDGE_PADDING, newY));
        }

        x.set(newX);
        y.set(newY);
    });

    return (
        <div
            ref={containerRef}
            className={cn(
                "group relative overflow-hidden rounded-2xl bg-muted p-2 backdrop-blur-sm",
                backdropBlur &&
                    "after:absolute after:inset-0 after:h-full after:w-full after:backdrop-blur-lg after:content-['']",
                containerClassName
            )}
        >
            <NoiseBackgroundGradientLayer
                opacity={0.7}
                multiplier={1}
                springX={springX}
                springY={springY}
                gradientColor={gradientColors[0]}
            />
            <NoiseBackgroundGradientLayer
                opacity={0.55}
                multiplier={0.7}
                springX={springX}
                springY={springY}
                gradientColor={gradientColors[1]}
            />
            <NoiseBackgroundGradientLayer
                opacity={0.45}
                multiplier={1.2}
                springX={springX}
                springY={springY}
                gradientColor={gradientColors[2] ?? gradientColors[0]}
            />

            <motion.div
                className="absolute inset-x-0 top-0 h-1 rounded-t-2xl opacity-80 blur-sm"
                style={{
                    background: `linear-gradient(to right, ${gradientColors.join(", ")})`,
                    x: animating ? topGradientX : 0
                }}
            />

            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                    opacity: noiseIntensity,
                    mixBlendMode: "overlay",
                    backgroundImage: `url("${NOISE_TEXTURE}")`,
                    backgroundRepeat: "repeat"
                }}
            />

            <div className={cn("relative z-10", className)}>{children}</div>
        </div>
    );
}
