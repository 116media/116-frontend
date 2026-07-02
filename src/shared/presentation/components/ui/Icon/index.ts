/**
 * Icon barrel — the single import path for every icon in the app.
 *
 * @description
 * Combines the hand-authored SVG components in `./svg` (brand marks, language
 * flags) with the `lucide-react` re-exports in `./lucide`.
 *
 * @example
 * import { ArrowLeftIcon, SpinnerIcon, GoogleIcon } from "@/shared/presentation/components/ui/Icon";
 *
 * @remarks
 * Import icons from this barrel only, not from `lucide-react` or an individual
 * `./svg` file, so the icon set stays in one place and the vendor dependency
 * stays isolated in `./lucide`.
 */
export * from "./lucide";
export { EnglishFlagIcon } from "./svg/EnglishFlagIcon";
export { FacebookIcon } from "./svg/FacebookIcon";
export { FrenchFlagIcon } from "./svg/FrenchFlagIcon";
export { GoogleIcon } from "./svg/GoogleIcon";
