import { api } from '@/api';
import { KEY } from '@/queries/keys';
import { getQueryClient } from '@/queries/queryClient';
import { Dto } from '@august-tv/generated-types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

export const mutateUpdateVideo = (): UseMutationOptions<
  unknown,
  Error,
  {
    id: string;
    updateVideoDto: Dto['media']['patchMedia']['body'];
  }
> => ({
  mutationFn: async ({ id, updateVideoDto }) => {
    const result = await api((r) => r.media.$(id)).patch(updateVideoDto);
    getQueryClient().invalidateQueries({
      queryKey: KEY.MY_MEDIA
    });
    getQueryClient().invalidateQueries({
      queryKey: KEY.VIDEO(id)
    });
    return result;
  }
});

export const useMutateUpdateMedia = () => useMutation(mutateUpdateVideo());
