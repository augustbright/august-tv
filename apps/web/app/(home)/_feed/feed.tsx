'use client';

import { Videos } from '@/components/videos';
import { queryFeedLatest } from '@/queries/feedLatest';

export const Feed = ({
  query
}: {
  query: ReturnType<typeof queryFeedLatest>;
}) => {
  return (
    <div className='flex flex-col gap-4'>
      <Videos query={query} />
    </div>
  );
};
