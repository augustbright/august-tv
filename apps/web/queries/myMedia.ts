import { API, getApiClient } from '@/api';
import { TMediaEndpointResult } from '@august-tv/dto';
import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { KEY } from './keys';

export const queryMyMedia = (): UndefinedInitialDataOptions<
  TMediaEndpointResult<'getMyMedia'>
> => ({
  queryKey: KEY.MY_MEDIA,
  queryFn: async () => {
    const apiClient = await getApiClient();
    const { data } = await apiClient.get(API.myMedia());
    return data;
  }
});

export const useQueryMyMedia = () => useQuery(queryMyMedia());
