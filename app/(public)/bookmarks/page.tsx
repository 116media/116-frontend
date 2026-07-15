import { BookmarksContainer } from "@/modules/articles/presentation/containers/BookmarksContainer";

/**
 * BookmarksPage
 *
 * @description
 * The signed-in reader's saved articles (`/bookmarks`): a heading above an
 * infinite-scrolling grid of every article the user bookmarked, newest first.
 * Guests see a login prompt instead of the grid.
 */
export default function BookmarksPage() {
    return (
        <div className="flex flex-col gap-8 lg:gap-12">
            <BookmarksContainer />
        </div>
    );
}
