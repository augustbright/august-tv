import { KEY } from '@/queries/keys';
import { getQueryClient } from '@/queries/queryClient';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { api } from '../api';

export const mutateSignOut = (): UseMutationOptions => ({
  mutationFn: async () => {
    await api((r) => r.user['sign-out']).post(undefined);

    getQueryClient().invalidateQueries({
      queryKey: KEY.CURRENT_USER
    });
  }
});

export const useMutateSignOut = () => useMutation(mutateSignOut());
