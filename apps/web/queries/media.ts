import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import { getApiClient, API } from "@/api";
import { KEY } from "./keys";
import { DTO } from "@august-tv/dto";

export const queryMedia = (
    id: string | null
): UndefinedInitialDataOptions<DTO["media"]["getMediaById"]["response"]> => ({
    queryKey: KEY.VIDEO(id as string),
    enabled: !!id,
    queryFn: async () => {
        const apiClient = await getApiClient();
        const { data } = await apiClient.get(API.mediaById(id as string));
        return data;
    },
});

export const useQueryMedia = (id: string | null) => useQuery(queryMedia(id));
