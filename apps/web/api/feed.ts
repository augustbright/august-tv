import { TFeedEndpointResult } from '@august-tv/generated-types';

import { createReadableEndpoint } from './createReadableEndpoint';

export const getFeedLatest = createReadableEndpoint<
  void,
  TFeedEndpointResult<'getLatestFeed'>
>({
  prepareUrl: () => '/feed/latest'
});

export const getFeedSubscriptions = createReadableEndpoint<
  void,
  TFeedEndpointResult<'getSubscriptionsFeed'>
>({
  prepareUrl: () => '/feed/subscriptions'
});
