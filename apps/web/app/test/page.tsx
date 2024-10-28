'use client';

import { Guard, RedirectHome } from '@/components/guard';

export default function TestPage() {
  return (
    <Guard
      roles={['admin']}
      fallback={<RedirectHome />}
    >
      <div className='grid grid-cols-12'>
        <div className='col-start-4 col-end-10 flex flex-col gap-5 items-center'>
          <h1 className='text-2xl col-span-12 font-bold'>Test Page</h1>
        </div>
      </div>
    </Guard>
  );
}
