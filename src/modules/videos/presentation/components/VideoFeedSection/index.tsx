"use client";

import { useEffect, useState } from "react";

import { VIDEOS_PATH } from "@/shared/presentation/constants/paths";

import { generateDummyVideoFeed } from "./dummy-feed";
import { VideoFeedSection } from "./VideoFeedSection";
import { VideoFeedSectionLoading } from "./VideoFeedSection.Loading";

type FeedData = ReturnType<typeof generateDummyVideoFeed>;

/**
 * VideoFeedSectionContainer
 *
 * @description
 * Client container for a homepage video feed section. Issues the request on the
 * client after mount, rendering the skeleton until the data resolves. It serves
 * dummy data for now so the section is always visible during development —
 * swap the resolver in the effect for the real client API call once the pinned
 * category feed endpoint exists.
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
