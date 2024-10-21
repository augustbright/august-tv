'use client';

import { getFeedLatest } from '@/api/feed';
import { Videos } from '@/components/videos';

export const Feed = ({
  query
}: {
  query: ReturnType<typeof getFeedLatest.query>;
}) => {
  return (
    <div className='flex flex-col gap-4'>
      <Videos query={query} />
    </div>
  );
};
