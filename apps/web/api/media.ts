import { TVideoEndpointResult } from '@august-tv/generated-types';
import { ImageCropDto, PatchMediaDto } from '@august-tv/generated-types/dto';

import { createMutableEndpoint } from './createMutableEndpoint';
import { createReadableEndpoint } from './createReadableEndpoint';
import { validateMediaFile, validatePictureFile } from './validators';

export const getMediaById = createReadableEndpoint<
  { mediaId: string },
  TVideoEndpointResult<'getMediaById'>
>({
  prepareUrl: ({ mediaId }) => `/video/${mediaId}`
});

export const deleteMedia = createMutableEndpoint<
  { mediaId: string },
  TVideoEndpointResult<'deleteMedia'>
>({
  method: 'delete',
  prepareUrl: ({ mediaId }) => `/video/${mediaId}`,
  onSuccess(queryClient) {
    queryClient.invalidateQueries({ queryKey: ['video', 'my'] });
  }
});

export const postMediaRate = createMutableEndpoint<
  {
    mediaId: string;
    type: string | null;
  },
  TVideoEndpointResult<'rateMedia'>
>({
  method: 'post',
  prepareUrl: ({ mediaId }) => `/video/rate/${mediaId}`,
  prepareBody: ({ type }) => ({ type }),
  onSuccess(queryClient) {
    queryClient.invalidateQueries({ queryKey: ['video', 'my'] });
  }
});

export const postMediaUpload = createMutableEndpoint<File, { id: string }>({
  method: 'post',
  prepareUrl: () => '/video/upload',
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
    queryClient.invalidateQueries({ queryKey: ['video', 'my'] });
  }
});

export const getMediaMy = createReadableEndpoint<
  void,
  TVideoEndpointResult<'getMyMedia'>
>({
  prepareUrl: () => '/video/my'
});

export const getMediaThumbnails = createReadableEndpoint<
  { mediaId: string },
  TVideoEndpointResult<'getThumbnails'>
>({
  prepareUrl: ({ mediaId }) => `/video/${mediaId}/thumbnails`
});

export const postMediaUploadThumbnail = createMutableEndpoint<
  {
    mediaId: string;
    file: File;
    crop: ImageCropDto;
  },
  TVideoEndpointResult<'uploadThumbnail'>
>({
  prepareUrl: ({ mediaId }) => `/video/${mediaId}/uploadThumbnail`,
  method: 'post',
  prepareBody: ({ file, crop }) => {
    const error = validatePictureFile(file);
    if (error) {
      throw new Error(error);
    }
    const formData = new FormData();

    formData.append('file', file, file.name);

    formData.append('width', crop.width.toString());
    formData.append('height', crop.height.toString());
    formData.append('x', crop.x.toString());
    formData.append('y', crop.y.toString());

    return formData;
  },
  onSuccess(queryClient, params) {
    queryClient.invalidateQueries({ queryKey: ['video', 'my'] });
    queryClient.invalidateQueries({
      queryKey: ['video', params.mediaId]
    });
  }
});

export const patchMedia = createMutableEndpoint<
  {
    mediaId: string;
    updateVideoDto: PatchMediaDto;
  },
  TVideoEndpointResult<'patchMedia'>
>({
  method: 'patch',
  prepareUrl: ({ mediaId }) => `/video/${mediaId}`,
  prepareBody: ({ updateVideoDto }) => updateVideoDto,
  onSuccess(queryClient, { mediaId }) {
    queryClient.invalidateQueries({ queryKey: ['video', 'my'] });
    queryClient.invalidateQueries({
      queryKey: ['video', mediaId]
    });
  }
});
