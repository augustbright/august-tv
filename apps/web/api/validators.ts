export const validatePictureFile = (media: File) => {
  if (media.size > 5 * 1024 * 1024) {
    return 'File size is too large';
  }

  if (!media.type.startsWith('image')) {
    return 'File type is not supported';
  }

  return null;
};

export const validateMediaFile = (media: File) => {
  if (media.size > 50 * 1024 * 1024) {
    return 'File size is too large';
  }

  if (!media.type.startsWith('video/')) {
    return 'File type is not supported';
  }

  return null;
};
