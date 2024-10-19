import { api } from '@/api';
import { TFeedEndpointResult } from '@august-tv/generated-types';
import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { KEY } from './keys';

export const queryFeedSubscriptions = (): UndefinedInitialDataOptions<
  TFeedEndpointResult<'getSubscriptionsFeed'>
> => ({
  queryKey: KEY.FEED_SUBSCRIPTIONS,
  queryFn: async () => {
    const { data } = await api((r) => r.feed.subscriptions).get();
    return data;
  }
});

export const useQueryFeedSubscriptions = () =>
  useQuery(queryFeedSubscriptions());
