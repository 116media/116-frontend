"use client";

import { useRef } from "react";

import { Badge } from "@/shared/presentation/components/ui/Badge";
import { Button } from "@/shared/presentation/components/ui/Button";
import { CheckIcon, TagsIcon } from "@/shared/presentation/components/ui/Icon";
import { SearchField } from "@/shared/presentation/components/ui/SearchField";
import { Sheet } from "@/shared/presentation/components/ui/Sheet";
import { useDismiss } from "@/shared/presentation/hooks/useDismiss";
import { useMediaQuery } from "@/shared/presentation/hooks/useMediaQuery";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";
import { formatCount } from "@/shared/presentation/utils/format/format.utils";

/**
 * The shape a tag needs to appear in the picker. Both the article and the video tag
 * entities satisfy it, which is what lets one picker serve both feeds.
 *
 * @interface TagPickerItem
 * @property {string} id - Stable identifier.
 * @property {string} name - Display name, rendered after a hash.
 * @property {string} slug - The value the surface filters by.
 * @property {number} [contentCount] - How much content carries the tag, when the listing says.
 */
export interface TagPickerItem {
    id: string;
    name: string;
    slug: string;
    contentCount?: number;
}

/**
 * Copy the picker shows. Each feed keys its own, so the words stay with the module.
 *
 * @interface TagPickerLabels
 * @property {string} trigger - The button that opens the picker.
 * @property {string} title - The sheet's title.
 * @property {string} close - Accessible label for the sheet's close control.
 * @property {string} searchPlaceholder - Placeholder of the search field.
 * @property {string} clearSearch - Accessible label for the clear-search control.
 * @property {string} empty - Shown when no tag matches the search.
 */
export interface TagPickerLabels {
    trigger: string;
    title: string;
    close: string;
    searchPlaceholder: string;
    clearSearch: string;
    empty: string;
}

/**
 * Props for TagPicker.
 *
 * @interface TagPickerProps
 * @property {TagPickerItem[]} tags - The tags to list.
 * @property {string | undefined} value - The active tag slug, or undefined.
 * @property {(tagSlug: string | undefined) => void} onChange - Emits the selected slug, or
 * undefined when the active tag is chosen again.
 * @property {boolean} open - Whether the picker is open.
 * @property {(open: boolean) => void} onOpenChange - Open-state setter.
 * @property {string} search - The current search term.
 * @property {(search: string) => void} onSearchChange - Emits the typed term.
 * @property {TagPickerLabels} labels - The copy to render.
 */
export interface TagPickerProps {
    tags: TagPickerItem[];
    value: string | undefined;
    onChange: (tagSlug: string | undefined) => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    search: string;
    onSearchChange: (search: string) => void;
    labels: TagPickerLabels;
}

/**
 * TagPicker
 *
 * @description
 * The tag filter shared by the article and video feeds: a trigger over a searchable list of
 * tags, each with how much content carries it. A phone opens the list as a bottom sheet,
 * wider screens as a dropdown dismissed on outside-click or Escape. Presentational: the
 * surface owns the open state, the search term and the query behind them.
 */
export function TagPicker({
    tags,
    value,
    onChange,
    open,
    onOpenChange,
    search,
    onSearchChange,
    labels
}: TagPickerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const isPhone = useMediaQuery("(max-width: 639px)");

    useDismiss(open && !isPhone, () => onOpenChange(false), containerRef);

    const select = (slug: string) => {
        onChange(slug === value ? undefined : slug);
        onOpenChange(false);
        onSearchChange("");
    };

    const searchField = (
        <SearchField.Root>
            <SearchField.Icon />
            <SearchField.Input
                value={search}
                autoFocus={!isPhone}
                onValueChange={onSearchChange}
                placeholder={labels.searchPlaceholder}
                onClear={() => onSearchChange("")}
            />
            <SearchField.Clear
                hidden={!search}
                label={labels.clearSearch}
                onClear={() => onSearchChange("")}
            />
        </SearchField.Root>
    );

    const rows =
        tags.length > 0 ? (
            <ul className="flex flex-col gap-0.5">
                {tags.map((tag) => (
                    <li key={tag.slug}>
                        <button
                            type="button"
                            onClick={() => select(tag.slug)}
                            className={cn(
                                "flex w-full cursor-pointer items-center gap-2 rounded-md p-3 text-left",
                                "text-base transition-colors hover:bg-accent hover:text-accent-foreground sm:p-2 sm:text-sm",
                                tag.slug === value && "bg-accent/50"
                            )}
                        >
                            <span className="truncate">#{tag.name}</span>
                            {tag.slug === value && <CheckIcon className="size-4 shrink-0" />}
                            {tag.contentCount !== undefined && (
                                <Badge
                                    variant="muted"
                                    className="ml-auto shrink-0 tabular-nums"
                                >
                                    {formatCount(tag.contentCount)}
                                </Badge>
                            )}
                        </button>
                    </li>
                ))}
            </ul>
        ) : (
            <p className="p-3 text-center text-muted-foreground text-sm">{labels.empty}</p>
        );

    return (
        <div
            ref={containerRef}
            className="relative shrink-0"
        >
            <Button
                variant="outline"
                className="px-3 sm:px-4"
                onClick={() => onOpenChange(!open)}
            >
                <TagsIcon className="size-4" />
                {labels.trigger}
            </Button>

            {isPhone ? (
                <Sheet.Root
                    open={open}
                    onOpenChange={onOpenChange}
                >
                    <Sheet.Content detent="fit">
                        <Sheet.Header
                            title={labels.title}
                            closeLabel={labels.close}
                        >
                            {searchField}
                        </Sheet.Header>
                        <Sheet.Body>{rows}</Sheet.Body>
                    </Sheet.Content>
                </Sheet.Root>
            ) : (
                open && (
                    <div className="absolute right-0 z-20 mt-1 flex max-h-72 w-64 flex-col overflow-hidden rounded-base border bg-popover text-popover-foreground shadow-md">
                        <div className="shrink-0 p-2">{searchField}</div>
                        <div className="flex-1 overflow-y-auto p-1">{rows}</div>
                    </div>
                )
            )}
        </div>
    );
}
