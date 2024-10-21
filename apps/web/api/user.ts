import { TUserEndpointResult } from '@august-tv/generated-types';

import { Crop } from 'react-image-crop';

import { createMutableEndpoint } from './createMutableEndpoint';
import { createReadableEndpoint } from './createReadableEndpoint';
import { validatePictureFile } from './validators';

export const postUserSessionLogin = createMutableEndpoint<
  void,
  TUserEndpointResult<'sessionLogin'>
>({
  prepareUrl: () => '/user/session/login',
  method: 'post'
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
  prepareUrl: ({ jobId }) => `/user/unobserveJob/${jobId}`,
  method: 'post'
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
  prepareUrl: () => '/user/subscribe',
  method: 'post'
});

export const postUserUnsubscribe = createMutableEndpoint<
  { authorId: string },
  TUserEndpointResult<'unsubscribe'>
>({
  prepareUrl: () => '/user/unsubscribe',
  method: 'post'
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
    crop: Crop;
  },
  TUserEndpointResult<'updateProfilePicture'>
>({
  prepareUrl: () => '/user/updateProfilePicture',
  method: 'post'
});

export const postUserUnsetProfilePicture = createMutableEndpoint<
  void,
  TUserEndpointResult<'unsetProfilePicture'>
>({
  prepareUrl: () => '/user/unsetProfilePicture',
  method: 'post'
});
