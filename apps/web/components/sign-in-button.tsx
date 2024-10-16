import { useUser } from '@/hooks/useUser';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

import { LogIn } from 'lucide-react';
import React from 'react';

import { ButtonProps, buttonVariants } from './ui/button';

export const SignInButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const { signIn } = useUser();
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={() => signIn.google.mutate()}
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
