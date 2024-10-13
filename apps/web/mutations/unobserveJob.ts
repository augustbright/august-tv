import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { API, getApiClient } from "@/api";
import { getQueryClient } from "@/queries/queryClient";
import { KEY } from "@/queries/keys";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export const mutateUnobserveJob = (): UseMutationOptions<
    unknown,
    Error,
    string
> => ({
    mutationFn: async (jobId) => {
        const apiClient = await getApiClient();
        const result = await apiClient.post(API.unobserveJob(), { jobId });
        getQueryClient().invalidateQueries({
            queryKey: KEY.MY_JOBS,
        });
        return result;
    },
    onError: (error) => {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data?.message);
            return;
        }
        toast.error(`Failed to subscribe: ${error.message}`);
    },
});

export const useMutateUnobserveJob = () => useMutation(mutateUnobserveJob());
