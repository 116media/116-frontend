import type { AwilixContainer } from "awilix";
import { asClass } from "awilix";
import { AddArticleCommentUseCase } from "@/modules/articles/application/usecases/addarticlecomment.usecase";
import { AddCommentReplyUseCase } from "@/modules/articles/application/usecases/addcommentreply.usecase";
import { BookmarkArticleUseCase } from "@/modules/articles/application/usecases/bookmarkarticle.usecase";
import { DeleteArticleCommentUseCase } from "@/modules/articles/application/usecases/deletearticlecomment.usecase";
import { EditArticleCommentUseCase } from "@/modules/articles/application/usecases/editarticlecomment.usecase";
import { GetAllTagsUseCase } from "@/modules/articles/application/usecases/getalltags.usecase";
import { GetArticleBySlugUseCase } from "@/modules/articles/application/usecases/getarticlebyslug.usecase";
import { GetArticleCategoriesUseCase } from "@/modules/articles/application/usecases/getarticlecategories.usecase";
import { GetArticleCommentsUseCase } from "@/modules/articles/application/usecases/getarticlecomments.usecase";
import { GetArticlePopularTagsUseCase } from "@/modules/articles/application/usecases/getarticlepopulartags.usecase";
import { GetArticlePromotionFeedUseCase } from "@/modules/articles/application/usecases/getarticlepromotionfeed.usecase";
import { GetCommentRepliesUseCase } from "@/modules/articles/application/usecases/getcommentreplies.usecase";
import { GetOwnArticleBookmarksUseCase } from "@/modules/articles/application/usecases/getownarticlebookmarks.usecase";
import { GetOwnCommentedArticlesUseCase } from "@/modules/articles/application/usecases/getowncommentedarticles.usecase";
import { GetOwnCommentsForArticleUseCase } from "@/modules/articles/application/usecases/getowncommentsforarticle.usecase";
import { GetOwnLikedArticlesUseCase } from "@/modules/articles/application/usecases/getownlikedarticles.usecase";
import { GetOwnSharedArticlesUseCase } from "@/modules/articles/application/usecases/getownsharedarticles.usecase";
import { GetPopularArticlesUseCase } from "@/modules/articles/application/usecases/getpopulararticles.usecase";
import { GetPromotedArticlesUseCase } from "@/modules/articles/application/usecases/getpromotedarticles.usecase";
import { GetPublishedArticlesUseCase } from "@/modules/articles/application/usecases/getpublishedarticles.usecase";
import { LikeArticleUseCase } from "@/modules/articles/application/usecases/likearticle.usecase";
import { LikeArticleCommentUseCase } from "@/modules/articles/application/usecases/likearticlecomment.usecase";
import { ShareArticleUseCase } from "@/modules/articles/application/usecases/sharearticle.usecase";
import { UnbookmarkArticleUseCase } from "@/modules/articles/application/usecases/unbookmarkarticle.usecase";
import { UnlikeArticleUseCase } from "@/modules/articles/application/usecases/unlikearticle.usecase";
import { UnlikeArticleCommentUseCase } from "@/modules/articles/application/usecases/unlikearticlecomment.usecase";
import { ArticlesRepositoryImpl } from "@/modules/articles/infrastructure/repositories/articles.repository.impl";

/**
 * Registers articles module dependencies in the Awilix container.
 *
 * @description
 * Registers the repository as a singleton and all use cases as transient.
 * Called during application bootstrap in the service locator.
 *
 * @param container - The Awilix dependency injection container
 */
export function registerArticlesDependencies(container: AwilixContainer): void {
    container.register({
        // Repository
        articlesRepository: asClass(ArticlesRepositoryImpl).singleton(),

        // Queries
        getPromotedArticlesUseCase: asClass(GetPromotedArticlesUseCase).transient(),
        getArticleCategoriesUseCase: asClass(GetArticleCategoriesUseCase).transient(),
        getArticlePopularTagsUseCase: asClass(GetArticlePopularTagsUseCase).transient(),
        getArticlePromotionFeedUseCase: asClass(GetArticlePromotionFeedUseCase).transient(),
        getPublishedArticlesUseCase: asClass(GetPublishedArticlesUseCase).transient(),
        getAllTagsUseCase: asClass(GetAllTagsUseCase).transient(),
        getArticleBySlugUseCase: asClass(GetArticleBySlugUseCase).transient(),
        getArticleCommentsUseCase: asClass(GetArticleCommentsUseCase).transient(),
        getPopularArticlesUseCase: asClass(GetPopularArticlesUseCase).transient(),

        // Interactions
        likeArticleUseCase: asClass(LikeArticleUseCase).transient(),
        unlikeArticleUseCase: asClass(UnlikeArticleUseCase).transient(),
        bookmarkArticleUseCase: asClass(BookmarkArticleUseCase).transient(),
        unbookmarkArticleUseCase: asClass(UnbookmarkArticleUseCase).transient(),
        getOwnArticleBookmarksUseCase: asClass(GetOwnArticleBookmarksUseCase).transient(),
        getOwnCommentedArticlesUseCase: asClass(GetOwnCommentedArticlesUseCase).transient(),
        getOwnLikedArticlesUseCase: asClass(GetOwnLikedArticlesUseCase).transient(),
        getOwnSharedArticlesUseCase: asClass(GetOwnSharedArticlesUseCase).transient(),
        getOwnCommentsForArticleUseCase: asClass(GetOwnCommentsForArticleUseCase).transient(),
        shareArticleUseCase: asClass(ShareArticleUseCase).transient(),
        addArticleCommentUseCase: asClass(AddArticleCommentUseCase).transient(),
        getCommentRepliesUseCase: asClass(GetCommentRepliesUseCase).transient(),
        addCommentReplyUseCase: asClass(AddCommentReplyUseCase).transient(),
        editArticleCommentUseCase: asClass(EditArticleCommentUseCase).transient(),
        deleteArticleCommentUseCase: asClass(DeleteArticleCommentUseCase).transient(),
        likeArticleCommentUseCase: asClass(LikeArticleCommentUseCase).transient(),
        unlikeArticleCommentUseCase: asClass(UnlikeArticleCommentUseCase).transient()
    });
}
