"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { ESearchScope, SEARCH_SCOPES } from "@/modules/search/domain/enums/ESearchScope";
import {
    MIN_SEARCH_TERM_LENGTH,
    SEARCH_DEBOUNCE_MS,
    SEARCH_OVERLAY_RESULTS
} from "@/modules/search/presentation/constants/searchKeys";
import { useRecentSearches } from "@/modules/search/presentation/hooks/useRecentSearches";
import { useSearchResults } from "@/modules/search/presentation/hooks/useSearchResults";
import { searchHref } from "@/modules/search/presentation/utils/search/search.utils";
import type { ICategoryTab } from "@/shared/presentation/components/navigation/CategoryTabs";
import { DialogOverlay, DialogPortal } from "@/shared/presentation/components/ui/Dialog";
import { ScrollFade } from "@/shared/presentation/components/ui/ScrollFade";
import { SheetHeader } from "@/shared/presentation/components/ui/Sheet/Sheet.Header";
import { useDebouncedValue } from "@/shared/presentation/hooks/useDebouncedValue";
import { useMediaQuery } from "@/shared/presentation/hooks/useMediaQuery";
import { useProgressRouter } from "@/shared/presentation/hooks/useProgressRouter";
import { PageContainer } from "@/shared/presentation/layouts/PageContainer";

import { SearchOverlayBody } from "./SearchOverlay.Body";
import { SearchOverlayField } from "./SearchOverlay.Field";

/**
 * Props for the SearchOverlay component.
 *
 * @interface SearchOverlayProps
 * @property {boolean} isOpen - Whether the overlay is showing.
 * @property {(open: boolean) => void} onOpenChange - Called when it should open or close.
 */
export interface SearchOverlayProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

/**
 * Zeroed counts, so the group headings render before the first response lands. The tabs
 * take the live tallies instead and carry no badge until there are real ones.
 */
const EMPTY_COUNTS: Record<ESearchScope, number> = {
    [ESearchScope.All]: 0,
    [ESearchScope.Articles]: 0,
    [ESearchScope.Videos]: 0,
    [ESearchScope.Shorts]: 0
};

/**
 * Where the panel sits. From `sm` up it is the mega menu's own surface: full width under
 * the header, the same ground, border, shadow and slide, and no scrim, so opening search
 * reads as the same gesture as opening NEWS or VIDEOS. It hangs off the pinned header
 * height rather than the live one, so it covers the header's own search trigger instead
 * of stacking a second field under it. Below `sm` it docks to the bottom edge, where a
 * thumb reaches it and the keyboard opens beneath rather than over it.
 */
const PANEL = [
    "fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col overflow-hidden rounded-t-2xl border-t bg-background pb-[max(1.5rem,env(safe-area-inset-bottom))]",
    "data-[state=open]:animate-sheet-in-bottom data-[state=closed]:animate-sheet-out-bottom",
    "sm:top-(--site-header-height-pinned) sm:bottom-auto sm:max-h-[min(70dvh,40rem)] sm:rounded-none sm:border-t-0",
    "sm:border-b sm:pb-8 sm:shadow-lg",
    "sm:data-[state=open]:animate-mega-menu-slide-down sm:data-[state=closed]:animate-mega-menu-slide-up"
].join(" ");

/**
 * SearchOverlay
 *
 * @description
 * The search surface: a panel dropping from under the header on pointer screens and a
 * bottom sheet on phones. Typing filters the results inside it, debounced, so a reader
 * who only wanted the top hit never leaves the page they were on. Leaving for the full
 * results route is deliberate — Enter, or the submit button in the field — and only then
 * is the term recorded, so a term that found nothing never enters the reader's history.
 */
export function SearchOverlay({ isOpen, onOpenChange }: SearchOverlayProps) {
    const { t } = useTranslation();
    const router = useProgressRouter();
    const { recent, remember, clear } = useRecentSearches();
    const [term, setTerm] = useState("");
    const [scope, setScope] = useState(ESearchScope.All);

    // A sheet owns the screen and traps focus; a mega menu does not, so a click on
    // another control both closes this and reaches that control.
    const isSheet = !useMediaQuery("(min-width: 40rem)");

    const settled = useDebouncedValue(term.trim(), SEARCH_DEBOUNCE_MS);
    const isQueryable = settled.length >= MIN_SEARCH_TERM_LENGTH;
    const { data, isLoading, isError } = useSearchResults(settled, scope);

    useEffect(() => {
        if (!isOpen) {
            setTerm("");
            setScope(ESearchScope.All);
        }
    }, [isOpen]);

    const go = (value: string) => {
        const trimmed = value.trim();
        if (trimmed.length < MIN_SEARCH_TERM_LENGTH) return;

        remember(trimmed);
        onOpenChange(false);
        router.push(searchHref(trimmed));
    };

    const hits = data?.items.slice(0, SEARCH_OVERLAY_RESULTS) ?? [];
    const tallies = data?.counts;
    const counts = tallies ?? EMPTY_COUNTS;
    const total = counts[scope] ?? 0;

    const scopeTabs = useMemo<ICategoryTab[]>(
        () =>
            SEARCH_SCOPES.filter((candidate) => candidate !== ESearchScope.All).map(
                (candidate) => ({
                    id: candidate,
                    count: tallies?.[candidate],
                    name: t(`search.scope.${candidate}`)
                })
            ),
        [tallies, t]
    );

    return (
        <DialogPrimitive.Root
            open={isOpen}
            modal={isSheet}
            onOpenChange={onOpenChange}
        >
            <DialogPortal>
                <DialogOverlay className="sm:hidden" />
                <DialogPrimitive.Content className={PANEL}>
                    <SheetHeader
                        align="start"
                        className="sm:hidden"
                        title={t("search.field.label")}
                        closeLabel={t("search.field.close")}
                    />
                    <DialogPrimitive.Title className="sr-only max-sm:hidden">
                        {t("search.field.label")}
                    </DialogPrimitive.Title>

                    <PageContainer className="shrink-0 pt-4 sm:pt-6">
                        <SearchOverlayField
                            value={term}
                            onValueChange={setTerm}
                            onSubmit={() => go(term)}
                        />
                    </PageContainer>

                    <ScrollFade
                        hint={t("search.overlay.scroll")}
                        className="pt-5 pb-2"
                    >
                        <SearchOverlayBody
                            hits={hits}
                            scope={scope}
                            total={total}
                            counts={counts}
                            recent={recent}
                            query={settled}
                            isError={isError}
                            onClearRecent={clear}
                            isLoading={isLoading}
                            scopeTabs={scopeTabs}
                            onScopeChange={setScope}
                            isQueryable={isQueryable}
                            onSeeAll={() => go(settled)}
                            onNavigate={() => onOpenChange(false)}
                        />
                    </ScrollFade>
                </DialogPrimitive.Content>
            </DialogPortal>
        </DialogPrimitive.Root>
    );
}
