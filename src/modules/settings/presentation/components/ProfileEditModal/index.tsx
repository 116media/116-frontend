"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { z } from "zod";

import type { IProfile } from "@/modules/settings/domain/entities/IProfile";
import { useUpdateProfile } from "@/modules/settings/presentation/hooks/useUpdateProfile";
import { SettingsNotification } from "@/modules/settings/presentation/notifications/settings.notification";
import { profileSchema } from "@/modules/settings/presentation/validation/profile.schema";
import { Alert } from "@/shared/presentation/components/ui/Alert";
import { Button } from "@/shared/presentation/components/ui/Button";
import { CountrySelect } from "@/shared/presentation/components/ui/CountrySelect";
import { Dialog, DialogContent, DialogTitle } from "@/shared/presentation/components/ui/Dialog";
import { FloatingField } from "@/shared/presentation/components/ui/FloatingField";
import { useDetectedCountry } from "@/shared/presentation/hooks/useDetectedCountry";
import { findCountryByName } from "@/shared/presentation/utils/country";
import { showNotification } from "@/shared/presentation/utils/notification";

/**
 * The profile edit form values — username, country name, and optional phone.
 */
type ProfileFormValues = z.infer<typeof profileSchema>;

/**
 * Props for the ProfileEditModal component.
 *
 * @interface ProfileEditModalProps
 * @property {boolean} open - Whether the modal is open (controlled).
 * @property {(open: boolean) => void} onOpenChange - Open-state setter.
 * @property {IProfile} user - The current user, used to prefill the form.
 */
export interface ProfileEditModalProps {
    open: boolean;
    user: IProfile;
    onOpenChange: (open: boolean) => void;
}

/**
 * ProfileEditModal
 *
 * @description
 * Edits the current user's account information — username, country, and phone —
 * mirroring the dashboard's account-info modal. Email is shown read-only. The country
 * picker emits a country name from which the ISO and dial codes are derived; the phone
 * field shows the selected country's dial code as a static prefix and stores only the
 * local number. Prefilled from the current user and validated by `profileSchema`. On
 * submit the partial update is sent via `useUpdateProfile`, which writes the updated
 * user into the `me` cache; on success a toast shows and the modal closes. A backend
 * `Failure` renders in the top `Alert`.
 *
 * @param open - Whether the modal is open.
 * @param onOpenChange - Open-state setter.
 * @param user - The current user, used to prefill the form.
 */
export function ProfileEditModal({ open, onOpenChange, user }: ProfileEditModalProps) {
    const { t } = useTranslation();
    const { mutate, error, isPending } = useUpdateProfile();
    const { country: detectedCountry } = useDetectedCountry();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        resetOptions: { keepDirtyValues: true },
        values: {
            userName: user.userName,
            countryName: user.countryName ?? detectedCountry?.name ?? "",
            partialPhoneNumber: user.partialPhoneNumber ?? ""
        }
    });

    const selectedCountry = findCountryByName(form.watch("countryName"));

    const onSubmit = form.handleSubmit((values) => {
        const country = findCountryByName(values.countryName);
        mutate(
            {
                userName: values.userName,
                countryName: values.countryName,
                countryIsoCode: country?.isoCode,
                countryDialCode: country?.dialCode,
                partialPhoneNumber: values.partialPhoneNumber?.trim() || undefined
            },
            {
                onSuccess: () => {
                    showNotification(SettingsNotification.profileUpdated());
                    onOpenChange(false);
                }
            }
        );
    });

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent aria-describedby={undefined}>
                <form
                    onSubmit={onSubmit}
                    className="relative grid gap-5 rounded-2xl border border-border bg-card p-6 shadow-xl"
                >
                    <DialogTitle>{t("settings.profile.edit.title")}</DialogTitle>

                    {error && <Alert error={error} />}

                    <FloatingField
                        disabled
                        id="edit-email"
                        defaultValue={user.email ?? ""}
                        label={t("settings.profile.edit.email")}
                    />

                    <FloatingField
                        required
                        id="edit-userName"
                        autoComplete="username"
                        label={t("settings.profile.edit.userName")}
                        error={form.formState.errors.userName?.message}
                        {...form.register("userName")}
                    />

                    <Controller
                        name="countryName"
                        control={form.control}
                        render={({ field }) => (
                            <CountrySelect
                                required
                                id="edit-country"
                                value={field.value}
                                onChange={field.onChange}
                                label={t("settings.profile.edit.country")}
                                placeholder={t("settings.profile.edit.countryPlaceholder")}
                                error={form.formState.errors.countryName?.message}
                            />
                        )}
                    />

                    <FloatingField
                        id="edit-phone"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        label={t("settings.profile.edit.phone")}
                        prefix={selectedCountry?.dialCode ?? "—"}
                        error={form.formState.errors.partialPhoneNumber?.message}
                        {...form.register("partialPhoneNumber")}
                    />

                    <div className="flex justify-between w-full">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isPending}
                            onClick={() => onOpenChange(false)}
                        >
                            {t("auth.common.cancel")}
                        </Button>
                        <Button
                            type="submit"
                            loading={isPending}
                        >
                            {t("settings.profile.edit.submit")}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
