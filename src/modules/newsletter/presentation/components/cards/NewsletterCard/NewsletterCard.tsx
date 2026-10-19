"use client";

import { useTranslation } from "react-i18next";

import { SubscribeNewsletterForm } from "@/modules/newsletter/presentation/components/forms/SubscribeNewsletterForm";
import { cn } from "@/shared/presentation/utils/cn/cn.utils";

/**
 * Props for the NewsletterCard component.
 *
 * @interface NewsletterCardProps
 * @property {string} [className] - Extra classes merged onto the card.
 * @property {string} [title] - What the card offers. Defaults to the newsletter pitch.
 * @property {string} [subtitle] - The supporting line under it.
 * @property {string} [submitLabel] - What the action is called.
 */
export interface NewsletterCardProps {
    className?: string;
    title?: string;
    subtitle?: string;
    submitLabel?: string;
}

/**
 * NewsletterCard
 *
 * @description
 * Sign-up card wrapping the subscribe form, with the pitch above it and the privacy line
 * below. The copy is overridable: a surface that collects the address to announce a
 * launch asks for that, and reaches the newsletter underneath it.
 */
export function NewsletterCard({ className, title, subtitle, submitLabel }: NewsletterCardProps) {
    const { t } = useTranslation();

    return (
        <section
            className={cn(
                "rounded-lg bg-surface-raised border border-foreground/5 p-6 lg:px-12 lg:py-8",
                className
            )}
        >
            <h2 className="text-balance text-center font-bold text-2xl text-foreground">
                {title ?? t("newsletter.card.title")}
            </h2>
            <p className="mt-3 mb-6 text-balance text-center text-muted-foreground text-sm">
                {subtitle ?? t("newsletter.card.subtitle")}
            </p>

            <SubscribeNewsletterForm submitLabel={submitLabel} />

            <p className="mt-6 text-center text-muted-foreground text-xs">
                {t("newsletter.card.privacy")}
            </p>
        </section>
    );
}
