import { api } from '@/api';
import { TMediaEndpointResult } from '@august-tv/generated-types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export const mutateRate = (): UseMutationOptions<
  TMediaEndpointResult<'rateMedia'>,
  Error,
  { videoId: string; type: 'LIKE' | 'DISLIKE' | null }
> => ({
  mutationFn: async ({ videoId, type }) => {
    const result = await api((r) => r.media.rate.$(videoId)).post({ type });
    return result.data as TMediaEndpointResult<'rateMedia'>;
  },
  onError: (error) => {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message);
      return;
    }
    toast.error(`Failed to rate video: ${error.message}`);
  }
});

export const useMutateRate = () => useMutation(mutateRate());
