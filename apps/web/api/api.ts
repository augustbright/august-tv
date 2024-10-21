import {
  TFeedEndpointResult,
  TJobsEndpointResult,
  TMediaEndpointResult,
  TUserEndpointResult,
  TYoutubeEndpointResult
} from '@august-tv/generated-types';
import {
  UndefinedInitialDataOptions,
  UseMutationOptions
} from '@tanstack/react-query';

import { Crop } from 'react-image-crop';

import { getApiClient } from './client';

// REQUESTS

export const apiGetHealth = async () => (await getApiClient()).get('/health');

export const apiGetFeedLatest = async () =>
  (await getApiClient()).get<TFeedEndpointResult<'getLatestFeed'>>(
    '/feed/latest'
  );

export const apiGetFeedSubscriptions = async () =>
  (await getApiClient()).get<TFeedEndpointResult<'getSubscriptionsFeed'>>(
    '/feed/subscriptions'
  );

export const apiPostUserSessionLogin = async () =>
  (await getApiClient()).post<TUserEndpointResult<'sessionLogin'>>(
    '/user/session-login'
  );

export const apiPostUserSignOut = async () =>
  (await getApiClient()).post<TUserEndpointResult<'signOut'>>('/user/sign-out');

export const apiGetUserCurrent = async () =>
  (await getApiClient()).get<TUserEndpointResult<'getCurrentUser'>>(
    '/user/current'
  );

export const apiGetUserMyJobs = async () =>
  (await getApiClient()).get<TUserEndpointResult<'getMyJobs'>>('/user/myJobs');

export const apiPostUserUnobserveJob = async (data: { jobId: string }) =>
  (await getApiClient()).post<TUserEndpointResult<'unobserveJob'>>(
    '/user/unobserveJob',
    data
  );

export const apiGetUserMySubscriptions = async () =>
  (await getApiClient()).get<TUserEndpointResult<'getMySubscriptions'>>(
    '/user/mySubscriptions'
  );

export const apiPostUserSubscribe = async (data: { authorId: string }) =>
  (await getApiClient()).post<TUserEndpointResult<'subscribe'>>(
    '/user/subscribe',
    data
  );

export const apiPostUserUnsubscribe = async (data: { authorId: string }) =>
  (await getApiClient()).post<TUserEndpointResult<'unsubscribe'>>(
    '/user/unsubscribe',
    data
  );

export const apiGetUserSearch = async (data: {
  q: string;
  cursor?: number;
  limit?: number;
}) =>
  (await getApiClient()).get<TUserEndpointResult<'searchUsers'>>(
    '/user/search',
    { params: data }
  );

export const apiGetUserProfilePictures = async () =>
  (await getApiClient()).get<TUserEndpointResult<'getProfilePictures'>>(
    '/user/profilePictures'
  );

export const apiPostUserUploadProfilePicture = async (data: FormData) =>
  (await getApiClient()).post<TUserEndpointResult<'uploadProfilePicture'>>(
    '/user/uploadProfilePicture',
    data
  );

export const apiPostUserUpdateProfilePicture = async (data: FormData) =>
  (await getApiClient()).post<TUserEndpointResult<'updateProfilePicture'>>(
    '/user/updateProfilePicture',
    data
  );

export const apiPostUserUnsetProfilePicture = async () =>
  (await getApiClient()).post<TUserEndpointResult<'unsetProfilePicture'>>(
    '/user/unsetProfilePicture'
  );

export const apiGetMedia = async (data: { mediaId: string }) =>
  (await getApiClient()).get<TMediaEndpointResult<'getMediaById'>>(
    `/media/${data.mediaId}`
  );

export const apiPostMediaRate = async (data: {
  mediaId: string;
  rating: number;
}) =>
  (await getApiClient()).post<TMediaEndpointResult<'rateMedia'>>(
    `/media/${data.mediaId}/rate`,
    data
  );

export const apiPostMediaUpload = async (data: FormData) =>
  (await getApiClient()).post<TMediaEndpointResult<'uploadMedia'>>(
    '/media/upload',
    data
  );

export const apiGetMediaMy = async () =>
  (await getApiClient()).get<TMediaEndpointResult<'getMyMedia'>>('/media/my');

