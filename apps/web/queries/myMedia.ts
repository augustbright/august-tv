import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import { getApiClient, API } from "@/api";
import { KEY } from "./keys";
import { TMediaEndpointResult } from "@august-tv/dto";

export const queryMyMedia = (): UndefinedInitialDataOptions<
    TMediaEndpointResult<"getMyMedia">
> => ({
    queryKey: KEY.MY_MEDIA,
    queryFn: async () => {
        const apiClient = await getApiClient();
        const { data } = await apiClient.get(API.myMedia());
        return data;
    },
});

export const useQueryMyMedia = () => useQuery(queryMyMedia());
