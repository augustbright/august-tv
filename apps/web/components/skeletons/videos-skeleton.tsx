import { times } from 'lodash';

import { Skeleton } from '../ui/skeleton';

export const VideosSkeleton = () => (
  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4'>
    {times(12).map((idx) => (
      <VideoThumbnailSkeleton key={idx} />
    ))}
  </div>
);

const VideoThumbnailSkeleton = () => (
  <div className='flex flex-col gap-2 rounded-lg p-1 pb-4'>
    <Skeleton className='w-full rounded-lg aspect-video flex justify-center items-center' />
    <div className='flex gap-2'>
      <Skeleton className='w-10 h-10 rounded-full shrink-0' />
      <div className='flex flex-col w-full gap-2'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-1/2' />
      </div>
    </div>
  </div>
);
