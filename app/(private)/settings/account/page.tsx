import type { Metadata } from "next";
import { AccountSectionContainer } from "@/modules/settings/presentation/containers/AccountSectionContainer";
import { getServerTranslation } from "@/shared/presentation/utils/i18n/i18n.server.utils";

/**
 * generateMetadata
 *
 * @description
 * Route metadata for the account settings tab: the translated title, reusing the sidebar's
 * own nav-label key.
 *
 * @returns The route metadata for the current request's language.
 */
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getServerTranslation();
    return { title: t("settings.nav.account") };
}

/**
 * AccountSettingsPage
 *
 * @description
 * The account settings tab — sign out and sign out from all devices.
 */
export default function AccountSettingsPage() {
    return <AccountSectionContainer />;
}
