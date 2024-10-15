import { api } from '@/api';
import { TUserEndpointResult } from '@august-tv/dto';
import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { KEY } from './keys';

export const queryMyJobs = (): UndefinedInitialDataOptions<
  TUserEndpointResult<'getMyJobs'>
> => ({
  queryKey: KEY.MY_JOBS,
  queryFn: async () => {
    const { data } = await api((r) => r.user.myJobs).get();
    return data;
  }
});

export const useQueryMyJobs = () => useQuery(queryMyJobs());
