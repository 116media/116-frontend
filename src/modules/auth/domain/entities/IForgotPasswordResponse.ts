import type { IActionResponse } from "@/shared/domain/types/action.response";

/**
 * IForgotPasswordResponse
 *
 * @description
 * Response from a forgot-password request. Carries the email so the reset view can
 * pre-fill it.
 *
 * @interface IForgotPasswordResponse
 * @extends {IActionResponse}
 * @property {string} email - The email the recovery code was sent to.
 */
export interface IForgotPasswordResponse extends IActionResponse {
    email: string;
}
