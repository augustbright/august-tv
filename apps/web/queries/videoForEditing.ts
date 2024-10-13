import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import { getApiClient, API } from "@/api";
import { KEY } from "./keys";
import { TMediaEndpointResult } from "@august-tv/dto";

export const queryVideoForEditing = (
    id: string | null
): UndefinedInitialDataOptions<TMediaEndpointResult<"getMediaById">> => ({
    queryKey: KEY.VIDEO(id as string),
    enabled: !!id,
    queryFn: async () => {
        const apiClient = await getApiClient();
        const { data } = await apiClient.get(API.videoForEditing(id as string));
        return data;
    },
});

export const useQueryVideoForEditing = (id: string | null) =>
    useQuery(queryVideoForEditing(id));
