import type { Metadata } from "next";

import { ComingSoonContainer } from "@/modules/coming-soon/presentation/containers/ComingSoonContainer";
import { getServerTranslation } from "@/shared/presentation/utils/i18n/i18n.server.utils";

/**
 * generateMetadata
 *
 * @description
 * Names the pre-launch route in the active server language.
 *
 * @returns The route metadata for the current request's language.
 */
export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getServerTranslation();

    return {
        title: t("comingSoon.launch.meta.title"),
        description: t("comingSoon.launch.meta.description")
    };
}

/**
 * ComingSoonPage
 *
 * @description
 * The pre-launch route (`/coming-soon`). Deliberately outside the `(public)` group: it
 * stands in for the whole site before it opens, so it carries neither the header nor
 * the footer that would offer somewhere else to go.
 */
export default function ComingSoonPage() {
    return <ComingSoonContainer />;
}
