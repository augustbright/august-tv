'use client';

import { getFeedLatest } from '@/api/feed';
import { Query } from '@/components/Query';
import { cn } from '@/lib/utils';

import { VideoAsideItem } from './video-aside-item';

export const VideAside = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Query
        loading={Query.LOADING.ROW}
        query={getFeedLatest.query()}
      >
        {({ data: { data: videos } }) =>
          videos.map((video) => (
            <VideoAsideItem
              key={video.id}
              video={video}
            />
          ))
        }
      </Query>
    </div>
  );
};
