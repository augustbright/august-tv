import { API, getApiClient } from '@/api';
import { TUserEndpointResult } from '@august-tv/dto';
import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { KEY } from './keys';

export const queryMySubscriptions = (): UndefinedInitialDataOptions<
  TUserEndpointResult<'getMySubscriptions'>
> => ({
  queryKey: KEY.MY_SUBSCRIPTIONS,
  queryFn: async () => {
    const apiClient = await getApiClient();
    const { data } = await apiClient.get(API.mySubscriptions());
    return data;
  }
});

export const useQueryMySubscriptions = () => useQuery(queryMySubscriptions());
