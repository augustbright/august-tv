'use client';

import { queryFeedLatest } from '@/queries/feedLatest';

import { Feed } from './_feed/feed';

export default function Page() {
  return (
    <main className='flex flex-col gap-4 grow'>
      <Feed query={queryFeedLatest()} />
    </main>
  );
}
