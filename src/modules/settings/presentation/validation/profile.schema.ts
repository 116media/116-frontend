import { PhoneNumberUtil } from "google-libphonenumber";
import { z } from "zod";
import { i18n } from "@/shared/presentation/i18n/config";
import { findCountryByName } from "@/shared/presentation/utils/country";
import { Validators } from "@/shared/presentation/validation/validators";

/**
 * A well-formed international dial code, e.g. `+33`.
 */
const DIAL_CODE_PATTERN = /^\+\d{1,4}$/;

/**
 * A local phone number (no dial code): 2–13 digits, not starting with zero.
 */
const LOCAL_PHONE_PATTERN = /^[1-9]\d{1,12}$/;

/**
 * Shared libphonenumber instance used for region-aware phone validation.
 */
const phoneUtil = PhoneNumberUtil.getInstance();

/**
 * Profile edit form schema — username (2–50 chars), a required country, and an
 * optional phone. When a phone is entered it is validated against the selected
 * country's dial code (format check), matching the dashboard's account rules.
 */
export const profileSchema = z
    .object({
        userName: Validators.minMax("settings.profile.edit.userName", 2, 50),
        countryName: Validators.required("settings.profile.edit.country"),
        partialPhoneNumber: z.string().optional()
    })
    .superRefine((values, ctx) => {
        const phone = values.partialPhoneNumber?.trim();
        if (!phone) return;

        const country = findCountryByName(values.countryName);
        if (!country || !DIAL_CODE_PATTERN.test(country.dialCode)) {
            ctx.addIssue({
                code: "custom",
                path: ["partialPhoneNumber"],
                message: i18n.t("settings.profile.edit.selectCountryFirst")
            });
            return;
        }

        if (!LOCAL_PHONE_PATTERN.test(phone)) {
            ctx.addIssue({
                code: "custom",
                path: ["partialPhoneNumber"],
                message: i18n.t("settings.profile.edit.phoneInvalid")
            });
            return;
        }

        try {
            const parsed = phoneUtil.parse(`${country.dialCode}${phone}`, country.isoCode);
            if (!phoneUtil.isValidNumberForRegion(parsed, country.isoCode)) {
                ctx.addIssue({
                    code: "custom",
                    path: ["partialPhoneNumber"],
                    message: i18n.t("settings.profile.edit.phoneInvalidRegion")
                });
            }
        } catch {
            ctx.addIssue({
                code: "custom",
                path: ["partialPhoneNumber"],
                message: i18n.t("settings.profile.edit.phoneInvalid")
            });
        }
    });
