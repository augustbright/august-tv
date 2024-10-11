import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { API, getApiClient } from "@/api";
import { getQueryClient } from "@/queries/queryClient";
import { KEY } from "@/queries/keys";
import { toast } from "react-toastify";

export const mutateUnsubscribe = (): UseMutationOptions<
    unknown,
    Error,
    string
> => ({
    mutationFn: async (authorId) => {
        const apiClient = await getApiClient();
        const result = await apiClient.post(API.unsubscribe(), { authorId });
        getQueryClient().invalidateQueries({
            queryKey: KEY.MY_SUBSCRIPTIONS,
        });
        return result;
    },
    onError: (error) => {
        toast.error(`Failed to unsubscribe: ${error.message}`);
    },
});

export const useMutateUnsubscribe = () => useMutation(mutateUnsubscribe());
