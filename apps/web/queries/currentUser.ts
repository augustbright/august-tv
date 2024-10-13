import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import { API, getApiClient } from "@/api";
import { KEY } from "./keys";
import { TUserEndpointResult } from "@august-tv/dto";

export const queryCurrentUser = (): UndefinedInitialDataOptions<
    TUserEndpointResult<"getCurrentUser">
> => ({
    queryKey: KEY.CURRENT_USER,
    queryFn: async () => {
        const apiClient = await getApiClient();
        const { data } = await apiClient.get(API.currentUser());
        return data;
    },
});

export const useQueryCurrentUser = () => useQuery(queryCurrentUser());
