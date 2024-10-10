import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import { getApiClient, API } from "@/api";
import { KEY } from "./keys";
import { DTO } from "@august-tv/dto";

export const queryFeedLatest = (): UndefinedInitialDataOptions<
    DTO["feed"]["getLatestFeed"]["response"]
> => ({
    queryKey: KEY.FEED,
    queryFn: async () => {
        const apiClient = await getApiClient();
        const { data } = await apiClient.get(API.feedLatest());
        return data;
    },
});

export const useQueryFeedLatest = () => useQuery(queryFeedLatest());
