"use client";

import { useEffect, useState } from "react";

import type { IVideoFeedEntity } from "@/modules/videos/domain/entities/IVideoFeedEntity";
import { VideoFeedSection } from "@/modules/videos/presentation/components/sections/VideoFeedSection";
import { VideoFeedSectionLoading } from "@/modules/videos/presentation/components/sections/VideoFeedSection/VideoFeedSection.Loading";
import { generateDummyVideoFeed } from "@/modules/videos/presentation/data/video-feed.dummy";
import container from "@/shared/infrastructure/service.locator";
import { VIDEOS_PATH } from "@/shared/presentation/constants/paths";
import { PageContainer } from "@/shared/presentation/layouts/PageContainer";

/**
 * VideoFeedSectionContainer
 *
 * @description
 * Client container for the homepage video feed. Fetches the pinned-category
 * sections after mount via `getVideoFeedUseCase`, rendering the skeleton while
 * loading; a failed or empty response falls back to the dummy feed. The feed
 * breaks out of the page gutter to run its own full-width band, with a
 * PageContainer inside so the cards stay on the page grid.
 */
export function VideoFeedSectionContainer() {
    const [sections, setSections] = useState<IVideoFeedEntity[] | null>(null);

    useEffect(() => {
        let active = true;

        async function loadFeed() {
            const result = await container.cradle.getVideoFeedUseCase.execute();

            if (!active) return;

            const resolved =
                result.ok && result.value.length > 0 ? result.value : generateDummyVideoFeed();
            setSections(resolved);
        }

        loadFeed();

        return () => {
            active = false;
        };
    }, []);

    if (!sections) return <VideoFeedSectionLoading />;

    return (
        <section className="relative left-1/2 w-screen -translate-x-1/2 bg-surface-raised py-14 lg:py-20">
            <PageContainer>
                <div className="flex flex-col gap-12 lg:gap-20">
                    {sections.map(({ category, videos }) => (
                        <VideoFeedSection
                            videos={videos}
                            key={category.id}
                            title={category.name}
                            viewAllHref={`${VIDEOS_PATH}?categoryId=${category.id}`}
                        />
                    ))}
                </div>
            </PageContainer>
        </section>
    );
}
