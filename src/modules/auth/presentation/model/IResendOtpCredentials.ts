import type { EOtpPurpose } from "@/modules/auth/domain/enums/EOtpPurpose";

/**
 * IResendOtpCredentials
 *
 * @description Presentation-layer input for requesting a new OTP.
 * @interface IResendOtpCredentials
 * @property {string} email - Recipient email.
 * @property {EOtpPurpose} purpose - Why the OTP is being resent.
 */
export interface IResendOtpCredentials {
    email: string;
    purpose: EOtpPurpose;
}
