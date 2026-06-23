import type { IVideoExclusiveShowEntity } from "@/modules/videos/domain/entities/IVideoExclusiveShowEntity";

/**
 * VideoExclusiveShowViewProps
 *
 * @description
 * Props for the exclusive show presentation component.
 *
 * @property {IVideoExclusiveShowEntity} category - Pre-mapped exclusive category (show) with its episodes
 */
export interface VideoExclusiveShowViewProps {
    category: IVideoExclusiveShowEntity;
}
