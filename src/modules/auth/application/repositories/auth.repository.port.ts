import type { IAuthResponse } from "@/modules/auth/domain/entities/IAuthResponse";
import type { IForgotPasswordResponse } from "@/modules/auth/domain/entities/IForgotPasswordResponse";
import type { IResendOtpResponse } from "@/modules/auth/domain/entities/IResendOtpResponse";
import type { IResetPasswordResponse } from "@/modules/auth/domain/entities/IResetPasswordResponse";
import type { ISignOutAllResponse } from "@/modules/auth/domain/entities/ISignOutAllResponse";
import type { ISignOutResponse } from "@/modules/auth/domain/entities/ISignOutResponse";
import type { IVerifyOtpResponse } from "@/modules/auth/domain/entities/IVerifyOtpResponse";
import type { IForgotPasswordCredentials } from "@/modules/auth/presentation/model/IForgotPasswordCredentials";
import type { ILoginCredentials } from "@/modules/auth/presentation/model/ILoginCredentials";
import type { IResendOtpCredentials } from "@/modules/auth/presentation/model/IResendOtpCredentials";
import type { IResetPasswordCredentials } from "@/modules/auth/presentation/model/IResetPasswordCredentials";
import type { ISignupCredentials } from "@/modules/auth/presentation/model/ISignupCredentials";
import type { ISocialLoginCredentials } from "@/modules/auth/presentation/model/ISocialLoginCredentials";
import type { IVerifyOtpCredentials } from "@/modules/auth/presentation/model/IVerifyOtpCredentials";
import type { Result } from "@/shared/domain/results/result";

/**
 * Repository port (interface) for authentication operations.
 *
 * @description
 * Defines the contract for authentication data access (login/signup, OTP, password
 * recovery, sign-out). Profile and password-change belong to the settings module.
 * All methods return `Result<T>` — errors are typed `Failure` values, never thrown.
 *
 * @interface IAuthRepositoryPort
 */
export interface IAuthRepositoryPort {
    /**
     * Authenticates a user with credentials (email or username) and password.
     *
     * @param credentials - Email/username + password
     * @returns `ok(IAuthResponse)` on success, `err(Failure)` on failure
     */
    login(credentials: ILoginCredentials): Promise<Result<IAuthResponse>>;

    /**
     * Authenticates a user via a social provider (Google/Facebook).
     *
     * @param credentials - The provider's profile (email/userName/avatar) + provider
     * @returns `ok(IAuthResponse)` on success, `err(Failure)` on failure
     */
    socialLogin(credentials: ISocialLoginCredentials): Promise<Result<IAuthResponse>>;

    /**
     * Registers a new account (returned unverified, pending email verification).
     *
     * @param credentials - Email, username, and password
     * @returns `ok(IAuthResponse)` on success, `err(Failure)` on failure
     */
    signup(credentials: ISignupCredentials): Promise<Result<IAuthResponse>>;

    /**
     * Verifies an OTP code for a given purpose (email verification, password reset).
     *
     * @param credentials - Email, OTP code, and purpose
     * @returns `ok(IVerifyOtpResponse)` on success, `err(Failure)` on failure
     */
    verifyOtp(credentials: IVerifyOtpCredentials): Promise<Result<IVerifyOtpResponse>>;

    /**
     * Resends a new OTP code for a given purpose.
     *
     * @param credentials - Email and purpose
     * @returns `ok(IResendOtpResponse)` on success, `err(Failure)` on failure
     */
    resendOtp(credentials: IResendOtpCredentials): Promise<Result<IResendOtpResponse>>;

    /**
     * Initiates password recovery by sending an OTP to the user's email.
     *
     * @param credentials - Account email
     * @returns `ok(IForgotPasswordResponse)` on success, `err(Failure)` on failure
     */
    forgotPassword(
        credentials: IForgotPasswordCredentials
    ): Promise<Result<IForgotPasswordResponse>>;

    /**
     * Sets a new password using the recovery OTP.
     *
     * @param credentials - Email, OTP code, and new password
     * @returns `ok(IResetPasswordResponse)` on success, `err(Failure)` on failure
     */
    resetPassword(credentials: IResetPasswordCredentials): Promise<Result<IResetPasswordResponse>>;

    /**
     * Signs out the current session. The backend expires the cookies.
     *
     * @returns `ok(ISignOutResponse)` on success, `err(Failure)` on failure
     */
    signOut(): Promise<Result<ISignOutResponse>>;

    /**
     * Signs out from all devices.
     *
     * @returns `ok(ISignOutAllResponse)` on success, `err(Failure)` on failure
     */
    signOutAll(): Promise<Result<ISignOutAllResponse>>;
}
