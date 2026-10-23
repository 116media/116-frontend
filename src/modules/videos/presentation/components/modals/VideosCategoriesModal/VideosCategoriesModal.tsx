"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ShowCard } from "@/modules/videos/presentation/components/cards/ShowCard";
import { useShows } from "@/modules/videos/presentation/hooks/useShows";
import {
    DialogCloseButton,
    DialogHeader,
    DialogTitle
} from "@/shared/presentation/components/ui/Dialog";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { SearchIcon } from "@/shared/presentation/components/ui/Icon";
import { Input } from "@/shared/presentation/components/ui/Input";
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
                <DialogHeader className="flex-row items-center justify-between gap-3 border-b p-4">
                    <DialogTitle>{t("videos.browse.modal.title")}</DialogTitle>
                    <DialogCloseButton label={t("videos.browse.modal.close")} />
                </DialogHeader>

                <div className="relative shrink-0 p-4 pb-2">
                    <SearchIcon className="-translate-y-1/2 absolute top-[calc(50%+4px)] left-7 size-4 text-muted-foreground" />
                    <Input
                        autoFocus
                        value={search}
                        className="h-10 bg-muted pl-9 dark:bg-muted"
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder={t("videos.browse.modal.searchPlaceholder")}
                    />
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
