import { FavoriteLayout as FavoriteLayoutRoot } from "./FavoriteLayout";
import { FavoriteLayoutCollection } from "./FavoriteLayout.Collection";
import { FavoriteLayoutTabs } from "./FavoriteLayout.Tabs";

export type { FavoriteLayoutProps } from "./FavoriteLayout";
export type { FavoriteLayoutCollectionProps } from "./FavoriteLayout.Collection";
export type { FavoriteLayoutTab, FavoriteLayoutTabsProps } from "./FavoriteLayout.Tabs";

/**
 * FavoriteLayout
 *
 * @description
 * Compound layout for the private favorites area. The root owns the sidebar/content
 * structure and `.Collection` owns the repeated heading and collection content frame.
 */
export const FavoriteLayout = Object.assign(FavoriteLayoutRoot, {
    Collection: FavoriteLayoutCollection,
    Tabs: FavoriteLayoutTabs
});
