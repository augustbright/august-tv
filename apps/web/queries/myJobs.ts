import { UndefinedInitialDataOptions, useQuery } from "@tanstack/react-query";
import { API, getApiClient } from "@/api";
import { KEY } from "./keys";
import { DTO } from "@august-tv/dto";

export const queryMyJobs = (): UndefinedInitialDataOptions<
    DTO["user"]["getMyJobs"]["response"]
> => ({
    queryKey: KEY.MY_JOBS,
    queryFn: async () => {
        const apiClient = await getApiClient();
        const { data } = await apiClient.get(API.myJobs());
        return data;
    },
});

export const useQueryMyJobs = () => useQuery(queryMyJobs());
