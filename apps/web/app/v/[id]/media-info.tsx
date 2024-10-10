"use client";
import { Query } from "@/components/Query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { queryMedia } from "@/queries/media";
import moment from "moment";

export const MediaInfo = ({ mediaId }: { mediaId: string }) => {
    return (
        <div className="flex flex-col gap-2">
            <Query
                query={queryMedia(mediaId)}
                loading={Query.LOADING.ROW}
                error={Query.ERROR.ALERT}
            >
                {({ data: media }) => (
                    <>
                        <h1 className="text-lg font-semibold md:text-2xl">
                            {media.title}
                        </h1>
                        <Card x-chunk="dashboard-01-chunk-0">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {moment(media.createdAt).format(
                                        "MMMM Do, YYYY"
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground">
                                    {media.description}
                                </p>
                            </CardContent>
                        </Card>
                    </>
                )}
            </Query>
        </div>
    );
};