export const apiPostMediaEdit = async (data: { mediaId: string }) =>
  (await getApiClient()).patch<TMediaEndpointResult<'patchMedia'>>(
    `/media/${data.mediaId}/edit`,
    data
  );

export const apiPostYoutubeImportFromYoutube = async () =>
  (await getApiClient()).post<TYoutubeEndpointResult<'importFromYoutube'>>(
    '/youtube/import-from-youtube'
  );

export const apiPostJobsTest = async () =>
  (await getApiClient()).get<TJobsEndpointResult<'testJob'>>('/jobs/test');

// QUERIES & MUTATIONS

const makeApiQuery = <R>(
  options: UndefinedInitialDataOptions<R>
): UndefinedInitialDataOptions<R> => options;

const makeApiMutation = <R, T = void>(
  options: UseMutationOptions<R, unknown, T>
): UseMutationOptions<R, unknown, T> => options;

export const queryFeedLatest = () =>
  makeApiQuery<TFeedEndpointResult<'getLatestFeed'>>({
    queryKey: ['feed', 'latest'],
    queryFn: async () => {
      const { data } = await apiGetFeedLatest();
      return data;
    }
  });

export const queryFeedSubscriptions = () =>
  makeApiQuery<TFeedEndpointResult<'getSubscriptionsFeed'>>({
    queryKey: ['feed', 'subscriptions'],
    queryFn: async () => {
      const { data } = await apiGetFeedSubscriptions();
      return data;
    }
  });

export const mutationUserSessionLogin = () =>
  makeApiMutation<TUserEndpointResult<'sessionLogin'>>({
    mutationKey: ['user', 'sessionLogin'],
    mutationFn: async () => {
      const { data } = await apiPostUserSessionLogin();
      return data;
    }
  });

export const mutationUserSignOut = () =>
  makeApiMutation<TUserEndpointResult<'signOut'>>({
    mutationKey: ['user', 'signOut'],
    mutationFn: async () => {
      const { data } = await apiPostUserSignOut();
      return data;
    }
  });

export const queryUserCurrent = () =>
  makeApiQuery<TUserEndpointResult<'getCurrentUser'>>({
    queryKey: ['user', 'current'],
    queryFn: async () => {
      const { data } = await apiGetUserCurrent();
      return data;
    }
  });

export const queryUserMyJobs = () =>
  makeApiQuery<TUserEndpointResult<'getMyJobs'>>({
    queryKey: ['user', 'myJobs'],
    queryFn: async () => {
      const { data } = await apiGetUserMyJobs();
      return data;
    }
  });

export const mutationUserUnobserveJob = () =>
  makeApiMutation<TUserEndpointResult<'unobserveJob'>, { jobId: string }>({
    mutationKey: ['user', 'unobserveJob'],
    mutationFn: async (data) => {
      const { data: responseData } = await apiPostUserUnobserveJob(data);
      return responseData;
    }
  });

export const queryUserMySubscriptions = () =>
  makeApiQuery<TUserEndpointResult<'getMySubscriptions'>>({
    queryKey: ['user', 'mySubscriptions'],
    queryFn: async () => {
      const { data } = await apiGetUserMySubscriptions();
      return data;
    }
  });

export const mutationUserSubscribe = () =>
  makeApiMutation<TUserEndpointResult<'subscribe'>, { authorId: string }>({
    mutationKey: ['user', 'subscribe'],
    mutationFn: async (data) => {
      const { data: responseData } = await apiPostUserSubscribe(data);
      return responseData;
    }
  });

export const mutationUserUnsubscribe = () =>
  makeApiMutation<TUserEndpointResult<'unsubscribe'>, { authorId: string }>({
    mutationKey: ['user', 'unsubscribe'],
    mutationFn: async (data) => {
      const { data: responseData } = await apiPostUserUnsubscribe(data);
      return responseData;
    }
  });

export const queryUserSearch = (data: {
  q: string;
  cursor?: number;
  limit?: number;
}) =>
  makeApiQuery<TUserEndpointResult<'searchUsers'>>({
    queryKey: ['user', 'search'],
    queryFn: async () => {
      const { data: response } = await apiGetUserSearch(data);
      return response;
    }
  });

export const queryUserProfilePictures = () =>
  makeApiQuery<TUserEndpointResult<'getProfilePictures'>>({
    queryKey: ['user', 'profilePictures'],
    queryFn: async () => {
      const { data } = await apiGetUserProfilePictures();
      return data;
    }
  });

