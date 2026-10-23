import { NoiseBackground as NoiseBackgroundRoot } from "./NoiseBackground";
import { NoiseBackgroundGradientLayer } from "./NoiseBackground.GradientLayer";

export type { NoiseBackgroundProps } from "./NoiseBackground";

/**
 * NoiseBackground
 *
 * @description
 * Grain overlay for tinted surfaces: the root lays the noise, `.GradientLayer` the wash
 * beneath it.
 */
export const NoiseBackground = {
    Root: NoiseBackgroundRoot,
    GradientLayer: NoiseBackgroundGradientLayer
} as const;
