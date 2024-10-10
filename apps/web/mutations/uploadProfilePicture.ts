import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { API, getApiClient } from "@/api";
import { getQueryClient } from "@/queries/queryClient";
import { KEY } from "@/queries/keys";
import { Crop } from "react-image-crop";

const validatePictureFile = (media: File) => {
    if (media.size > 5 * 1024 * 1024) {
        return "File size is too large";
    }

    if (!media.type.startsWith("image")) {
        return "File type is not supported";
    }

    return null;
};

export const mutateUploadProfilePicture = (): UseMutationOptions<
    unknown,
    Error,
    {
        file: File;
        crop: Crop;
    }
> => ({
    mutationFn: async ({ file, crop }) => {
        const error = validatePictureFile(file);
        if (error) {
            throw new Error(error);
        }
        const formData = new FormData();

        formData.append("file", file, file.name);
        formData.append("width", crop.width.toString());
        formData.append("height", crop.height.toString());
        formData.append("x", crop.x.toString());
        formData.append("y", crop.y.toString());

        const apiClient = await getApiClient();
        const result = await apiClient.post(
            API.uploadProfilePicture(),
            formData
        );
        getQueryClient().invalidateQueries({
            queryKey: KEY.CURRENT_USER,
        });
        getQueryClient().invalidateQueries({
            queryKey: KEY.PROFILE_PICTURES,
        });
        return result;
    },
});

export const useMutateUploadProfilePicture = () =>
    useMutation(mutateUploadProfilePicture());
