import { API, getApiClient } from '@/api';
import { TUserEndpointResult } from '@august-tv/dto';
import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { KEY } from './keys';

export const queryCurrentUser = (): UndefinedInitialDataOptions<
  TUserEndpointResult<'getCurrentUser'>
> => ({
  queryKey: KEY.CURRENT_USER,
  queryFn: async () => {
    const apiClient = await getApiClient();
    const { data } = await apiClient.get(API.currentUser());
    return data;
  }
});

export const useQueryCurrentUser = () => useQuery(queryCurrentUser());
