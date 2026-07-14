# Spec 02 — Repository & Use Cases

Design ref: [../03-backend-api-reference.md](../03-backend-api-reference.md) and
[../10-state-management-and-hooks.md](../10-state-management-and-hooks.md).

The shipped interaction methods (like/unlike, bookmark/unbookmark, share, comment
create/list, rate) are the reference. This spec documents them and adds the **deferred**
methods: comment like/reply/edit/delete and my-bookmarks.

---

## 1. Port — interaction methods (extend)

`src/modules/articles/application/repositories/articles.repository.port.ts`

Shipped signatures (documented) plus the deferred additions:

```ts
    /**
     * Likes an article for the current user.
     *
     * @param id - The article to like (UUID).
     * @returns `ok(true)` on success, `err(Failure)` on failure.
     */
    likeArticle(id: string): Promise<Result<boolean>>;

    /**
     * Removes the current user's like from an article.
     *
     * @param id - The article to unlike (UUID).
     * @returns `ok(true)` on success, `err(Failure)` on failure.
     */
    unlikeArticle(id: string): Promise<Result<boolean>>;

    /**
     * Bookmarks / unbookmarks an article (POST / DELETE pair; documented shipped).
     */
    bookmarkArticle(id: string): Promise<Result<boolean>>;
    unbookmarkArticle(id: string): Promise<Result<boolean>>;

    /**
     * Records a share event for an article. The `platform` label is client-side context
     * only — the backend stores a bare share event and never receives the platform.
     *
     * @param input - The article id and the client-side platform label.
     * @returns `ok(true)` on success, `err(Failure)` on failure.
     */
    shareArticle(input: { articleId: string; platform: string }): Promise<Result<boolean>>;

    /**
     * Fetches one page of an article's comments.
     *
     * @param query - The article id plus zero-based paging.
     * @returns `ok(IArticleCommentPage)` on success, `err(Failure)` on failure.
     */
    getArticleComments(query: IArticleCommentsQuery): Promise<Result<IArticleCommentPage>>;

    /**
     * Posts a top-level comment on an article.
     *
     * @param input - The article id and the comment body.
     * @returns `ok(IArticleCommentEntity)` on success, `err(Failure)` on failure.
     */
    addArticleComment(input: { articleId: string; body: string }): Promise<Result<IArticleCommentEntity>>;

    /**
     * Likes / unlikes a comment (idempotent like; POST / DELETE pair).
     *
     * @param commentId - The comment to (un)like (UUID).
     * @returns `ok(true)` on success, `err(Failure)` on failure.
     */
    likeArticleComment(commentId: string): Promise<Result<boolean>>;
    unlikeArticleComment(commentId: string): Promise<Result<boolean>>;

    /**
     * Fetches one page of a comment's replies.
     *
     * @param query - The parent comment id plus zero-based paging.
     * @returns `ok(IArticleCommentPage)` on success, `err(Failure)` on failure.
     */
    getCommentReplies(query: ICommentRepliesQuery): Promise<Result<IArticleCommentPage>>;

    /**
     * Posts a one-level reply to a top-level comment.
     *
     * @param input - The article id, parent comment id, and reply body.
     * @returns `ok(IArticleCommentEntity)` on success, `err(Failure)` on failure.
     */
    addCommentReply(input: { articleId: string; parentCommentId: string; body: string }): Promise<Result<IArticleCommentEntity>>;

    /**
     * Edits the current user's own comment.
     *
     * @param input - The article id, comment id, and new body.
     * @returns `ok(true)` on success, `err(Failure)` on failure (incl. 400 not-owner).
     */
    editArticleComment(input: { articleId: string; commentId: string; body: string }): Promise<Result<boolean>>;

    /**
     * Soft-deletes the current user's own comment.
     *
     * @param input - The article id and comment id.
     * @returns `ok(true)` on success, `err(Failure)` on failure (incl. 400 not-owner).
     */
    deleteArticleComment(input: { articleId: string; commentId: string }): Promise<Result<boolean>>;

    /**
     * Fetches one page of the current user's bookmarked articles.
     *
     * @param query - Zero-based paging.
     * @returns `ok(IArticlePage)` on success, `err(Failure)` on failure.
     */
    getMyArticleBookmarks(query: { pageIndex: number; pageSize: number }): Promise<Result<IArticlePage>>;
```

