import type { VideosMegaMenuProps } from "@/modules/videos/presentation/components/navigation/VideosMegaMenu/types";

/**
 * VideosMobileMenuProps
 *
 * @description
 * The videos mega menu payload plus the callback that closes the hosting panel once
 * a row, card or tag navigates.
 */
export interface VideosMobileMenuProps extends VideosMegaMenuProps {
    onNavigate: () => void;
}
