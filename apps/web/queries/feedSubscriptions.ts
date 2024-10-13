import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import { getApiClient, API } from "@/api";
import { KEY } from "./keys";
import { TFeedEndpointResult } from "@august-tv/dto";

export const queryFeedSubscriptions = (): UndefinedInitialDataOptions<
    TFeedEndpointResult<"getSubscriptionsFeed">
> => ({
    queryKey: KEY.FEED_SUBSCRIPTIONS,
    queryFn: async () => {
        const apiClient = await getApiClient();
        const { data } = await apiClient.get(API.feedSubscriptions());
        return data;
    },
});

export const useQueryFeedSubscriptions = () =>
    useQuery(queryFeedSubscriptions());
