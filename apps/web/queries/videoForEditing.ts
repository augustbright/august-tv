import { api } from '@/api';
import { TMediaEndpointResult } from '@august-tv/dto';
import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { KEY } from './keys';

export const queryVideoForEditing = (
  id: string | null
): UndefinedInitialDataOptions<TMediaEndpointResult<'getMediaById'>> => ({
  queryKey: KEY.VIDEO(id as string),
  enabled: !!id,
  queryFn: async () => {
    const { data } = await api((r) => r.media.edit.$(id!)).get();
    return data;
  }
});

export const useQueryVideoForEditing = (id: string | null) =>
  useQuery(queryVideoForEditing(id));
