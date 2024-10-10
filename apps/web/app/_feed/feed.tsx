"use client";

import { queryFeedLatest } from "@/queries/feedLatest";
import { FeedThumbnail } from "./feed-thumbnail";
import { Query } from "@/components/Query";

export const Feed = () => {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Latest Videos</h2>
            <div className="flex flex-wrap">
                <Query
                    query={queryFeedLatest()}
                    loading={Query.LOADING.ROW}
                    error={Query.ERROR.ALERT}
                >
                    {({ data: { data: items } }) =>
                        items.map((video) => (
                            <FeedThumbnail key={video.id} video={video} />
                        ))
                    }
                </Query>
            </div>
        </div>
    );
};
