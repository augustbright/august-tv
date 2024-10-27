import { useOnChange } from '@/hooks/useOnChange';
import { checkExhaustiveness } from '@august-tv/common';

import { atom, useAtom } from 'jotai';
import React from 'react';

import { Dialog, DialogContent } from '../../components/ui/dialog';
import { DialogContentAccountCreated } from './dialog-content-account-created';
import { DialogContentResendEmail } from './dialog-content-resend-email';
import { DialogContentSignIn } from './dialog-content-sign-in';
import { DialogContentSignUp } from './dialog-content-sign-up';
import { TSignInMachine, useSignInStateMachine } from './state-machine';

const signInDialogIsOpenAtom = atom<null | TSignInMachine['state']['page']>(
  null
);

export const SignInDialog = () => {
  const [open, setOpen] = useAtom(signInDialogIsOpenAtom);

  const machine = useSignInStateMachine();
  const renderContent = () => {
    switch (machine.state.page) {
      case 'empty':
        return null;
      case 'signIn':
        return <DialogContentSignIn machine={machine} />;
      case 'signUp':
        return <DialogContentSignUp machine={machine} />;
      case 'forgotPassword':
        return 'forgot password...';
      case 'account-created':
        return (
          <DialogContentAccountCreated
            machine={machine}
            onSkip={() => setOpen(null)}
          />
        );
      case 'resend-email':
        return <DialogContentResendEmail machine={machine} />;
      default:
        checkExhaustiveness(machine.state.page);
        return null;
    }
  };

  useOnChange(open, () => {
    if (open) {
      machine.dispatch({ type: 'setPage', page: open });
    } else {
      machine.dispatch({ type: 'setPage', page: 'empty' });
    }
  });

  return (
    <Dialog
      open={!!open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen ? 'signIn' : null);
      }}
    >
      <DialogContent>{renderContent()}</DialogContent>
    </Dialog>
  );
};
SignInDialog.displayName = 'SignInDialog';

export const useSignInDialog = () => {
  const [open, setOpen] = useAtom(signInDialogIsOpenAtom);

  return {
    open,
    setOpen
  };
};
