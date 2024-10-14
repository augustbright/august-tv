import { API, getApiClient } from '@/api';
import { TUserEndpointResult } from '@august-tv/dto';
import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { KEY } from './keys';

export const queryMyJobs = (): UndefinedInitialDataOptions<
  TUserEndpointResult<'getMyJobs'>
> => ({
  queryKey: KEY.MY_JOBS,
  queryFn: async () => {
    const apiClient = await getApiClient();
    const { data } = await apiClient.get(API.myJobs());
    return data;
  }
});

export const useQueryMyJobs = () => useQuery(queryMyJobs());
