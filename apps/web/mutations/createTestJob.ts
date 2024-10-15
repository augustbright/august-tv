import { api } from '@/api';
import { TJobTestParams } from '@august-tv/common/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export const mutateCreateTestJob = (): UseMutationOptions<
  unknown,
  Error,
  TJobTestParams
> => ({
  mutationFn: async (params) => {
    const result = await api((r) => r.jobs.test).post(params);
    return result;
  },
  onError: (error) => {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message);
      return;
    }
    toast.error(String(error));
  }
});

export const useMutateCreateTestJob = () => useMutation(mutateCreateTestJob());
