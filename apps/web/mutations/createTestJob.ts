import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { API, getApiClient } from "@/api";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { TJobTestParams } from "@august-tv/common/types";

export const mutateCreateTestJob = (): UseMutationOptions<
    unknown,
    Error,
    TJobTestParams
> => ({
    mutationFn: async (params) => {
        const apiClient = await getApiClient();
        const result = await apiClient.post(API.testJob(), params);
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

export const useMutateCreateTestJob = () => useMutation(mutateCreateTestJob());
