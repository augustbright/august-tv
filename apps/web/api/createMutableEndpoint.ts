import { getQueryClient } from '@/api/queryClient';
import {
  QueryClient,
  UseMutationOptions,
  UseMutationResult,
  useMutation
} from '@tanstack/react-query';

import { getApiClient } from './client';

type TMutableEndpointConfig<P, R> = {
  prepareUrl: (params: P) => string;
  prepareBody?: (params: P) => unknown;
  method: 'post' | 'put' | 'patch' | 'delete';
  onSuccess?: (
    queryClient: QueryClient,
    params: P,
    data: R
  ) => void | Promise<void>;
};

type TMutableEndpoint<P, R> = {
  mutate: (params: P) => Promise<R>;
  mutation: (params: P) => UseMutationOptions<R, Error, P>;
  useMutation: () => UseMutationResult<R, Error, P>;
};

export const createMutableEndpoint = <P, R>(
  config: TMutableEndpointConfig<P, R>
): TMutableEndpoint<P, R> => {
  const mutate = async (params: P) => {
    const client = await getApiClient();
    let response;
    const url = config.prepareUrl(params);
    const body = config.prepareBody ? config.prepareBody(params) : undefined;
    if (
      config.method === 'post' ||
      config.method === 'put' ||
      config.method === 'patch'
    ) {
      response = await client[config.method](url, body);
    } else if (config.method === 'delete') {
      response = await client.delete(url, { params: body });
    }

    if (config.onSuccess) {
      await config.onSuccess(await getQueryClient(), params, response?.data);
    }

    return response?.data;
  };

  const mutation = () => ({
    mutationFn: (params: P) => mutate(params)
  });

  return {
    mutate,
    mutation,
    useMutation: () => useMutation(mutation())
  };
};
