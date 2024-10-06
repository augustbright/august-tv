import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { API, getApiClient } from "@/api";
import { getQueryClient } from "@/queries/queryClient";
import { KEY } from "@/queries/keys";

const validatePictureFile = (media: File) => {
    if (media.size > 5 * 1024 * 1024) {
        return "File size is too large";
    }

    if (!media.type.startsWith("image/png")) {
        return "File type is not supported";
    }

    return null;
};

export const mutateUpdateProfilePicture = (): UseMutationOptions<
    unknown,
    Error,
    File
> => ({
    mutationFn: async (file) => {
        const error = validatePictureFile(file);
        if (error) {
            throw new Error(error);
        }
        const formData = new FormData();

        formData.append("file", file, file.name);

        const apiClient = await getApiClient();
        const result = await apiClient.post(
            API.updateProfilePicture(),
            formData
        );
        getQueryClient().invalidateQueries({
            queryKey: KEY.CURRENT_USER,
        });
        return result;
    },
});

export const useMutateUpdateProfilePicture = () =>
    useMutation(mutateUpdateProfilePicture());
