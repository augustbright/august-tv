import { api } from '@/api';
import { KEY } from '@/queries/keys';
import { getQueryClient } from '@/queries/queryClient';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

export const mutateUnsetProfilePicture = (): UseMutationOptions<
  unknown,
  Error,
  void
> => ({
  mutationFn: async () => {
    const result = await api((r) => r.user.unsetProfilePicture).post(undefined);
    getQueryClient().invalidateQueries({
      queryKey: KEY.CURRENT_USER
    });
    return result;
  }
});

export const useMutateUnsetProfilePicture = () =>
  useMutation(mutateUnsetProfilePicture());
