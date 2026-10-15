"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useSubscribeNewsletter } from "@/modules/newsletter/presentation/hooks/useSubscribeNewsletter";
import type { ISubscribeNewsletterCredentials } from "@/modules/newsletter/presentation/model/ISubscribeNewsletterCredentials";
import { subscribeNewsletterSchema } from "@/modules/newsletter/presentation/validation/subscribenewsletter.schema";
import { Alert } from "@/shared/presentation/components/ui/Alert";
import { Button } from "@/shared/presentation/components/ui/Button";
import { FloatingField } from "@/shared/presentation/components/ui/FloatingField";

/**
 * SubscribeNewsletterForm
 *
 * @description
 * Collects an email and requests a newsletter subscription. The API answers with a
 * confirmation mail, so the success toast tells the reader to check their inbox.
 */
export function SubscribeNewsletterForm() {
    const { t } = useTranslation();
    const { mutate, error, isPending } = useSubscribeNewsletter();

    const form = useForm<ISubscribeNewsletterCredentials>({
        resolver: zodResolver(subscribeNewsletterSchema),
        defaultValues: { email: "" }
    });

    const onSubmit = form.handleSubmit((values) => {
        mutate(values, { onSuccess: () => form.reset() });
    });

    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col gap-4"
        >
            {error && <Alert error={error} />}

            <FloatingField
                required
                type="email"
                id="newsletter-email"
                autoComplete="email"
                label={t("newsletter.card.emailLabel")}
                error={form.formState.errors.email?.message}
                {...form.register("email")}
            />

            <Button
                type="submit"
                loading={isPending}
                className="h-12 self-center px-8 font-bold text-base"
            >
                {t("newsletter.card.submit")}
            </Button>
        </form>
    );
}
