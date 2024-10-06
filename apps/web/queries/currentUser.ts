import { FetchQueryOptions, useQuery } from "@tanstack/react-query";
import { API, getApiClient } from "@/api";
import { KEY } from "./keys";
import { DTO } from "@august-tv/dto";

export const queryCurrentUser = (): FetchQueryOptions<
    DTO["user"]["getCurrentUser"]["response"]
> => ({
    queryKey: KEY.CURRENT_USER,
    queryFn: async () => {
        const apiClient = await getApiClient();
        const { data } = await apiClient.get(API.currentUser());
        return data;
    },
});

export const useQueryCurrentUser = () => useQuery(queryCurrentUser());
