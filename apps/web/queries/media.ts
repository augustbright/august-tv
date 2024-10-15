import { api } from '@/api';
import { TMediaEndpointResult } from '@august-tv/dto';
import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { KEY } from './keys';

export const queryMedia = (
  id: string | null
): UndefinedInitialDataOptions<TMediaEndpointResult<'getMediaById'>> => ({
  ...api((r) => r.media.$(id!)).get.query<
    TMediaEndpointResult<'getMediaById'>
  >(),
  queryKey: KEY.VIDEO(id as string),
  enabled: !!id
});

export const useQueryMedia = (id: string | null) => useQuery(queryMedia(id));