Query types (in the module's constants/keys file — see [03](03-hooks-and-keys.md)):

```ts
export interface IArticleCommentsQuery {
    articleId: string;
    pageIndex: number;
    pageSize: number;
}

export interface ICommentRepliesQuery {
    commentId: string;
    pageIndex: number;
    pageSize: number;
}
```

---

## 2. Impl — the standard wrapper

`src/modules/articles/infrastructure/repositories/articles.repository.impl.ts`

Every method wraps the generated client and maps; `ok(...)` on success, `ProblemMapper`
on catch. The deferred methods follow the shipped shape exactly:

```ts
    async likeArticleComment(commentId: string): Promise<Result<boolean>> {
        try {
            const response = await this.api.publicLikeArticleComment(commentId);
            return ok(response.data.isSuccess);
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async getCommentReplies(query: ICommentRepliesQuery): Promise<Result<IArticleCommentPage>> {
        try {
            const response = await this.api.publicGetCommentReplies(query.commentId, {
                pageIndex: query.pageIndex,
                pageSize: query.pageSize
            });
            return ok(ArticlesMapper.commentPageFromDto(response.data.replies));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async addCommentReply(input: {
        articleId: string;
        parentCommentId: string;
        body: string;
    }): Promise<Result<IArticleCommentEntity>> {
        try {
            const response = await this.api.publicAddCommentReply(input.articleId, input.parentCommentId, {
                body: input.body
            });
            return ok(ArticlesMapper.commentFromDto(response.data.reply));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async editArticleComment(input: {
        articleId: string;
        commentId: string;
        body: string;
    }): Promise<Result<boolean>> {
        try {
            const response = await this.api.publicEditArticleComment(input.articleId, input.commentId, {
                body: input.body
            });
            return ok(response.data.isSuccess);
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async getMyArticleBookmarks(query: {
        pageIndex: number;
        pageSize: number;
    }): Promise<Result<IArticlePage>> {
        try {
            const response = await this.api.publicGetMyArticleBookmarks(query);
            return ok(ArticlesMapper.articlePageFromDto(response.data.articles));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }
```

The share impl **drops `platform`** before the network call — it accepts the label for the
frontend contract but sends only the id:

```ts
    async shareArticle(input: { articleId: string; platform: string }): Promise<Result<boolean>> {
        try {
            const response = await this.api.publicShareArticle(input.articleId);
            return ok(response.data.isSuccess);
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }
```

---

## 3. Use cases

One thin use case per method, `IResultUseCase`-shaped, delegating to the port. Register each
in `articles.dependencies.ts` (`asClass(...).transient()`) and type it on the cradle in
`service.locator.ts`. New cradle members:

```ts
likeArticleCommentUseCase: LikeArticleCommentUseCase;
unlikeArticleCommentUseCase: UnlikeArticleCommentUseCase;
getCommentRepliesUseCase: GetCommentRepliesUseCase;
addCommentReplyUseCase: AddCommentReplyUseCase;
editArticleCommentUseCase: EditArticleCommentUseCase;
deleteArticleCommentUseCase: DeleteArticleCommentUseCase;
getMyArticleBookmarksUseCase: GetMyArticleBookmarksUseCase;
```

---

## Tasks

- [ ] Port: comment like/unlike, reply list/post, edit, delete, my-bookmarks methods added.
- [ ] Impl: each wraps the generated client, maps via `ArticlesMapper`, `Result<T>` + `ProblemMapper`.
- [ ] `shareArticle` accepts `platform` but sends only the id (documented discrepancy).
- [ ] Use cases created for each deferred method, registered in DI + typed on the cradle.
- [ ] Existing shipped methods unchanged.
- [ ] `tsc` + biome clean.
