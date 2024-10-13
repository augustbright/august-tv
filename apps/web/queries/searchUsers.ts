import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import { getApiClient, API } from "@/api";
import { KEY, TSearchUsersQueryParams } from "./keys";
import { DTO } from "@august-tv/dto";

export const querySearchUsers = (
    params: TSearchUsersQueryParams
): UndefinedInitialDataOptions<DTO["user"]["searchUsers"]["response"]> => ({
    queryKey: KEY.SEARCH_USERS(params),
    queryFn: async () => {
        const apiClient = await getApiClient();
        const { data } = await apiClient.get(API.searchUsers(), {
            params: {
                q: params.query,
                limit: params.limit,
                cursor: params.cursor,
            },
        });
        return data;
    },
});

export const useQuerySearchUsers = (params: TSearchUsersQueryParams) =>
    useQuery(querySearchUsers(params));
