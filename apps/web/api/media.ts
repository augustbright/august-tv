import { TMediaEndpointResult } from '@august-tv/generated-types';

import { createMutableEndpoint } from './createMutableEndpoint';
import { createReadableEndpoint } from './createReadableEndpoint';
import { validateMediaFile } from './validators';

export const getMediaById = createReadableEndpoint<
  { mediaId: string },
  TMediaEndpointResult<'getMediaById'>
>({
  prepareUrl: () => `/media`
});

export const postMediaRate = createMutableEndpoint<
  {
    mediaId: string;
    type: string | null;
  },
  TMediaEndpointResult<'rateMedia'>
>({
  method: 'post',
  prepareUrl: () => `/media/rate`
});

export const postMediaUpload = createMutableEndpoint<File, { id: string }>({
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
  }
});

export const getMediaMy = createReadableEndpoint<
  void,
  TMediaEndpointResult<'getMyMedia'>
>({
  prepareUrl: () => '/media/my'
});

export const patchMedia = createMutableEndpoint<
  {
    mediaId: string;
    updateVideoDto: { title: string; description: string; visibility: string };
  },
  TMediaEndpointResult<'patchMedia'>
>({
  method: 'patch',
  prepareUrl: () => '/media'
});