export const mutationUserUploadProfilePicture = () =>
  makeApiMutation<
    TUserEndpointResult<'uploadProfilePicture'>,
    {
      file: File;
      crop: Crop;
    }
  >({
    mutationKey: ['user', 'uploadProfilePicture'],
    mutationFn: async (data) => {
      const { file, crop } = data;
      const validatePictureFile = (media: File) => {
        if (media.size > 5 * 1024 * 1024) {
          return 'File size is too large';
        }

        if (!media.type.startsWith('image')) {
          return 'File type is not supported';
        }

        return null;
      };

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

      const { data: responseData } =
        await apiPostUserUploadProfilePicture(formData);
      return responseData;
    }
  });

export const mutationUserUpdateProfilePicture = () =>
  makeApiMutation<
    TUserEndpointResult<'updateProfilePicture'>,
    {
      imageId: string;
      crop: Crop;
    }
  >({
    mutationKey: ['user', 'updateProfilePicture'],
    mutationFn: async (data) => {
      const { imageId, crop } = data;
      const formData = new FormData();

      formData.append('imageId', imageId);
      formData.append('width', crop.width.toString());
      formData.append('height', crop.height.toString());
      formData.append('x', crop.x.toString());
      formData.append('y', crop.y.toString());

      const { data: responseData } =
        await apiPostUserUpdateProfilePicture(formData);
      return responseData;
    }
  });

export const mutationUserUnsetProfilePicture = () =>
  makeApiMutation<TUserEndpointResult<'unsetProfilePicture'>>({
    mutationKey: ['user', 'unsetProfilePicture'],
    mutationFn: async () => {
      const { data } = await apiPostUserUnsetProfilePicture();
      return data;
    }
  });

export const queryMedia = (data: { mediaId: string }) =>
  makeApiQuery<TMediaEndpointResult<'getMediaById'>>({
    queryKey: ['media', data.mediaId],
    queryFn: async () => {
      const { data: response } = await apiGetMedia(data);
      return response;
    }
  });

export const mutationMediaRate = () =>
  makeApiMutation<
    TMediaEndpointResult<'rateMedia'>,
    {
      mediaId: string;
      rating: number;
    }
  >({
    mutationKey: ['media', 'rateMedia'],
    mutationFn: async (data) => {
      const { data: responseData } = await apiPostMediaRate(data);
      return responseData;
    }
  });

export const mutationPostMediaUpload = () =>
  makeApiMutation<TMediaEndpointResult<'uploadMedia'>, File>({
    mutationKey: ['media', 'uploadMedia'],
    mutationFn: async (file) => {
      const validateMediaFile = (media: File) => {
        if (media.size > 50 * 1024 * 1024) {
          return 'File size is too large';
        }

        if (!media.type.startsWith('video/')) {
          return 'File type is not supported';
        }

        return null;
      };

      const error = validateMediaFile(file);
      if (error) {
        throw new Error(error);
      }
      const formData = new FormData();

      formData.append('file', file, file.name);

      const { data: responseData } = await apiPostMediaUpload(formData);
      return responseData;
    }
  });

export const queryMediaMy = () =>
  makeApiQuery<TMediaEndpointResult<'getMyMedia'>>({
    queryKey: ['media', 'my'],
    queryFn: async () => {
      const { data } = await apiGetMediaMy();
      return data;
    }
  });

export const mutationMediaEdit = () =>
  makeApiMutation<TMediaEndpointResult<'patchMedia'>, { mediaId: string }>({
    mutationKey: ['media', 'edit'],
    mutationFn: async (data) => {
      const { data: responseData } = await apiPostMediaEdit(data);
      return responseData;
    }
  });

export const mutationYoutubeImportFromYoutube = () =>
  makeApiMutation<TYoutubeEndpointResult<'importFromYoutube'>>({
    mutationKey: ['youtube', 'importFromYoutube'],
    mutationFn: async () => {
      const { data } = await apiPostYoutubeImportFromYoutube();
      return data;
    }
  });

export const mutationJobsTest = () =>
  makeApiMutation<TJobsEndpointResult<'testJob'>>({
    mutationKey: ['jobs', 'test'],
    mutationFn: async () => {
      const { data } = await apiPostJobsTest();
      return data;
    }
  });
