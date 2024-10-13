"use client";

import { queryFeedLatest } from "@/queries/feedLatest";
import { Videos } from "@/components/videos";

export const Feed = ({
    query,
}: {
    query: ReturnType<typeof queryFeedLatest>;
}) => {
    return (
        <div className="flex flex-col gap-4">
            <Videos query={query} />
        </div>
    );
};
