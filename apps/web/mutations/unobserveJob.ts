import { api } from '@/api';
import { KEY } from '@/queries/keys';
import { getQueryClient } from '@/queries/queryClient';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export const mutateUnobserveJob = (): UseMutationOptions<
  unknown,
  Error,
  string
> => ({
  mutationFn: async (jobId) => {
    const result = await api((r) => r.user.unobserveJob).post({ jobId });
    getQueryClient().invalidateQueries({
      queryKey: KEY.MY_JOBS
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

export const useMutateUnobserveJob = () => useMutation(mutateUnobserveJob());
