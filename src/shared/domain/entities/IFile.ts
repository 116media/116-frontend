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
 * @property {string} fileName - Stored filename.
 * @property {string} originalFileName - Original uploaded filename.
 * @property {string} mimeType - MIME type (e.g. "image/png").
 * @property {string} storageUrl - URL to fetch the file.
 * @property {number} sizeInBytes - File size in bytes.
 * @property {boolean} isDeleted - Soft-delete flag.
 */
export interface IFile {
    id: string;
    fileName: string;
    originalFileName: string;
    mimeType: string;
    storageUrl: string;
    sizeInBytes: number;
    isDeleted: boolean;
}
