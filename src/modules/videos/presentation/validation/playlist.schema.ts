import { z } from "zod";

import { Validators } from "@/shared/presentation/validation/validators";

/**
 * Playlist rename form schema — a required playlist name bounded to 1–120 characters.
 */
export const playlistRenameSchema = z.object({
    name: Validators.minMax("favorites.playlist.nameLabel", 1, 120)
});

/**
 * Values produced by {@link playlistRenameSchema}.
 */
export type PlaylistRenameFormValues = z.infer<typeof playlistRenameSchema>;
