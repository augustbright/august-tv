import { API, getApiClient } from '@/api';
import { KEY } from '@/queries/keys';
import { getQueryClient } from '@/queries/queryClient';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { Crop } from 'react-image-crop';

export const mutateUpdateProfilePicture = (): UseMutationOptions<
  unknown,
  Error,
  {
    imageId: string;
    crop: Crop;
  }
> => ({
  mutationFn: async ({ imageId, crop }) => {
    const apiClient = await getApiClient();
    const result = await apiClient.post(API.updateProfilePicture(), {
      imageId,
      crop
    });
    getQueryClient().invalidateQueries({
      queryKey: KEY.CURRENT_USER
    });
    getQueryClient().invalidateQueries({
      queryKey: KEY.PROFILE_PICTURES
    });
    return result;
  }
});

export const useMutateUpdateProfilePicture = () =>
  useMutation(mutateUpdateProfilePicture());
