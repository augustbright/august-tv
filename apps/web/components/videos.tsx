"use client";

import { queryFeedLatest } from "@/queries/feedLatest";
import { VideoThumbnail } from "./video-thumbnail";
import { Query } from "@/components/Query";

export const Videos = ({
    query,
}: {
    query: ReturnType<typeof queryFeedLatest>;
}) => {
    return (
        <div className="flex flex-wrap">
            <Query
                query={query}
                loading={Query.LOADING.ROW}
                error={Query.ERROR.ALERT}
            >
                {({ data: { data: items } }) => {
                    if (!items?.length) {
                        return (
                            <div className="w-full flex justify-center text-secondary">
                                No videos found
                            </div>
                        );
                    }
                    return items.map((video) => (
                        <VideoThumbnail key={video.id} video={video} />
                    ));
                }}
            </Query>
        </div>
    );
};
