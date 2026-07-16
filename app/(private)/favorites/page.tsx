import { redirect } from "next/navigation";

import { FAVORITE_ARTICLES_PATH } from "@/shared/presentation/constants/paths";

/**
 * FavoritesPage
 *
 * @description
 * The favorites index (`/favorites`) has no content of its own; it redirects to the
 * articles route, the default content type.
 */
export default function FavoritesPage() {
    redirect(FAVORITE_ARTICLES_PATH);
}
