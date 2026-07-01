import type { AwilixContainer } from "awilix";
import { asClass } from "awilix";

import { ForgotPasswordUseCase } from "@/modules/auth/application/usecases/forgotpassword.usecase";
import { LoginUseCase } from "@/modules/auth/application/usecases/login.usecase";
import { ResendOtpUseCase } from "@/modules/auth/application/usecases/resendotp.usecase";
import { ResetPasswordUseCase } from "@/modules/auth/application/usecases/resetpassword.usecase";
import { SignOutUseCase } from "@/modules/auth/application/usecases/signout.usecase";
import { SignOutAllUseCase } from "@/modules/auth/application/usecases/signoutall.usecase";
import { SignupUseCase } from "@/modules/auth/application/usecases/signup.usecase";
import { SocialLoginUseCase } from "@/modules/auth/application/usecases/sociallogin.usecase";
import { VerifyOtpUseCase } from "@/modules/auth/application/usecases/verifyotp.usecase";
import { AuthRepositoryImpl } from "@/modules/auth/infrastructure/repositories/auth.repository.impl";

/**
 * Registers auth module dependencies in the Awilix container.
 *
 * @description
 * Registers the auth repository as a singleton and every auth use case as
 * transient. Called during application bootstrap in the service locator.
 *
 * @param container - The Awilix dependency injection container.
 */
export function registerAuthDependencies(container: AwilixContainer): void {
    container.register({
        // Repository
        authRepository: asClass(AuthRepositoryImpl).singleton(),

        // Use cases
        loginUseCase: asClass(LoginUseCase).transient(),
        socialLoginUseCase: asClass(SocialLoginUseCase).transient(),
        signupUseCase: asClass(SignupUseCase).transient(),
        verifyOtpUseCase: asClass(VerifyOtpUseCase).transient(),
        resendOtpUseCase: asClass(ResendOtpUseCase).transient(),
        forgotPasswordUseCase: asClass(ForgotPasswordUseCase).transient(),
        resetPasswordUseCase: asClass(ResetPasswordUseCase).transient(),
        signOutUseCase: asClass(SignOutUseCase).transient(),
        signOutAllUseCase: asClass(SignOutAllUseCase).transient()
    });
}
