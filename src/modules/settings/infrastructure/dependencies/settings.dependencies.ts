import type { AwilixContainer } from "awilix";
import { asClass } from "awilix";

import { ChangePasswordUseCase } from "@/modules/settings/application/usecases/changepassword.usecase";
import { GetProfileUseCase } from "@/modules/settings/application/usecases/getprofile.usecase";
import { UpdateAccountUseCase } from "@/modules/settings/application/usecases/updateaccount.usecase";
import { UpdateAvatarUseCase } from "@/modules/settings/application/usecases/updateavatar.usecase";
import { SettingsRepositoryImpl } from "@/modules/settings/infrastructure/repositories/settings.repository.impl";

/**
 * Registers settings module dependencies in the Awilix container.
 *
 * @description
 * Registers the settings repository as a singleton and the settings use cases as
 * transient. Called during application bootstrap in the service locator.
 *
 * @param container - The Awilix dependency injection container.
 */
export function registerSettingsDependencies(container: AwilixContainer): void {
    container.register({
        // Repository
        settingsRepository: asClass(SettingsRepositoryImpl).singleton(),

        // Use cases
        getProfileUseCase: asClass(GetProfileUseCase).transient(),
        updateAccountUseCase: asClass(UpdateAccountUseCase).transient(),
        updateAvatarUseCase: asClass(UpdateAvatarUseCase).transient(),
        changePasswordUseCase: asClass(ChangePasswordUseCase).transient()
    });
}
