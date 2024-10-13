import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import { API, getApiClient } from "@/api";
import { KEY } from "./keys";
import { TUserEndpointResult } from "@august-tv/dto";

export const queryMySubscriptions = (): UndefinedInitialDataOptions<
    TUserEndpointResult<"getMySubscriptions">
> => ({
    queryKey: KEY.MY_SUBSCRIPTIONS,
    queryFn: async () => {
        const apiClient = await getApiClient();
        const { data } = await apiClient.get(API.mySubscriptions());
        return data;
    },
});

export const useQueryMySubscriptions = () => useQuery(queryMySubscriptions());
