import { API, getApiClient } from '@/api';
import { KEY } from '@/queries/keys';
import { getQueryClient } from '@/queries/queryClient';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

export const mutateUnsetProfilePicture = (): UseMutationOptions<
  unknown,
  Error,
  void
> => ({
  mutationFn: async () => {
    const apiClient = await getApiClient();
    const result = await apiClient.post(API.unsetProfilePicture());
    getQueryClient().invalidateQueries({
      queryKey: KEY.CURRENT_USER
    });
    return result;
  }
});

export const useMutateUnsetProfilePicture = () =>
  useMutation(mutateUnsetProfilePicture());
