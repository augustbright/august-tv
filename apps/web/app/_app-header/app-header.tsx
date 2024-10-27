'use client';

import { getUserCurrent } from '@/api/user';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { cn } from '@/lib/utils';

import { Hop, TriangleAlert } from 'lucide-react';
import Link from 'next/link';

import { useSignInDialog } from '../_sign-in/sign-in-dialog';
import { AdminLink } from './admin-link';
import { AppUploadButton } from './app-upload-button';
import { AppUserPanel } from './app-user-panel';
import { Notifier } from './notifier';
import { ScreenSize } from './screen-size';

export const AppHeader = () => {
  const { data } = getUserCurrent.useQuery();
  const { setOpen } = useSignInDialog();

  return (
    <header
      className={cn(data?.decoded?.email_verified === false ? 'h-24' : 'h-16')}
    >
      <div className='fixed top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        {data?.decoded?.email_verified === false && (
          <div className='h-10 flex items-center gap-4 px-4 py-2 bg-amber-300 text-black'>
            <TriangleAlert className='h-5 text-black' />
            <p>
              <span className='font-bold'>Your email is not verified.</span>{' '}
              Please check your email and click on the link to verify your
              account.
            </p>
            <Button
              variant='inline-link'
              onClick={() => setOpen('resend-email')}
            >
              Need help?
            </Button>
          </div>
        )}
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
      </div>
    </header>
  );
};
