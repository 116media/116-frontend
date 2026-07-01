import type { EOtpPurpose } from "@/modules/auth/domain/enums/EOtpPurpose";

/**
 * IVerifyOtpCredentials
 *
 * @description Presentation-layer input for the OTP verification form / use case.
 * @interface IVerifyOtpCredentials
 * @property {string} email - Recipient email.
 * @property {string} code - 6-digit one-time code.
 * @property {EOtpPurpose} purpose - Why the OTP was issued.
 */
export interface IVerifyOtpCredentials {
    email: string;
    code: string;
    purpose: EOtpPurpose;
}
