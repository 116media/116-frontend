import type { IVideoExclusiveShowEntity } from "@/modules/videos/domain/entities/IVideoExclusiveShowEntity";

/**
 * VideoExclusiveShowViewProps
 *
 * @description
 * Props shared by the exclusive show layouts and the Root provider.
 *
 * @property {IVideoExclusiveShowEntity} category - Pre-mapped exclusive category (show) with its episodes
 */
export interface VideoExclusiveShowViewProps {
    category: IVideoExclusiveShowEntity;
}
