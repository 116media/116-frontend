"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ShowCard } from "@/modules/videos/presentation/components/cards/ShowCard";
import { useShows } from "@/modules/videos/presentation/hooks/useShows";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { SearchIcon } from "@/shared/presentation/components/ui/Icon";
import { SearchField } from "@/shared/presentation/components/ui/SearchField";
import { AdaptiveDialog } from "@/shared/presentation/components/ui/Sheet";

/**
 * Props for VideosCategoriesModal.
 *
 * @interface VideosCategoriesModalProps
 * @property {boolean} open - Whether the modal is open.
 * @property {(open: boolean) => void} onOpenChange - Emits the open state.
 */
export interface VideosCategoriesModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/**
 * VideosCategoriesModal
 *
 * @description
 * The "browse all shows" modal: a searchable vertical list of every active
 * show, each rendered as a `ShowCard.Horizontal` row, on the shared card panel so the
 * dialog carries its own surface in both themes, full-screen on mobile. Clicking a card
 * navigates to the show's page; the search filters client-side over the loaded list.
 */
export function VideosCategoriesModal({ open, onOpenChange }: VideosCategoriesModalProps) {
    const { t } = useTranslation();
    const [search, setSearch] = useState("");
    const { data: shows = [] } = useShows();

    const term = search.trim().toLowerCase();
    const filtered = term ? shows.filter((show) => show.name.toLowerCase().includes(term)) : shows;

    return (
        <AdaptiveDialog.Root
            open={open}
            onOpenChange={onOpenChange}
        >
            <AdaptiveDialog.Content
                detent="large"
                className="gap-0 bg-card p-0 sm:max-h-[80vh] sm:max-w-lg sm:shadow-xl"
            >
                <AdaptiveDialog.Header
                    className="p-4 sm:p-4"
                    title={t("videos.browse.modal.title")}
                    closeLabel={t("videos.browse.modal.close")}
                />

                <div className="shrink-0 p-4 pb-2">
                    <SearchField.Root>
                        <SearchField.Icon />
                        <SearchField.Input
                            autoFocus
                            value={search}
                            onValueChange={setSearch}
                            onClear={() => setSearch("")}
                            placeholder={t("videos.browse.modal.searchPlaceholder")}
                        />
                    </SearchField.Root>
                </div>

                <ul className="flex flex-1 flex-col gap-2 overflow-y-auto p-4 pt-2">
                    {filtered.map((show) => (
                        <li key={show.id}>
                            <ShowCard.Horizontal
                                show={show}
                                onNavigate={() => onOpenChange(false)}
                            />
                        </li>
                    ))}
                    {filtered.length === 0 && (
                        <li>
                            <EmptyState
                                context="videos-categories-modal"
                                title={t("videos.browse.modal.empty")}
                                icon={<SearchIcon className="size-10" />}
                                className="min-h-0 bg-transparent p-6"
                            />
                        </li>
                    )}
                </ul>
            </AdaptiveDialog.Content>
        </AdaptiveDialog.Root>
    );
}
