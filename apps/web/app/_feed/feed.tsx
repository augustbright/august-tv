'use client';

import { useQueryFeedLatest } from '@/queries/feedLatest';
import { VideoThumbnail } from './video-thumbnail';

export const Feed = () => {
  const { data: feedLatest, isLoading } = useQueryFeedLatest();
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Latest Videos</h2>
      <div className="flex">
        {feedLatest?.data.map((video) => (
          <VideoThumbnail key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};
