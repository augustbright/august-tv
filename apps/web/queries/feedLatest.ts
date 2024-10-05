import { FetchQueryOptions, useQuery } from '@tanstack/react-query';
import { getApiClient, API } from '@/api';
import { KEY } from './keys';
import { TVideoDto } from 'types';

export const queryFeedLatest = (): FetchQueryOptions<{
  data: TVideoDto[];
}> => ({
  queryKey: KEY.FEED,
  queryFn: async () => {
    const apiClient = await getApiClient();
    const { data } = await apiClient.get(API.feedLatest());
    return data;
  },
});

export const useQueryFeedLatest = () => useQuery(queryFeedLatest());
