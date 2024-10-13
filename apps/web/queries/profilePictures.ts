import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import { getApiClient, API } from "@/api";
import { KEY } from "./keys";
import { TUserEndpointResult } from "@august-tv/dto";

export const queryProfilePictures = (): UndefinedInitialDataOptions<
    TUserEndpointResult<"getProfilePictures">
> => ({
    queryKey: KEY.PROFILE_PICTURES,
    queryFn: async () => {
        const apiClient = await getApiClient();
        const { data } = await apiClient.get(API.profilePictures());
        return data;
    },
});

export const useQueryProfilePictures = () => useQuery(queryProfilePictures());
