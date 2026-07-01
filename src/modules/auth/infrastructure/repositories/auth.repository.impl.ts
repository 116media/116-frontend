import type { IAuthRepositoryPort } from "@/modules/auth/application/repositories/auth.repository.port";
import type { IAuthResponse } from "@/modules/auth/domain/entities/IAuthResponse";
import type { IForgotPasswordResponse } from "@/modules/auth/domain/entities/IForgotPasswordResponse";
import type { IResendOtpResponse } from "@/modules/auth/domain/entities/IResendOtpResponse";
import type { IResetPasswordResponse } from "@/modules/auth/domain/entities/IResetPasswordResponse";
import type { ISignOutAllResponse } from "@/modules/auth/domain/entities/ISignOutAllResponse";
import type { ISignOutResponse } from "@/modules/auth/domain/entities/ISignOutResponse";
import type { IVerifyOtpResponse } from "@/modules/auth/domain/entities/IVerifyOtpResponse";
import { AuthMapper } from "@/modules/auth/infrastructure/mappers/auth.mapper";
import type { IForgotPasswordCredentials } from "@/modules/auth/presentation/model/IForgotPasswordCredentials";
import type { ILoginCredentials } from "@/modules/auth/presentation/model/ILoginCredentials";
import type { IResendOtpCredentials } from "@/modules/auth/presentation/model/IResendOtpCredentials";
import type { IResetPasswordCredentials } from "@/modules/auth/presentation/model/IResetPasswordCredentials";
import type { ISignupCredentials } from "@/modules/auth/presentation/model/ISignupCredentials";
import type { ISocialLoginCredentials } from "@/modules/auth/presentation/model/ISocialLoginCredentials";
import type { IVerifyOtpCredentials } from "@/modules/auth/presentation/model/IVerifyOtpCredentials";
import { err, ok, type Result } from "@/shared/domain/results/result";
import type { Api } from "@/shared/infrastructure/api/generated/116.api";
import { ProblemMapper } from "@/shared/infrastructure/mappers/problem.mapper";

/**
 * AuthRepositoryImpl
 *
 * @description
 * Implements `IAuthRepositoryPort` against the generated API client. Each method
 * calls the matching `publicX` endpoint, maps the DTO to a domain entity, and
 * funnels any error through `ProblemMapper.toFailure` into `Result.err`.
 */
export class AuthRepositoryImpl implements IAuthRepositoryPort {
    private readonly api: Api<unknown>["api"];

    constructor({ client }: { client: Api<unknown> }) {
        this.api = client.api;
    }

    async login(input: ILoginCredentials): Promise<Result<IAuthResponse>> {
        try {
            const response = await this.api.publicLogin(input);
            return ok(AuthMapper.authResponseFromDto(response.data));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async socialLogin(input: ISocialLoginCredentials): Promise<Result<IAuthResponse>> {
        try {
            const response = await this.api.publicSocialLogin(input);
            return ok(AuthMapper.authResponseFromDto(response.data));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async signup(input: ISignupCredentials): Promise<Result<IAuthResponse>> {
        try {
            const response = await this.api.publicSignUp(input);
            return ok(AuthMapper.authResponseFromDto(response.data));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async verifyOtp(input: IVerifyOtpCredentials): Promise<Result<IVerifyOtpResponse>> {
        try {
            const response = await this.api.publicVerifyOtp(input);
            return ok(AuthMapper.actionFromDto(response.data));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async resendOtp(input: IResendOtpCredentials): Promise<Result<IResendOtpResponse>> {
        try {
            const response = await this.api.publicResendOtp(input);
            return ok(AuthMapper.actionFromDto(response.data));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async forgotPassword(
        input: IForgotPasswordCredentials
    ): Promise<Result<IForgotPasswordResponse>> {
        try {
            const response = await this.api.publicForgotPassword(input);
            return ok(AuthMapper.forgotPasswordResponseFromDto(response.data));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async resetPassword(input: IResetPasswordCredentials): Promise<Result<IResetPasswordResponse>> {
        try {
            const response = await this.api.publicResetPassword(input);
            return ok(AuthMapper.actionFromDto(response.data));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async signOut(): Promise<Result<ISignOutResponse>> {
        try {
            const response = await this.api.publicSignOut({});
            return ok(AuthMapper.actionFromDto(response.data));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async signOutAll(): Promise<Result<ISignOutAllResponse>> {
        try {
            const response = await this.api.publicSignOutFromAllDevices();
            return ok(AuthMapper.actionFromDto(response.data));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }
}
