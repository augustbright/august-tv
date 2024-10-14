'use client';

import { cn } from '@/lib/utils';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

export const ProfileSidebar = () => {
  const segment = useSelectedLayoutSegment();
  return (
    <nav
      className='grid gap-4 text-sm text-muted-foreground'
      x-chunk='dashboard-04-chunk-0'
    >
      <Link
        href='/profile/general'
        className={cn('text-primary', {
          'font-semibold': segment === 'general'
        })}
      >
        General
      </Link>
      <Link
        href='/profile/my-videos'
        className={cn('text-primary', {
          'font-semibold': segment === 'my-videos'
        })}
      >
        My Videos
      </Link>
    </nav>
  );
};
