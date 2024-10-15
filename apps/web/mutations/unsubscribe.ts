import { api } from '@/api';
import { KEY } from '@/queries/keys';
import { getQueryClient } from '@/queries/queryClient';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { toast } from 'react-toastify';

export const mutateUnsubscribe = (): UseMutationOptions<
  unknown,
  Error,
  string
> => ({
  mutationFn: async (authorId) => {
    const result = await api((r) => r.user.unsubscribe).post({ authorId });
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
    toast.error(`Failed to unsubscribe: ${error.message}`);
  }
});

export const useMutateUnsubscribe = () => useMutation(mutateUnsubscribe());
