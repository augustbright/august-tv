import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { API, getApiClient } from "@/api";
import { getQueryClient } from "@/queries/queryClient";
import { KEY } from "@/queries/keys";
import { toast } from "react-toastify";

export const mutateDeleteVideoById = (): UseMutationOptions<
    unknown,
    Error,
    string
> => ({
    mutationFn: async (id) => {
        const apiClient = await getApiClient();
        const result = await apiClient.delete(API.mediaById(id));
        getQueryClient().invalidateQueries({
            queryKey: KEY.MY_MEDIA,
        });
        getQueryClient().invalidateQueries({
            queryKey: KEY.VIDEO(id),
        });
        toast("Video has been deleted");
        return result;
    },
    onError: (error) => {
        toast.error(`Failed to delete video: ${error.message}`);
    },
});

export const useMutateDeleteVideoById = () =>
    useMutation(mutateDeleteVideoById());
