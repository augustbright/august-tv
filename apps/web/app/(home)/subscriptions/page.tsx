"use client";
import { Videos } from "@/components/videos";
import { queryFeedSubscriptions } from "@/queries/feedSubscriptions";

export default function Page() {
    return (
        <main className="flex flex-col gap-4 grow">
            <div className="flex flex-col gap-4">
                <Videos query={queryFeedSubscriptions()} />
            </div>
        </main>
    );
}
