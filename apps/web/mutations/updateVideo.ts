import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { API, getApiClient } from '@/api';
import { getQueryClient } from '@/queries/queryClient';
import { KEY } from '@/queries/keys';
import { TUpdateVideoDto } from 'types';

export const mutateUpdateVideo = (): UseMutationOptions<
  unknown,
  Error,
  {
    id: string;
    updateVideoDto: TUpdateVideoDto;
  }
> => ({
  mutationFn: async ({ id, updateVideoDto }) => {
    const apiClient = await getApiClient();
    const result = await apiClient.patch(API.updateMedia(id), updateVideoDto);
    getQueryClient().invalidateQueries({
      queryKey: KEY.MY_MEDIA,
    });
    getQueryClient().invalidateQueries({
      queryKey: KEY.VIDEO(id),
    });
    return result;
  },
});

export const useMutateUpdateMedia = () => useMutation(mutateUpdateVideo());
