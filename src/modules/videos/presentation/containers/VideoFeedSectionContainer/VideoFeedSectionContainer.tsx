"use client";

import { useEffect, useState } from "react";
import { VideoFeedSection } from "@/modules/videos/presentation/components/sections/VideoFeedSection";
import { VideoFeedSectionLoading } from "@/modules/videos/presentation/components/sections/VideoFeedSection/VideoFeedSection.Loading";
import { generateDummyVideoFeed } from "@/modules/videos/presentation/data/video-feed.dummy";
import { VIDEOS_PATH } from "@/shared/presentation/constants/paths";

type FeedData = ReturnType<typeof generateDummyVideoFeed>;

/**
 * VideoFeedSectionContainer
 *
 * @description
 * Client container for a homepage video feed section. Issues the request after
 * mount, rendering the skeleton until the data resolves; serves dummy data
 * until the pinned category feed endpoint exists.
 */
export function VideoFeedSectionContainer() {
    const [feed, setFeed] = useState<FeedData | null>(null);

    useEffect(() => {
        let active = true;

        // TODO: replace with the real client-side request (apiClient) once the
        // pinned-category video feed endpoint is available.
        Promise.resolve(generateDummyVideoFeed()).then((data) => {
            if (active) setFeed(data);
        });

        return () => {
            active = false;
        };
    }, []);

    if (!feed) return <VideoFeedSectionLoading />;

    return (
        <VideoFeedSection
            title={feed.title}
            videos={feed.videos}
            viewAllHref={VIDEOS_PATH}
        />
    );
}
