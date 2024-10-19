import { api } from '@/api';
import { TMediaEndpointResult } from '@august-tv/generated-types';
import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { KEY } from './keys';

export const queryMyMedia = (): UndefinedInitialDataOptions<
  TMediaEndpointResult<'getMyMedia'>
> => ({
  queryKey: KEY.MY_MEDIA,
  queryFn: async () => {
    const { data } = await api((r) => r.media.my).get();
    return data;
  }
});

export const useQueryMyMedia = () => useQuery(queryMyMedia());
