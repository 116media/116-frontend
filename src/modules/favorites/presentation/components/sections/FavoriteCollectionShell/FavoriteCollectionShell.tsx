"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { useAuthModal } from "@/modules/auth/presentation/context/AuthModalProvider";
import { useAuth } from "@/modules/auth/presentation/context/AuthProvider";
import { Button } from "@/shared/presentation/components/ui/Button";
import { EmptyState } from "@/shared/presentation/components/ui/EmptyState";
import { LockIcon } from "@/shared/presentation/components/ui/Icon";
import { SectionHeader } from "@/shared/presentation/components/ui/SectionHeader";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";

/**
 * Props for FavoriteCollectionShell.
 *
 * @interface FavoriteCollectionShellProps
 * @property {string} context - Identifier for the guest empty-state, e.g. "favorites-articles".
 * @property {ReactNode} icon - The route's leading header icon.
 * @property {string} headingKey - i18n key for the page heading.
 * @property {string} subtitleKey - i18n key for the page subtitle.
 * @property {ReactNode} skeleton - Placeholder shown while the auth session resolves.
 * @property {ReactNode} children - The tabs and active island, rendered once authenticated.
 */
export interface FavoriteCollectionShellProps {
    context: string;
    icon: ReactNode;
    headingKey: string;
    subtitleKey: string;
    skeleton: ReactNode;
    children: ReactNode;
}

/**
 * FavoriteCollectionShell
 *
 * @description
 * Shared heading + auth gate for the favorites route containers: shows the skeleton while
 * the session resolves, a login prompt (opening the auth modal) for guests, and the
 * container's children once authenticated. There is no logged-out flash.
 */
export function FavoriteCollectionShell({
    context,
    icon,
    headingKey,
    subtitleKey,
    skeleton,
    children
}: FavoriteCollectionShellProps) {
    const { t } = useTranslation();
    const { status, isAuthenticated } = useAuth();
    const { open } = useAuthModal();

    return (
        <div>
            <SectionHeader
                as="h1"
                icon={icon}
                title={t(headingKey)}
                subtitle={t(subtitleKey)}
            />
            <div className="flex flex-col gap-6 rounded-lg border p-4">
                <StateRenderer
                    loading={status === "loading"}
                    data={isAuthenticated ? true : null}
                    skeleton={skeleton}
                    empty={
                        <EmptyState
                            context={`${context}-guest`}
                            icon={<LockIcon className="size-10" />}
                            title={t("favorites.states.authentication.title")}
                            action={
                                <Button
                                    variant="outline"
                                    onClick={() => open("login")}
                                >
                                    {t("favorites.states.authentication.cta")}
                                </Button>
                            }
                        />
                    }
                    render={() => children}
                />
            </div>
        </div>
    );
}
