/**
 * Extension → MIME map for the video sources Plyr can play from a direct file URL.
 */
const VIDEO_MIME_BY_EXTENSION: Record<string, string> = {
    mp4: "video/mp4",
    mov: "video/quicktime",
    webm: "video/webm",
    avi: "video/x-msvideo",
    mkv: "video/x-matroska",
    "3gp": "video/3gpp"
};

/**
 * videoMimeType
 *
 * @description
 * Infers a `<video>` MIME type from a file URL's extension for Plyr's file source.
 * Falls back to `video/mp4` for unknown or extension-less URLs.
 *
 * @param url - The direct file/remote video URL.
 * @returns {string} The inferred MIME type.
 */
export function videoMimeType(url: string): string {
    const extension = url.split("?")[0].split(".").pop()?.toLowerCase();
    return (extension && VIDEO_MIME_BY_EXTENSION[extension]) || "video/mp4";
}
