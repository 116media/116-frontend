"use client";

import { useTranslation } from "react-i18next";

import { useArticleCategories } from "@/modules/articles/presentation/hooks/useArticleCategories";
import { Button } from "@/shared/presentation/components/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/shared/presentation/components/ui/DropdownMenu";
import { ChevronDownIcon, FilterIcon } from "@/shared/presentation/components/ui/Icon";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for ArticlesToolbarCategorySelect.
 *
 * @interface ArticlesToolbarCategorySelectProps
 * @property {string | undefined} value - The selected category id, or undefined for all.
 * @property {(categoryId: string | undefined) => void} onChange - Emits the category id.
 */
export interface ArticlesToolbarCategorySelectProps {
    value: string | undefined;
    onChange: (categoryId: string | undefined) => void;
}

/**
 * ArticlesToolbarCategorySelect
 *
 * @description
 * Single-select category filter for the article feed. Lists the active categories from
 * {@link useArticleCategories} with an "All categories" default that clears the filter.
 */
export function ArticlesToolbarCategorySelect({
    value,
    onChange
}: ArticlesToolbarCategorySelectProps) {
    const { t } = useTranslation();
    const { data: categories = [] } = useArticleCategories();
    const selected = categories.find((category) => category.id === value);
    const isActive = Boolean(value);
    const selectedCount = isActive ? 1 : 0;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "h-10 w-full justify-between gap-2 font-medium sm:w-auto",
                        isActive
                            ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                            : "border-transparent bg-muted text-foreground hover:bg-muted/80"
                    )}
                >
                    <span className="flex items-center gap-2 truncate">
                        <FilterIcon
                            className={cn(
                                "size-4 shrink-0",
                                isActive ? "text-primary-foreground" : "text-primary"
                            )}
                        />
                        <span className="truncate">
                            {selected?.name ?? t("articles.filters.allCategories")}
                        </span>
                        {selectedCount > 0 && (
                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-foreground font-semibold text-primary text-xs">
                                {selectedCount}
                            </span>
                        )}
                    </span>
                    <ChevronDownIcon className="size-4 shrink-0 opacity-70" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="start"
                className="max-h-72 w-56 overflow-y-auto p-2"
            >
                <DropdownMenuItem
                    className="p-2"
                    onSelect={() => onChange(undefined)}
                >
                    {t("articles.filters.allCategories")}
                </DropdownMenuItem>
                {categories.map((category) => (
                    <DropdownMenuItem
                        key={category.id}
                        className="p-2"
                        onSelect={() => onChange(category.id)}
                    >
                        {category.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
