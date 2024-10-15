import { api } from '@/api';
import { KEY } from '@/queries/keys';
import { getQueryClient } from '@/queries/queryClient';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { toast } from 'react-toastify';

export const mutateDeleteVideoById = (): UseMutationOptions<
  unknown,
  Error,
  string
> => ({
  mutationFn: async (id) => {
    const result = await api((r) => r.media.$(id)).delete();
    getQueryClient().invalidateQueries({
      queryKey: KEY.MY_MEDIA
    });
    getQueryClient().invalidateQueries({
      queryKey: KEY.VIDEO(id)
    });
    toast('Video has been deleted');
    return result;
  },
  onError: (error) => {
    toast.error(`Failed to delete video: ${error.message}`);
  }
});

export const useMutateDeleteVideoById = () =>
  useMutation(mutateDeleteVideoById());
