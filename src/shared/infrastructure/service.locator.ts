import { asClass, asValue, createContainer, InjectionMode } from "awilix";
import type { IArticlesRepositoryPort } from "@/modules/articles/application/repositories/articles.repository.port";
import type { AddArticleCommentUseCase } from "@/modules/articles/application/usecases/addarticlecomment.usecase";
import type { BookmarkArticleUseCase } from "@/modules/articles/application/usecases/bookmarkarticle.usecase";
import type { GetAllTagsUseCase } from "@/modules/articles/application/usecases/getalltags.usecase";
import type { GetArticleBySlugUseCase } from "@/modules/articles/application/usecases/getarticlebyslug.usecase";
import type { GetArticleCategoriesUseCase } from "@/modules/articles/application/usecases/getarticlecategories.usecase";
import type { GetArticleCommentsUseCase } from "@/modules/articles/application/usecases/getarticlecomments.usecase";
import type { GetArticlePopularTagsUseCase } from "@/modules/articles/application/usecases/getarticlepopulartags.usecase";
import type { GetArticlePromotionFeedUseCase } from "@/modules/articles/application/usecases/getarticlepromotionfeed.usecase";
import type { GetPopularArticlesUseCase } from "@/modules/articles/application/usecases/getpopulararticles.usecase";
import type { GetPromotedArticlesUseCase } from "@/modules/articles/application/usecases/getpromotedarticles.usecase";
import type { GetPublishedArticlesUseCase } from "@/modules/articles/application/usecases/getpublishedarticles.usecase";
import type { LikeArticleUseCase } from "@/modules/articles/application/usecases/likearticle.usecase";
import type { ShareArticleUseCase } from "@/modules/articles/application/usecases/sharearticle.usecase";
import type { UnbookmarkArticleUseCase } from "@/modules/articles/application/usecases/unbookmarkarticle.usecase";
import type { UnlikeArticleUseCase } from "@/modules/articles/application/usecases/unlikearticle.usecase";
import { registerArticlesDependencies } from "@/modules/articles/infrastructure/dependencies/articles.dependencies";
import type { IAuthRepositoryPort } from "@/modules/auth/application/repositories/auth.repository.port";
import type { ForgotPasswordUseCase } from "@/modules/auth/application/usecases/forgotpassword.usecase";
import type { LoginUseCase } from "@/modules/auth/application/usecases/login.usecase";
import type { ResendOtpUseCase } from "@/modules/auth/application/usecases/resendotp.usecase";
import type { ResetPasswordUseCase } from "@/modules/auth/application/usecases/resetpassword.usecase";
import type { SignOutUseCase } from "@/modules/auth/application/usecases/signout.usecase";
import type { SignOutAllUseCase } from "@/modules/auth/application/usecases/signoutall.usecase";
import type { SignupUseCase } from "@/modules/auth/application/usecases/signup.usecase";
import type { SocialLoginUseCase } from "@/modules/auth/application/usecases/sociallogin.usecase";
import type { VerifyOtpUseCase } from "@/modules/auth/application/usecases/verifyotp.usecase";
import { registerAuthDependencies } from "@/modules/auth/infrastructure/dependencies/auth.dependencies";
import type { ISessionRepositoryPort } from "@/modules/session/application/repositories/session.repository.port";
import type { GetSessionsUseCase } from "@/modules/session/application/usecases/getsessions.usecase";
import type { RefreshTokenUseCase } from "@/modules/session/application/usecases/refresh-token.usecase";
import type { RevokeSessionUseCase } from "@/modules/session/application/usecases/revokesession.usecase";
import { registerSessionDependencies } from "@/modules/session/infrastructure/dependencies/session.dependencies";
import type { ISettingsRepositoryPort } from "@/modules/settings/application/repositories/settings.repository.port";
import type { ChangePasswordUseCase } from "@/modules/settings/application/usecases/changepassword.usecase";
import type { GetProfileUseCase } from "@/modules/settings/application/usecases/getprofile.usecase";
import type { UpdateAccountUseCase } from "@/modules/settings/application/usecases/updateaccount.usecase";
import type { UpdateAvatarUseCase } from "@/modules/settings/application/usecases/updateavatar.usecase";
import { registerSettingsDependencies } from "@/modules/settings/infrastructure/dependencies/settings.dependencies";
import type { IVideosRepositoryPort } from "@/modules/videos/application/repositories/videos.repository.port";
import type { AddVideoToPlaylistUseCase } from "@/modules/videos/application/usecases/addvideotoplaylist.usecase";
import type { CreatePlaylistUseCase } from "@/modules/videos/application/usecases/createplaylist.usecase";
import type { GetMyPlaylistsUseCase } from "@/modules/videos/application/usecases/getmyplaylists.usecase";
import type { GetPopularVideosUseCase } from "@/modules/videos/application/usecases/getpopularvideos.usecase";
import type { GetPromotedVideosUseCase } from "@/modules/videos/application/usecases/getpromotedvideos.usecase";
import type { GetPublishedVideosUseCase } from "@/modules/videos/application/usecases/getpublishedvideos.usecase";
import type { GetShowsUseCase } from "@/modules/videos/application/usecases/getshows.usecase";
import type { GetVideoBySlugUseCase } from "@/modules/videos/application/usecases/getvideobyslug.usecase";
import type { GetVideoCategoriesUseCase } from "@/modules/videos/application/usecases/getvideocategories.usecase";
import type { GetVideoExclusiveShowUseCase } from "@/modules/videos/application/usecases/getvideoexclusiveshow.usecase";
import type { GetVideoLyricsUseCase } from "@/modules/videos/application/usecases/getvideolyrics.usecase";
import type { GetVideoPopularTagsUseCase } from "@/modules/videos/application/usecases/getvideopopulartags.usecase";
import type { GetYoutubeVideoStatsUseCase } from "@/modules/videos/application/usecases/getyoutubevideostats.usecase";
import type { RateVideoUseCase } from "@/modules/videos/application/usecases/ratevideo.usecase";
import type { ShareVideoUseCase } from "@/modules/videos/application/usecases/sharevideo.usecase";
import { registerVideosDependencies } from "@/modules/videos/infrastructure/dependencies/videos.dependencies";
import type { IGeoRepositoryPort } from "@/shared/application/repositories/geo.repository.port";
import { DetectCountryUseCase } from "@/shared/application/usecases/detectcountry.usecase";
import { PrefetchNavigationUseCase } from "@/shared/application/usecases/prefetchnavigation.usecase";
import { apiClient } from "@/shared/infrastructure/api/client";
import type { Api } from "@/shared/infrastructure/api/generated/116.api";
import { GeoRepositoryImpl } from "@/shared/infrastructure/repositories/geo.repository.impl";

