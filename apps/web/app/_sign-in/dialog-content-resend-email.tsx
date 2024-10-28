import { postUserSendVerificationEmail } from '@/api/user';
import { Query } from '@/components/Query';
import { Guard } from '@/components/guard';
import { toast } from '@/components/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

import React from 'react';

import { Button } from '../../components/ui/button';
import {
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../../components/ui/dialog';
import { useSignInDialog } from './sign-in-dialog';
import { TSignInMachine } from './state-machine';

export const DialogContentResendEmail = ({
  machine
}: {
  machine: TSignInMachine;
}) => {
  const { mutateAsync: resendEmail, isPending: isResendingEmail } =
    postUserSendVerificationEmail.useMutation();

  const { setOpen } = useSignInDialog();
  return (
    <Guard
      fallback={null}
      loading={Query.LOADING.ROW}
    >
      {({ data: current }) => (
        <>
          <DialogHeader>
            <DialogTitle>{`Didn’t receive verification email?`}</DialogTitle>
          </DialogHeader>
          <div className='flex flex-col items-center gap-2 py-8'>
            <p className='text-sm '>A verification link is sent to:&nbsp;</p>
            <Badge
              variant='outline'
              className='p-3'
            >
              {current?.email}
            </Badge>
            <ul className='list-disc text-sm text-gray-500 px-8'>
              <li>
                To complete your registration, please check your inbox and click
                the link in the verification email we sent you.
              </li>
              <li>
                Check your <b>spam</b> or <b>junk</b> folder. Sometimes, emails
                can end up there by mistake.
              </li>
            </ul>
          </div>
          <DialogFooter>
            <Button
              className=''
              variant='default'
              disabled={isResendingEmail}
              onClick={async () => {
                await resendEmail();
                toast.success('Email sent');
                setOpen(null);
              }}
            >
              Resend email
            </Button>
          </DialogFooter>
        </>
      )}
    </Guard>
  );
};
