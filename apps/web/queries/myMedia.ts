import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import { getApiClient, API } from "@/api";
import { KEY } from "./keys";
import { TVideoDto } from "types";

export const queryMyMedia = (): UndefinedInitialDataOptions<{
    data: TVideoDto[];
}> => ({
    queryKey: KEY.MY_MEDIA,
    queryFn: async () => {
        const apiClient = await getApiClient();
        const { data } = await apiClient.get(API.myMedia());
        return data;
    },
});

export const useQueryMyMedia = () => useQuery(queryMyMedia());
