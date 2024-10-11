import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { API, getApiClient } from "@/api";
import { getQueryClient } from "@/queries/queryClient";
import { KEY } from "@/queries/keys";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export const mutateSubscribe = (): UseMutationOptions<
    unknown,
    Error,
    string
> => ({
    mutationFn: async (authorId) => {
        const apiClient = await getApiClient();
        const result = await apiClient.post(API.subscribe(), { authorId });
        getQueryClient().invalidateQueries({
            queryKey: KEY.MY_SUBSCRIPTIONS,
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

export const useMutateSubscribe = () => useMutation(mutateSubscribe());
