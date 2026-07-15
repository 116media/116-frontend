"use client";

import { motion, MotionValue, useMotionTemplate, useTransform } from "motion/react";

/**
 * Props for the GradientLayer part.
 *
 * @interface GradientLayerProps
 * @property {MotionValue<number>} springX - Spring-smoothed x position of the wandering center.
 * @property {MotionValue<number>} springY - Spring-smoothed y position of the wandering center.
 * @property {string} gradientColor - The layer's radial gradient color.
 * @property {number} opacity - The layer's opacity.
 * @property {number} multiplier - Position scale, staggering stacked layers for depth.
 */
export interface GradientLayerProps {
    springX: MotionValue<number>;
    springY: MotionValue<number>;
    gradientColor: string;
    opacity: number;
    multiplier: number;
}

/**
 * NoiseBackgroundGradientLayer
 *
 * @description
 * One wandering radial-gradient layer: follows the spring position scaled by
 * `multiplier`, so stacked layers drift at different rates for depth.
 */
export function NoiseBackgroundGradientLayer({
    springX,
    springY,
    gradientColor,
    opacity,
    multiplier
}: GradientLayerProps) {
    const x = useTransform(springX, (value) => value * multiplier);
    const y = useTransform(springY, (value) => value * multiplier);
    const background = useMotionTemplate`radial-gradient(circle at ${x}px ${y}px, ${gradientColor} 0%, transparent 85%)`;

    return (
        <motion.div
            className="absolute inset-0"
            style={{ opacity, background }}
        />
    );
}
