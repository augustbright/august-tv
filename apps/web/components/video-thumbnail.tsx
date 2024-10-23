import { ThumbnailPicture } from '@/components/thumbnail-picture';

import Link from 'next/link';

export const VideoThumbnail = ({
  video
}: {
  video: {
    id: string;
    title: string;
    createdAt: Date;
    thumbnail: {
      medium: {
        publicUrl: string;
      };
    } | null;
    author: {
      nickname: string;
      picture: {
        small: {
          publicUrl: string;
        };
      } | null;
    };
  };
}) => {
  return (
    <Link
      href={`/v/${video.id}`}
      className='flex flex-col gap-2 hover:bg-muted/50 rounded-lg p-1 pb-4'
    >
      <ThumbnailPicture
        thumbnail={video.thumbnail}
        alt={video.title}
        width={600}
        height={600}
      />
    </Link>
  );
};
