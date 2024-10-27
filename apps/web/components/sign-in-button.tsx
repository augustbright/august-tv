import { useSignInDialog } from '@/app/_sign-in/sign-in-dialog';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

import { LogIn } from 'lucide-react';
import React from 'react';

import { ButtonProps, buttonVariants } from './ui/button';

export const SignInButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const { setOpen } = useSignInDialog();
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={() => setOpen('signIn')}
        // eslint-disable-next-line react/no-children-prop
        children={
          <>
            <LogIn className='w-4 h-4 mr-2' />
            <span>Sign in</span>
          </>
        }
        {...props}
      />
    );
  }
);
SignInButton.displayName = 'SignInButton';
