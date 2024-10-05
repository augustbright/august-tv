import { UndefinedInitialDataOptions, useQuery } from '@tanstack/react-query';
import { getApiClient, API } from '@/api';
import { KEY } from './keys';
import { TVideoForEditingDto } from 'types';

export const queryVideoForEditing = (
  id: string | null
): UndefinedInitialDataOptions<TVideoForEditingDto> => ({
  queryKey: KEY.VIDEO(id as string),
  enabled: !!id,
  queryFn: async () => {
    const apiClient = await getApiClient();
    const { data } = await apiClient.get(API.videoForEditing(id as string));
    return data;
  },
});

export const useQueryVideoForEditing = (id: string | null) =>
  useQuery(queryVideoForEditing(id));
