import {
  CategoryDto,
  TCategoriesEndpointResult
} from '@august-tv/generated-types';

import { createMutableEndpoint } from './createMutableEndpoint';
import { createReadableEndpoint } from './createReadableEndpoint';

export const getCategories = createReadableEndpoint<
  void,
  TCategoriesEndpointResult<'getCategories'>
>({
  prepareUrl: () => '/categories'
});

export const postCategories = createMutableEndpoint<
  CategoryDto,
  TCategoriesEndpointResult<'createCategory'>
>({
  method: 'post',
  prepareUrl: () => '/categories',
  prepareBody(params) {
    return params;
  },
  onSuccess(queryClient) {
    queryClient.invalidateQueries({ queryKey: ['categories'] });
  }
});

export const patchCategories = createMutableEndpoint<
  { id: number; data: CategoryDto },
  TCategoriesEndpointResult<'updateCategory'>
>({
  method: 'patch',
  prepareUrl: ({ id }) => `/categories/${id}`,
  prepareBody({ data }) {
    return data;
  },
  onSuccess(queryClient) {
    queryClient.invalidateQueries({ queryKey: ['categories'] });
  }
});

export const deleteCategories = createMutableEndpoint<
  { id: number },
  TCategoriesEndpointResult<'deleteCategory'>
>({
  method: 'delete',
  prepareUrl: ({ id }) => `/categories/${id}`,
  onSuccess(queryClient) {
    queryClient.invalidateQueries({ queryKey: ['categories'] });
  }
});
