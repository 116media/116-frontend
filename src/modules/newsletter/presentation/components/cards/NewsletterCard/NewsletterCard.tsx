"use client";

import { useTranslation } from "react-i18next";

import { SubscribeNewsletterForm } from "@/modules/newsletter/presentation/components/forms/SubscribeNewsletterForm";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for the NewsletterCard component.
 *
 * @interface NewsletterCardProps
 * @property {string} [className] - Extra classes merged onto the card.
 */
export interface NewsletterCardProps {
    className?: string;
}

/**
 * NewsletterCard
 *
 * @description
 * Sign-up card wrapping the subscribe form in the top banner's gradient at low
 * opacity, with the pitch above it and the privacy line below.
 */
export function NewsletterCard({ className }: NewsletterCardProps) {
    const { t } = useTranslation();

    return (
        <section
            className={cn(
                "rounded-lg bg-surface-raised border border-foreground/5 p-6 lg:px-12 lg:py-8",
                className
            )}
        >
            <h2 className="text-balance text-center font-bold text-2xl text-foreground">
                {t("newsletter.card.title")}
            </h2>
            <p className="mt-3 mb-6 text-balance text-center text-muted-foreground text-sm">
                {t("newsletter.card.subtitle")}
            </p>

            <SubscribeNewsletterForm />

            <p className="mt-6 text-center text-muted-foreground text-xs">
                {t("newsletter.card.privacy")}
            </p>
        </section>
    );
}
