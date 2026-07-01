/**
 * IArticleImage
 *
 * @description
 * One image attached to an article, mapped from ArticleImageDto. The storage key is
 * dropped and the DTO's `imageType` ("Cover" | "Body") is lowercased to a `type` union.
 *
 * @interface IArticleImage
 *
 * @property {string} id - Unique identifier (UUID)
 * @property {string} url - Resolved image URL
 * @property {"cover" | "body"} type - Placement of the image within the article
 */
export interface IArticleImage {
    id: string;
    url: string;
    type: "cover" | "body";
}
