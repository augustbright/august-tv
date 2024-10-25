import { CreateTagDto, TTagsEndpointResult } from '@august-tv/generated-types';

import { createMutableEndpoint } from './createMutableEndpoint';
import { createReadableEndpoint } from './createReadableEndpoint';

export const getTagsSearch = createReadableEndpoint<
  { query: string },
  TTagsEndpointResult<'searchTags'>
>({
  prepareUrl: () => '/tags/search',
  prepareParams({ query }) {
    return { q: query };
  }
});

export const postTagsCreate = createMutableEndpoint<
  CreateTagDto,
  TTagsEndpointResult<'createTag'>
>({
  method: 'post',
  prepareUrl: () => '/tags/create',
  prepareBody(params) {
    return params;
  },
  onSuccess(queryClient) {
    queryClient.invalidateQueries({
      queryKey: ['tags', 'search']
    });
  }
});
