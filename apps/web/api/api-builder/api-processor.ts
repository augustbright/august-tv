/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  UndefinedInitialDataOptions,
  UseMutationOptions
} from '@tanstack/react-query';

import { AxiosRequestConfig, AxiosResponse } from 'axios';

import { getApiClient } from '../client';
import { Api, ApiSchema, makeApiProcessor } from './api-builder';

type TAwesomeQueryOptions<T> = {
  params?: AxiosRequestConfig['params'];
  onSuccess?: (data: T) => void | Promise<void>;
};

type TAwesomeQueryOptionsWithSelector<T, S = unknown> = {
  params?: AxiosRequestConfig['params'];
  selector: (data: T) => S | Promise<S>;
  onSuccess?: (data: T) => void | Promise<void>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare function queryExtension<T>(
  options?: TAwesomeQueryOptions<T>
): UndefinedInitialDataOptions<T>;

declare function queryExtension<T, S>(
  options?: TAwesomeQueryOptionsWithSelector<T, S>
): UndefinedInitialDataOptions<S>;

type TAwesomeMutationOptions<T> = {
  data: AxiosRequestConfig['data'];
  onSuccess?: (data: T) => void | Promise<void>;
};

type TAwesomeMutationOptionsWithSelector<T, S = unknown> = {
  data: AxiosRequestConfig['data'];
  selector: (data: T) => S | Promise<S>;
  onSuccess?: (data: T) => void | Promise<void>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare function mutationExtension<T>(
  options?: TAwesomeMutationOptions<T>
): UseMutationOptions;

declare function mutationExtension<T, S>(
  options?: TAwesomeMutationOptionsWithSelector<T, S>
): UseMutationOptions;

export const makeAwesomeApiProcessor = <T extends ApiSchema>(api: Api<T>) => {
  return makeApiProcessor(api, (path) => {
    const tools = {
      get path() {
        return path;
      },

      async get<T = any, R = AxiosResponse<T>, D = any>(
        params: AxiosRequestConfig<D>['params'] = {},
        config: AxiosRequestConfig<D> = {}
      ): Promise<R> {
        const client = await getApiClient();
        return client.get(path, {
          ...config,
          params
        });
      },
      async post<T = any, R = AxiosResponse<T>, D = any>(
        data: AxiosRequestConfig<D>['data'],
        config: AxiosRequestConfig<D> = {}
      ): Promise<R> {
        const client = await getApiClient();
        return client.post(path, data, config);
      },
      async patch<T = any, R = AxiosResponse<T>, D = any>(
        data: AxiosRequestConfig<D>['data'],
        config: AxiosRequestConfig<D> = {}
      ): Promise<R> {
        const client = await getApiClient();
        return client.patch(path, data, config);
      },
      async delete<T = any, R = AxiosResponse<T>, D = any>(
        config: AxiosRequestConfig<D> = {}
      ): Promise<R> {
        const client = await getApiClient();
        return client.delete(path, config);
      },
      async put<T = any, R = AxiosResponse<T>, D = any>(
        data: AxiosRequestConfig<D>['data'],
        config: AxiosRequestConfig<D> = {}
      ): Promise<R> {
        const client = await getApiClient();
        return client.put(path, data, config);
      },
      async head<T = any, R = AxiosResponse<T>, D = any>(
        config: AxiosRequestConfig<D> = {}
      ): Promise<R> {
        const client = await getApiClient();
        return client.head(path, config);
      },
      async options<T = any, R = AxiosResponse<T>, D = any>(
        config: AxiosRequestConfig<D> = {}
      ): Promise<R> {
        const client = await getApiClient();
        return client.options(path, config);
      },
      async request<T = any, R = AxiosResponse<T>, D = any>(
        config: AxiosRequestConfig<D> = {}
      ): Promise<R> {
        const client = await getApiClient();
        return client.request({ ...config, url: path });
      }
    };

    Object.defineProperty(tools.get, 'query', {
      value: ({
        params,
        selector,
        onSuccess
      }: TAwesomeQueryOptionsWithSelector<unknown>): UndefinedInitialDataOptions => ({
        queryKey: [path, params],
        queryFn: async () => {
          const result = await tools.get<T>(params);
          if (selector) {
            const selected = await selector(result.data);
            if (onSuccess) await onSuccess(result.data);
            return selected;
          }
          if (onSuccess) await onSuccess(result.data);
          return result.data;
        }
      })
    });

    Object.defineProperty(tools.options, 'query', {
      value: ({
        params,
        selector,
        onSuccess
      }: TAwesomeQueryOptionsWithSelector<unknown>): UndefinedInitialDataOptions => ({
        queryKey: [path, params],
        queryFn: async () => {
          const result = await tools.options<T>(params);
          if (selector) {
            const selected = await selector(result.data);
            if (onSuccess) await onSuccess(result.data);
            return selected;
          }
          if (onSuccess) await onSuccess(result.data);
          return result.data;
        }
      })
    });

    Object.defineProperty(tools.post, 'mutation', {
      value: ({
        data,
        onSuccess,
        selector
      }: TAwesomeMutationOptionsWithSelector<unknown>): UseMutationOptions => ({
        mutationFn: async () => {
          const result = await tools.post<T>(data);
          if (selector) {
            const selected = await selector(result.data);
            if (onSuccess) await onSuccess(result.data);
            return selected;
          }
          if (onSuccess) await onSuccess(result.data);
          return result.data;
        }
      })
    });

    return tools as typeof tools & {
      get: typeof tools.get & {
        query: typeof queryExtension;
      };
      post: typeof tools.post & {
        mutation: typeof mutationExtension;
      };
    };
  });
};
