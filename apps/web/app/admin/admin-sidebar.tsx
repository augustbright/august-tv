'use client';

import { cn } from '@/lib/utils';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

export const AdminSidebar = () => {
  const segment = useSelectedLayoutSegment();
  return (
    <nav className='grid gap-4 text-sm text-muted-foreground'>
      <Link
        href='/admin/dashboard'
        className={cn('text-primary', {
          'font-semibold': segment === 'dashboard'
        })}
      >
        Dashboard
      </Link>
      <Link
        href='/admin/youtube'
        className={cn('text-primary', {
          'font-semibold': segment === 'youtube'
        })}
      >
        Youtube
      </Link>
      <Link
        href='/admin/test-job'
        className={cn('text-primary', {
          'font-semibold': segment === 'test-job'
        })}
      >
        Job tester
      </Link>
    </nav>
  );
};
