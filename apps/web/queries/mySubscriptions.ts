import { api } from '@/api';
import { TUserEndpointResult } from '@august-tv/generated-types';
import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { KEY } from './keys';

export const queryMySubscriptions = (): UndefinedInitialDataOptions<
  TUserEndpointResult<'getMySubscriptions'>
> => ({
  queryKey: KEY.MY_SUBSCRIPTIONS,
  queryFn: async () => {
    const { data } = await api((r) => r.user.mySubscriptions).get();
    return data;
  }
});

export const useQueryMySubscriptions = () => useQuery(queryMySubscriptions());
