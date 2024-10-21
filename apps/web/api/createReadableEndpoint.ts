import {
  UndefinedInitialDataOptions,
  UseQueryResult,
  useQuery
} from '@tanstack/react-query';

import { getApiClient } from './client';

type TReadableEndpointConfig<P> = {
  prepareUrl: (params: P) => string;
  prepareParams?: (params: P) => unknown;
};

type TReadableEndpoint<P, R> = {
  get: (params: P) => Promise<R>;
  query: (params: P) => UndefinedInitialDataOptions<R>;
  useQuery: (params: P) => UseQueryResult<R>;
};

export const createReadableEndpoint = <P, R>(
  config: TReadableEndpointConfig<P>
): TReadableEndpoint<P, R> => {
  const get = async (params: P) => {
    const client = await getApiClient();
    const url = config.prepareUrl(params);
    const { data } = await client.get(url, {
      params: config.prepareParams ? config.prepareParams(params) : undefined
    });

    return data;
  };

  const query = (params: P) => ({
    queryKey: [config.prepareUrl(params).split('/'), params],
    queryFn: () => get(params)
  });

  return {
    get,
    query,
    useQuery: (params: P) => useQuery(query(params))
  };
};
