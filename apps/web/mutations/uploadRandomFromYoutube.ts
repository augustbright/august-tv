import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { API, getApiClient } from "@/api";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export const mutateUploadRandomFromYoutube = (): UseMutationOptions<
    unknown,
    Error,
    string
> => ({
    mutationFn: async (authorId) => {
        const apiClient = await getApiClient();
        const result = await apiClient.post(API.youtubeUploadRandom(), {
            authorId,
        });
        return result;
    },
    onError: (error) => {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data?.message);
            return;
        }
        toast.error(String(error));
    },
});

export const useMutateUploadRandomFromYoutube = () =>
    useMutation(mutateUploadRandomFromYoutube());
