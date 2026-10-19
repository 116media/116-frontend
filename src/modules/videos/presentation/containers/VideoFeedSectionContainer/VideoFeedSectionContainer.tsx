"use client";

import { VideoFeedSection } from "@/modules/videos/presentation/components/sections/VideoFeedSection";
import { VideoFeedSectionLoading } from "@/modules/videos/presentation/components/sections/VideoFeedSection/VideoFeedSection.Loading";
import { useVideoFeed } from "@/modules/videos/presentation/hooks/useVideoFeed";
import { StateRenderer } from "@/shared/presentation/components/ui/StateRenderer";
import { VIDEOS_PATH } from "@/shared/presentation/constants/paths";
import { PageContainer } from "@/shared/presentation/layouts/PageContainer";

/**
 * VideoFeedSectionContainer
 *
 * @description
 * Client container for the homepage video feed, reading the shared feed query which
 * stands the dummy feed in while the backend holds no sections. The feed breaks out of
 * the page gutter to run its own full-width band, with a PageContainer inside so the
 * cards stay on the page grid. Renders nothing if the query itself fails.
 */
export function VideoFeedSectionContainer() {
    const { data: sections, isPending, isError } = useVideoFeed();

    return (
        <StateRenderer
            data={sections}
            error={isError}
            loading={isPending}
            skeleton={<VideoFeedSectionLoading />}
            render={(items) => (
                <section className="relative left-1/2 w-screen -translate-x-1/2 bg-surface-raised py-14 lg:py-20">
                    <PageContainer>
                        <div className="flex flex-col gap-12 lg:gap-20">
                            {items.map(({ category, videos }) => (
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
            )}
        />
    );
}
