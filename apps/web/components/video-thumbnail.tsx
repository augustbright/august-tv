import { AuthorPicture } from '@/components/AuthorPicture';
import { ThumbnailPicture } from '@/components/thumbnail-picture';

import moment from 'moment';
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
      <div className='flex gap-2'>
        <AuthorPicture author={video.author} />
        <div>
          <h3 className='text-lg font-medium max-h-12 leading-6 overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] '>
            {video.title}
          </h3>
          <p className='text-sm'>{video.author.nickname}</p>
          <p className='text-sm'>
            {moment(video.createdAt).format('MMMM Do, YYYY')}
          </p>
        </div>
      </div>
    </Link>
  );
};
