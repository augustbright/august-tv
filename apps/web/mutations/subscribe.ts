import { API, getApiClient } from '@/api';
import { KEY } from '@/queries/keys';
import { getQueryClient } from '@/queries/queryClient';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export const mutateSubscribe = (): UseMutationOptions<
  unknown,
  Error,
  string
> => ({
  mutationFn: async (authorId) => {
    const apiClient = await getApiClient();
    const result = await apiClient.post(API.subscribe(), { authorId });
    getQueryClient().invalidateQueries({
      queryKey: KEY.MY_SUBSCRIPTIONS
    });
    getQueryClient().invalidateQueries({
      queryKey: KEY.FEED_SUBSCRIPTIONS
    });
    getQueryClient().invalidateQueries({
      queryKey: ['video']
    });
    return result;
  },
  onError: (error) => {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message);
      return;
    }
    toast.error(`Failed to subscribe: ${error.message}`);
  }
});

export const useMutateSubscribe = () => useMutation(mutateSubscribe());
