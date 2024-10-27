import { ThumbnailPicture } from '@/components/thumbnail-picture';

import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export const VideoAsideItem = ({
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
    category: {
      name: string;
    } | null;
  };
}) => (
  <Link
    href={`/v/${video.id}`}
    className='grid grid-cols-5 gap-2 hover:bg-muted/50 rounded-lg p-1'
  >
    <ThumbnailPicture
      thumbnail={video.thumbnail}
      alt={video.title}
      width={600}
      height={600}
      className='col-span-2'
    />
    <div className='col-span-3 flex flex-col gap-2'>
      <div>
        <h3 className='text-lg font-medium max-h-12 leading-6 overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] '>
          {video.title}
        </h3>
        <p className='text-sm'>{video.author.nickname}</p>
        <p className='text-sm flex gap-2'>
          {formatDistanceToNow(new Date(video.createdAt))} ago
        </p>
      </div>
    </div>
  </Link>
);
