import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { API, getApiClient } from "@/api";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { DTO } from "@august-tv/dto";

export const mutateRate = (): UseMutationOptions<
    DTO["media"]["rateMedia"]["response"],
    Error,
    { videoId: string; type: "LIKE" | "DISLIKE" | null }
> => ({
    mutationFn: async ({ videoId, type }) => {
        const apiClient = await getApiClient();
        const result = await apiClient.post(API.rate(videoId), { type });
        return result.data as DTO["media"]["rateMedia"]["response"];
    },
    onError: (error) => {
        if (error instanceof AxiosError) {
            toast.error(error.response?.data?.message);
            return;
        }
        toast.error(`Failed to rate video: ${error.message}`);
    },
});

export const useMutateRate = () => useMutation(mutateRate());
