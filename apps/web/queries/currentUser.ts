import { api } from '@/api';
import { TUserEndpointResult } from '@august-tv/dto';
import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { KEY } from './keys';

export const queryCurrentUser = (): UndefinedInitialDataOptions<
  TUserEndpointResult<'getCurrentUser'>
> => ({
  queryKey: KEY.CURRENT_USER,
  queryFn: async () => {
    const { data } = await api((r) => r.user.current).get();
    return data as TUserEndpointResult<'getCurrentUser'>;
  }
});

export const useQueryCurrentUser = () => useQuery(queryCurrentUser());
