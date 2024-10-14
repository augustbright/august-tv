import { API, getApiClient } from '@/api';
import { TFeedEndpointResult } from '@august-tv/dto';
import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { KEY } from './keys';

export const queryFeedLatest = (): UndefinedInitialDataOptions<
  TFeedEndpointResult<'getLatestFeed'>
> => ({
  queryKey: KEY.FEED,
  queryFn: async () => {
    const apiClient = await getApiClient();
    const { data } = await apiClient.get(API.feedLatest());
    return data;
  }
});

export const useQueryFeedLatest = () => useQuery(queryFeedLatest());