/**
 * Cradle type defining all dependencies available in the DI container.
 *
 * @interface Cradle
 *
 * @description
 * Maps registration names to their resolved types for full type-safe
 * access via `container.cradle`. Each property corresponds to a
 * registration in a per-module dependency file.
 */
export interface Cradle {
    // Shared API client — browser singleton injected into all repositories
    client: Api<unknown>;

    // Articles repository
    articlesRepository: IArticlesRepositoryPort;

    // Articles use cases
    getPromotedArticlesUseCase: GetPromotedArticlesUseCase;
    getArticleCategoriesUseCase: GetArticleCategoriesUseCase;
    getArticlePopularTagsUseCase: GetArticlePopularTagsUseCase;
    getArticlePromotionFeedUseCase: GetArticlePromotionFeedUseCase;
    getPublishedArticlesUseCase: GetPublishedArticlesUseCase;
    getAllTagsUseCase: GetAllTagsUseCase;
    getArticleBySlugUseCase: GetArticleBySlugUseCase;
    getArticleCommentsUseCase: GetArticleCommentsUseCase;
    getPopularArticlesUseCase: GetPopularArticlesUseCase;

    // Articles interaction use cases
    likeArticleUseCase: LikeArticleUseCase;
    unlikeArticleUseCase: UnlikeArticleUseCase;
    bookmarkArticleUseCase: BookmarkArticleUseCase;
    unbookmarkArticleUseCase: UnbookmarkArticleUseCase;
    shareArticleUseCase: ShareArticleUseCase;
    addArticleCommentUseCase: AddArticleCommentUseCase;

