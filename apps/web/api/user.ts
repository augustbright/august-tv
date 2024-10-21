import { TUserEndpointResult } from '@august-tv/generated-types';
import { ImageCropDto } from '@august-tv/generated-types/dto';

import { Crop } from 'react-image-crop';

import { createMutableEndpoint } from './createMutableEndpoint';
import { createReadableEndpoint } from './createReadableEndpoint';
import { validatePictureFile } from './validators';

export const postUserSessionLogin = createMutableEndpoint<
  { idToken: string },
  TUserEndpointResult<'sessionLogin'>
>({
  method: 'post',
  prepareUrl: () => '/user/sessionLogin',
  prepareBody: ({ idToken }) => ({ idToken })
});

export const postUserSignOut = createMutableEndpoint<
  void,
  TUserEndpointResult<'signOut'>
>({
  prepareUrl: () => '/user/sign-out',
  method: 'post'
});

export const getUserCurrent = createReadableEndpoint<
  void,
  TUserEndpointResult<'getCurrentUser'>
>({
  prepareUrl: () => '/user/current'
});

export const getUserMyJobs = createReadableEndpoint<
  void,
  TUserEndpointResult<'getMyJobs'>
>({
  prepareUrl: () => '/user/myJobs'
});

export const postUserUnobserveJob = createMutableEndpoint<
  { jobId: string },
  TUserEndpointResult<'unobserveJob'>
>({
  method: 'post',
  prepareUrl: () => `/user/unobserveJob`,
  prepareBody: (data) => data
});

export const getUserMySubscriptions = createReadableEndpoint<
  void,
  TUserEndpointResult<'getMySubscriptions'>
>({
  prepareUrl: () => '/user/mySubscriptions'
});

export const postUserSubscribe = createMutableEndpoint<
  { authorId: string },
  TUserEndpointResult<'subscribe'>
>({
  method: 'post',
  prepareUrl: () => '/user/subscribe',
  prepareBody: ({ authorId }) => ({ authorId })
});

export const postUserUnsubscribe = createMutableEndpoint<
  { authorId: string },
  TUserEndpointResult<'unsubscribe'>
>({
  method: 'post',
  prepareUrl: () => '/user/unsubscribe',
  prepareBody: ({ authorId }) => ({ authorId })
});

export const getUserSearch = createReadableEndpoint<
  {
    query: string;
    cursor?: number;
    limit?: number;
  },
  TUserEndpointResult<'searchUsers'>
>({
  prepareUrl: () => '/user/search',
  prepareParams: ({ query, cursor, limit }) => ({
    q: query,
    cursor,
    limit
  })
});

export const getUserProfilePictures = createReadableEndpoint<
  void,
  TUserEndpointResult<'getProfilePictures'>
>({
  prepareUrl: () => '/user/profilePictures'
});

export const postUserUploadProfilePicture = createMutableEndpoint<
  {
    file: File;
    crop: Crop;
  },
  TUserEndpointResult<'uploadProfilePicture'>
>({
  prepareUrl: () => '/user/uploadProfilePicture',
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
  }
});

export const postUserUpdateProfilePicture = createMutableEndpoint<
  {
    imageId: string;
    crop: ImageCropDto;
  },
  TUserEndpointResult<'updateProfilePicture'>
>({
  prepareUrl: () => '/user/updateProfilePicture',
  prepareBody: ({ imageId, crop }) => ({ imageId, crop }),
  method: 'post'
});

export const postUserUnsetProfilePicture = createMutableEndpoint<
  void,
  TUserEndpointResult<'unsetProfilePicture'>
>({
  prepareUrl: () => '/user/unsetProfilePicture',
  method: 'post'
});
