"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useShows } from "@/modules/videos/presentation/hooks/useShows";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/shared/presentation/components/ui/Dialog";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { SearchIcon } from "@/shared/presentation/components/ui/Icon";
import { Input } from "@/shared/presentation/components/ui/Input";
import { ShowCard } from "@/modules/videos/presentation/components/cards/ShowCard";

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
 * show, each rendered as a `ShowCard.Horizontal` row. Clicking a
 * card navigates to the show's page; the search filters client-side over the
 * loaded list.
 */
export function VideosCategoriesModal({ open, onOpenChange }: VideosCategoriesModalProps) {
    const { t } = useTranslation();
    const [search, setSearch] = useState("");
    const { data: shows = [] } = useShows();

    const term = search.trim().toLowerCase();
    const filtered = term
        ? shows.filter((show) => show.name.toLowerCase().includes(term))
        : shows;

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="flex max-h-[80vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
                <DialogHeader className="border-b p-4">
                    <DialogTitle>{t("videos.browse.modal.title")}</DialogTitle>
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
            </DialogContent>
        </Dialog>
    );
}
