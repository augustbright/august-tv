'use client';

import { getFeedSubscriptions } from '@/api/feed';
import { Guard, RedirectHome } from '@/components/guard';
import { Videos } from '@/components/videos';

export default function Page() {
  return (
    <Guard
      roles={['user']}
      fallback={<RedirectHome />}
    >
      <main className='flex flex-col gap-4 grow'>
        <div className='flex flex-col gap-4'>
          <Videos query={getFeedSubscriptions.query()} />
        </div>
      </main>
    </Guard>
  );
}
