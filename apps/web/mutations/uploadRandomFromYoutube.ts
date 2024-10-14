import { API, getApiClient } from '@/api';
import { Dto } from '@august-tv/dto';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export const mutateUploadRandomFromYoutube = (): UseMutationOptions<
  unknown,
  Error,
  Dto['youtube']['postImportFromYoutube']['body']
> => ({
  mutationFn: async (params) => {
    const apiClient = await getApiClient();
    const result = await apiClient.post(API.importFromYoutube(), params);
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

export const useMutateUploadRandomFromYoutube = () =>
  useMutation(mutateUploadRandomFromYoutube());
