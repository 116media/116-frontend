import type { ComponentType } from "react";

import {
    CarIcon,
    ClockIcon,
    CpuIcon,
    MonitorIcon,
    SmartphoneIcon,
    TabletIcon
} from "@/shared/presentation/components/ui/Icon";

/**
 * Maps a resolved device label to its icon; unknown devices fall back to a help icon
 * at the call site.
 */
export const DEVICE_ICONS: Record<string, ComponentType<{ className?: string }>> = {
    desktop: MonitorIcon,
    tv: MonitorIcon,
    console: MonitorIcon,
    mobile: SmartphoneIcon,
    tablet: TabletIcon,
    watch: ClockIcon,
    car: CarIcon,
    iot: CpuIcon
};
