import type { Metadata } from "next";
import { ProfileSection } from "@/modules/settings/presentation/components/sections/ProfileSection";
import { getServerTranslation } from "@/shared/presentation/utils/i18n/i18n.server.utils";

/**
 * generateMetadata
 *
 * @description
 * Route metadata for the profile settings tab: the translated title, reusing the sidebar's
 * own nav-label key.
 *
 * @returns The route metadata for the current request's language.
 */
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getServerTranslation();
    return { title: t("settings.nav.profile") };
}

/**
 * ProfileSettingsPage
 *
 * @description
 * The profile settings tab — avatar and account information.
 */
export default function ProfileSettingsPage() {
    return <ProfileSection />;
}
