import { TMediaEndpointResult } from '@august-tv/generated-types';
import { PatchMediaDto } from '@august-tv/generated-types/dto';

import { createMutableEndpoint } from './createMutableEndpoint';
import { createReadableEndpoint } from './createReadableEndpoint';
import { validateMediaFile } from './validators';

export const getMediaById = createReadableEndpoint<
  { mediaId: string; },
  TMediaEndpointResult<'getMediaById'>
>({
  prepareUrl: ({ mediaId }) => `/media/${mediaId}`
});

export const deleteMedia = createMutableEndpoint<
  { mediaId: string; },
  TMediaEndpointResult<'deleteMedia'>
>({
  method: 'delete',
  prepareUrl: ({ mediaId }) => `/media/${mediaId}`,
  onSuccess(queryClient) {
    queryClient.invalidateQueries({ queryKey: ['media', 'my'] });
  }
});

export const postMediaRate = createMutableEndpoint<
  {
    mediaId: string;
    type: string | null;
  },
  TMediaEndpointResult<'rateMedia'>
>({
  method: 'post',
  prepareUrl: ({ mediaId }) => `/media/rate/${mediaId}`,
  prepareBody: ({ type }) => ({ type }),
  onSuccess(queryClient) {
    queryClient.invalidateQueries({ queryKey: ['media', 'my'] });
  }
});

export const postMediaUpload = createMutableEndpoint<File, { id: string; }>({
  method: 'post',
  prepareUrl: () => '/media/upload',
  prepareBody: (file) => {
    const error = validateMediaFile(file);
    if (error) {
      throw new Error(error);
    }
    const formData = new FormData();

    formData.append('file', file, file.name);
    return formData;
  },
  onSuccess(queryClient) {
    queryClient.invalidateQueries({ queryKey: ['media', 'my'] });
  }
});

export const getMediaMy = createReadableEndpoint<
  void,
  TMediaEndpointResult<'getMyMedia'>
>({
  prepareUrl: () => '/media/my'
});

export const getMediaThumbnails = createReadableEndpoint<
  { mediaId: string; },
  TMediaEndpointResult<'getThumbnails'>>({
    prepareUrl: ({ mediaId }) => `/media/${mediaId}/thumbnails`
  });

export const patchMedia = createMutableEndpoint<
  {
    mediaId: string;
    updateVideoDto: PatchMediaDto;
  },
  TMediaEndpointResult<'patchMedia'>
>({
  method: 'patch',
  prepareUrl: ({ mediaId }) => `/media/${mediaId}`,
  prepareBody: ({ updateVideoDto }) => updateVideoDto,
  onSuccess(queryClient, { mediaId }) {
    queryClient.invalidateQueries({ queryKey: ['media', 'my'] });
    queryClient.invalidateQueries({
      queryKey: ['media', mediaId]
    });
  }
});