    // Videos repository
    videosRepository: IVideosRepositoryPort;

    // Videos use cases
    getPromotedVideosUseCase: GetPromotedVideosUseCase;
    getVideoCategoriesUseCase: GetVideoCategoriesUseCase;
    getShowsUseCase: GetShowsUseCase;
    getVideoPopularTagsUseCase: GetVideoPopularTagsUseCase;
    getVideoExclusiveShowUseCase: GetVideoExclusiveShowUseCase;
    getVideoBySlugUseCase: GetVideoBySlugUseCase;
    getPublishedVideosUseCase: GetPublishedVideosUseCase;
    getPopularVideosUseCase: GetPopularVideosUseCase;
    getVideoLyricsUseCase: GetVideoLyricsUseCase;
    getMyPlaylistsUseCase: GetMyPlaylistsUseCase;
    getYoutubeVideoStatsUseCase: GetYoutubeVideoStatsUseCase;

    // Videos interaction use cases
    rateVideoUseCase: RateVideoUseCase;
    shareVideoUseCase: ShareVideoUseCase;
    createPlaylistUseCase: CreatePlaylistUseCase;
    addVideoToPlaylistUseCase: AddVideoToPlaylistUseCase;

    // Shared repositories + use cases
    geoRepository: IGeoRepositoryPort;
    detectCountryUseCase: DetectCountryUseCase;
    prefetchNavigationUseCase: PrefetchNavigationUseCase;

    // Auth repository + use cases
    authRepository: IAuthRepositoryPort;
    loginUseCase: LoginUseCase;
    socialLoginUseCase: SocialLoginUseCase;
    signupUseCase: SignupUseCase;
    verifyOtpUseCase: VerifyOtpUseCase;
    resendOtpUseCase: ResendOtpUseCase;
    forgotPasswordUseCase: ForgotPasswordUseCase;
    resetPasswordUseCase: ResetPasswordUseCase;
    signOutUseCase: SignOutUseCase;
    signOutAllUseCase: SignOutAllUseCase;

    // Session repository + use cases
    sessionRepository: ISessionRepositoryPort;
    refreshTokenUseCase: RefreshTokenUseCase;
    getSessionsUseCase: GetSessionsUseCase;
    revokeSessionUseCase: RevokeSessionUseCase;

    // Settings repository + use cases
    settingsRepository: ISettingsRepositoryPort;
    getProfileUseCase: GetProfileUseCase;
    updateAccountUseCase: UpdateAccountUseCase;
    updateAvatarUseCase: UpdateAvatarUseCase;
    changePasswordUseCase: ChangePasswordUseCase;
}

/**
 * Awilix DI container — the composition root for the frontend.
 *
 * @description
 * Creates a single container with PROXY injection mode and strict lifetime
 * checks. Each feature module registers its own dependencies via a
 * dedicated registration function.
 */
const container = createContainer<Cradle>({
    injectionMode: InjectionMode.PROXY,
    strict: true
});

container.register({ client: asValue(apiClient) });

registerArticlesDependencies(container);
registerVideosDependencies(container);
registerAuthDependencies(container);
registerSessionDependencies(container);
registerSettingsDependencies(container);

// Shared repositories + use cases
container.register({
    geoRepository: asClass(GeoRepositoryImpl).singleton(),
    detectCountryUseCase: asClass(DetectCountryUseCase).transient(),
    prefetchNavigationUseCase: asClass(PrefetchNavigationUseCase).transient()
});

export default container;
