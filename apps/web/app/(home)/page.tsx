'use client';

import { getFeedLatest } from '@/api/feed';

import { Feed } from './_feed/feed';

export default function Page() {
  return (
    <main className='flex flex-col gap-4 grow'>
      <Feed query={getFeedLatest.query()} />
    </main>
  );
}
