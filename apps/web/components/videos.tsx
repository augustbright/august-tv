'use client';

import { Query } from '@/components/Query';
import { queryFeedLatest } from '@/queries/feedLatest';

import { VideosSkeleton } from './skeletons/videos-skeleton';
import { VideoThumbnail } from './video-thumbnail';

export const Videos = ({
  query
}: {
  query: ReturnType<typeof queryFeedLatest>;
}) => {
  return (
    <Query
      query={query}
      loading={VideosSkeleton}
      error={Query.ERROR.ALERT}
    >
      {({ data: { data: items } }) => {
        if (!items?.length) {
          return (
            <div className='w-full flex justify-center text-secondary'>
              No videos found
            </div>
          );
        }
        return (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4'>
            {items.map((video) => (
              <VideoThumbnail
                key={video.id}
                video={video}
              />
            ))}
          </div>
        );
      }}
    </Query>
  );
};
