import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { API, getApiClient } from "@/api";
import { getQueryClient } from "@/queries/queryClient";
import { KEY } from "@/queries/keys";
import { TMediaEndpointResult } from "@august-tv/dto";

const validateMediaFile = (media: File) => {
    if (media.size > 50 * 1024 * 1024) {
        return "File size is too large";
    }

    if (!media.type.startsWith("video/")) {
        return "File type is not supported";
    }

    return null;
};

export const mutateUploadMedia = (): UseMutationOptions<
    TMediaEndpointResult<"uploadMedia">,
    Error,
    File
> => ({
    mutationFn: async (file) => {
        const error = validateMediaFile(file);
        if (error) {
            throw new Error(error);
        }
        const formData = new FormData();

        formData.append("file", file, file.name);

        const apiClient = await getApiClient();
        const result = await apiClient.post(API.uploadMedia(), formData);
        getQueryClient().invalidateQueries({
            queryKey: KEY.MY_MEDIA,
        });
        return result.data;
    },
});

export const useMutateUploadMedia = () => useMutation(mutateUploadMedia());
