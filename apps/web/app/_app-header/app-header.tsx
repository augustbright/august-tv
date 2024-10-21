import { ModeToggle } from '@/components/ui/mode-toggle';

import { Hop } from 'lucide-react';
import Link from 'next/link';

import { AdminLink } from './admin-link';
import { AppUploadButton } from './app-upload-button';
import { AppUserPanel } from './app-user-panel';
import { Notifier } from './notifier';
import { ScreenSize } from './screen-size';

export const AppHeader = () => {
  return (
    <header className='fixed top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='flex items-center gap-4 px-4 py-2'>
        <Link
          href='/'
          className='flex gap-2 items-center'
        >
          <Hop className='h-5 text-primary' />
          <h1 className='text-lg font-bold text-primary'>August TV</h1>
        </Link>
        <ScreenSize />
        <div className='flex-1' />
        <AdminLink />
        <AppUploadButton />
        <Notifier />
        <AppUserPanel />
        <ModeToggle />
      </div>
    </header>
  );
};
