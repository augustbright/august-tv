import { api } from '@/api';
import { TUserEndpointResult } from '@august-tv/dto';
import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';

import { KEY } from './keys';

export const queryProfilePictures = (): UndefinedInitialDataOptions<
  TUserEndpointResult<'getProfilePictures'>
> => ({
  queryKey: KEY.PROFILE_PICTURES,
  queryFn: async () => {
    const { data } = await api((r) => r.user.profilePictures).get();
    return data;
  }
});

export const useQueryProfilePictures = () => useQuery(queryProfilePictures());
