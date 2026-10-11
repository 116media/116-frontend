/**
 * IFile
 *
 * @description
 * A stored file (e.g. the user's avatar). Kept as a whole object — not flattened to
 * a URL — mirroring the dashboard's `IUser.avatar: IFile`, so screens can read the
 * filename/mime/size, not just the URL. Maps from the backend `FileDto`.
 *
 * @interface IFile
 * @property {string} id - File unique identifier.
 * @property {string} mimeType - MIME type (e.g. "image/png").
 * @property {string} storageUrl - URL to fetch the file.
 */
export interface IFile {
    id: string;
    mimeType: string;
    storageUrl: string;
}
