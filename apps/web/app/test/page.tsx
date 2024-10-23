'use client';

import { Guard, RedirectHome } from '@/components/guard';

export default function TestPage() {
  return (
    <Guard
      roles={['admin']}
      fallback={<RedirectHome />}
    >
      <div className='flex flex-col gap-5 items-center'>
        <h1 className='text-2xl font-bold'>Test Page</h1>
      </div>
    </Guard>
  );
}
