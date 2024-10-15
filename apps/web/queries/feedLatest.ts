import { api } from '@/api';
import { TFeedEndpointResult } from '@august-tv/dto';
import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { KEY } from './keys';

export const queryFeedLatest = (): UndefinedInitialDataOptions<
  TFeedEndpointResult<'getLatestFeed'>
> => ({
  queryKey: KEY.FEED,
  queryFn: async () => {
    const { data } = await api((r) => r.feed.latest).get();
    return data;
  }
});

export const useQueryFeedLatest = () => useQuery(queryFeedLatest());
