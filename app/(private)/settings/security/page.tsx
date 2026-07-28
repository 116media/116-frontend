import type { Metadata } from "next";
import { SecuritySection } from "@/modules/settings/presentation/components/sections/SecuritySection";
import { getServerTranslation } from "@/shared/presentation/utils/i18n/i18n.server.utils";

/**
 * generateMetadata
 *
 * @description
 * Route metadata for the security settings tab: the translated title, reusing the sidebar's
 * own nav-label key.
 *
 * @returns The route metadata for the current request's language.
 */
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getServerTranslation();
    return { title: t("settings.nav.security") };
}

/**
 * SecuritySettingsPage
 *
 * @description
 * The security settings tab — change password and active sessions.
 */
export default function SecuritySettingsPage() {
    return <SecuritySection />;
}
