import { Query } from '@/components/Query';
import { Guard } from '@/components/guard';
import { Badge } from '@/components/ui/badge';

import { UserRound } from 'lucide-react';
import React from 'react';

import { Button } from '../../components/ui/button';
import {
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../../components/ui/dialog';
import { useSignInDialog } from './sign-in-dialog';
import { TSignInMachine } from './state-machine';

export const DialogContentAccountCreated = ({
  machine
}: {
  machine: TSignInMachine;
}) => {
  const { setOpen } = useSignInDialog();
  return (
    <Guard
      fallback={null}
      loading={Query.LOADING.ROW}
    >
      {({ data: current, emailVerified }) => (
        <>
          <DialogHeader>
            <DialogTitle>Your account is created 🎉</DialogTitle>
          </DialogHeader>
          {emailVerified ? (
            <div>
              <p className='text-sm'>
                ✅ Your account is verified and ready to use.
              </p>
            </div>
          ) : (
            <div className='flex flex-col items-center gap-2 py-8'>
              <p className='text-sm '>A verification link is sent to:&nbsp;</p>
              <Badge
                variant='outline'
                className='p-3'
              >
                {current?.email}
              </Badge>
              <p className='text-sm text-gray-500'>
                Please check your email and click on the link to verify your
                account.
                <br />
                <Button
                  variant='inline-link'
                  className='font-normal'
                  onClick={() =>
                    machine.dispatch({ type: 'setPage', page: 'resend-email' })
                  }
                >
                  {`Didn’t receive verification email?`}
                </Button>
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              className=''
              variant='default'
            >
              <UserRound className='w-4 h-4 mr-2' />
              Tell us about yourself
            </Button>
            <Button
              variant='link'
              className='col-start-2 col-end-3 p-3'
              onClick={() => setOpen(null)}
            >
              Skip
            </Button>
          </DialogFooter>
        </>
      )}
    </Guard>
  );
};
