import { KEY } from '@/queries/keys';
import { getQueryClient } from '@/queries/queryClient';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { API, getApiClient } from '../api';

export const mutateSignOut = (): UseMutationOptions => ({
  mutationFn: async () => {
    const apiClient = await getApiClient();
    await apiClient.post(API.signOut());

    getQueryClient().invalidateQueries({
      queryKey: KEY.CURRENT_USER
    });
  }
});

export const useMutateSignOut = () => useMutation(mutateSignOut());
