import { api } from '@/api';
import { TUserEndpointResult } from '@august-tv/generated-types';
import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { KEY, TSearchUsersQueryParams } from './keys';

export const querySearchUsers = (
  params: TSearchUsersQueryParams
): UndefinedInitialDataOptions<TUserEndpointResult<'searchUsers'>> => ({
  queryKey: KEY.SEARCH_USERS(params),
  queryFn: async () => {
    const { data } = await api((r) => r.user.search).get({
      q: params.query,
      limit: params.limit,
      cursor: params.cursor
    });
    return data;
  }
});

export const useQuerySearchUsers = (params: TSearchUsersQueryParams) =>
  useQuery(querySearchUsers(params));
