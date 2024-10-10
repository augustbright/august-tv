import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { API, getApiClient } from "@/api";
import { getQueryClient } from "@/queries/queryClient";
import { KEY } from "@/queries/keys";

export const mutateUnsetProfilePicture = (): UseMutationOptions<
    unknown,
    Error,
    void
> => ({
    mutationFn: async () => {
        const apiClient = await getApiClient();
        const result = await apiClient.post(API.unsetProfilePicture());
        getQueryClient().invalidateQueries({
            queryKey: KEY.CURRENT_USER,
        });
        return result;
    },
});

export const useMutateUnsetProfilePicture = () =>
    useMutation(mutateUnsetProfilePicture());
