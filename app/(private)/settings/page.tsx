import { redirect } from "next/navigation";

import { SETTINGS_PROFILE_PATH } from "@/shared/presentation/constants/paths";

/**
 * SettingsPage
 *
 * @description
 * The settings index — redirects to the profile tab, the default settings view.
 */
export default function SettingsPage() {
    redirect(SETTINGS_PROFILE_PATH);
}
