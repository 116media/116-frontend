import type { Variants } from "motion/react";

export const sunPath =
    "M70 49.5C70 60.8218 60.8218 70 49.5 70C38.1782 70 29 60.8218 29 49.5C29 38.1782 38.1782 29 49.5 29C60 29 69.5 38 70 49.5Z";

export const moonPath =
    "M70 49.5C70 60.8218 60.8218 70 49.5 70C38.1782 70 29 60.8218 29 49.5C29 38.1782 38.1782 29 49.5 29C39 45 49.5 59.5 70 49.5Z";

export const sunRayPaths = [
    "M50 2V11",
    "M85 15L78 22",
    "M98 50H89",
    "M85 85L78 78",
    "M50 98V89",
    "M23 78L16 84",
    "M11 50H2",
    "M23 23L16 16"
];

export const raysVariants: Variants = {
    hidden: {
        strokeOpacity: 0,
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1
        }
    },
    visible: {
        strokeOpacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

export const rayVariant: Variants = {
    hidden: {
        pathLength: 0,
        opacity: 0,
        scale: 0
    },
    visible: {
        pathLength: 1,
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.2,
            ease: "easeOut",
            pathLength: { duration: 0.3 },
            opacity: { duration: 0.2 },
            scale: { duration: 0.3 }
        }
    }
};

export const shineVariant: Variants = {
    hidden: {
        opacity: 0,
        scale: 2,
        strokeDasharray: "20, 1000",
        strokeDashoffset: 0,
        filter: "blur(0px)"
    },
    visible: {
        opacity: [0, 1, 0],
        strokeDashoffset: [0, -50, -100],
        filter: ["blur(2px)", "blur(2px)", "blur(0px)"],
        transition: {
            duration: 0.75,
            ease: "linear" as const
        }
    }
};

export const moonAnimation = {
    d: moonPath,
    rotate: -360,
    scale: 1.5,
    transformOrigin: "25px 25px",
    stroke: "var(--color-glow-star)",
    fill: "var(--color-primary-subtle)",
    fillOpacity: 1,
    strokeOpacity: 0.5,
    transition: { delay: 0.1 }
};

export const sunAnimation = {
    d: sunPath,
    rotate: 0,
    scale: 1,
    transformOrigin: "25px 25px",
    fill: "var(--color-sun)",
    stroke: "var(--color-sun)",
    fillOpacity: 0.5,
    strokeOpacity: 1
};
