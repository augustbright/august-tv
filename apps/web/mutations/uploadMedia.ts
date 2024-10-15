import { api } from '@/api';
import { KEY } from '@/queries/keys';
import { getQueryClient } from '@/queries/queryClient';
import { TMediaEndpointResult } from '@august-tv/dto';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

const validateMediaFile = (media: File) => {
  if (media.size > 50 * 1024 * 1024) {
    return 'File size is too large';
  }

  if (!media.type.startsWith('video/')) {
    return 'File type is not supported';
  }

  return null;
};

export const mutateUploadMedia = (): UseMutationOptions<
  TMediaEndpointResult<'uploadMedia'>,
  Error,
  File
> => ({
  mutationFn: async (file) => {
    const error = validateMediaFile(file);
    if (error) {
      throw new Error(error);
    }
    const formData = new FormData();

    formData.append('file', file, file.name);

    const result = await api((r) => r.media.upload).post(formData);
    getQueryClient().invalidateQueries({
      queryKey: KEY.MY_MEDIA
    });
    return result.data as TMediaEndpointResult<'uploadMedia'>;
  }
});

export const useMutateUploadMedia = () => useMutation(mutateUploadMedia());
