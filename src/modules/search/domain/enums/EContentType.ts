/**
 * EContentType
 *
 * @description
 * The content type a search hit belongs to. Mirrors the API's discriminator, which
 * decides a hit's badge and the route its row links to.
 */
export enum EContentType {
    Article = "Article",
    Video = "Video",
    Short = "Short",
    Lyrics = "Lyrics",
    Custom = "Custom"
}
