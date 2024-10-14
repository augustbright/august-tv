import { API, getApiClient } from '@/api';
import { TMediaEndpointResult } from '@august-tv/dto';
import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { KEY } from './keys';

export const queryMedia = (
  id: string | null
): UndefinedInitialDataOptions<TMediaEndpointResult<'getMediaById'>> => ({
  queryKey: KEY.VIDEO(id as string),
  enabled: !!id,
  queryFn: async () => {
    const apiClient = await getApiClient();
    const { data } = await apiClient.get(API.mediaById(id as string));
    return data;
  }
});

export const useQueryMedia = (id: string | null) => useQuery(queryMedia(id));
