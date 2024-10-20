'use client';

import { Guard } from '@/components/guard';

export const ScreenSize = () => {
  return (
    <Guard
      roles={['admin']}
      fallback={null}
    >
      {() => (
        <div className='text-xs'>
          <span className='block sm:hidden'>xs</span>
          <span className='hidden sm:block md:hidden'>sm</span>
          <span className='hidden md:block lg:hidden'>md</span>
          <span className='hidden lg:block xl:hidden'>lg</span>
          <span className='hidden xl:block 2xl:hidden'>xl</span>
          <span className='hidden 2xl:block'>2xl</span>
        </div>
      )}
    </Guard>
  );
};
